import { NextResponse } from "next/server";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { r2ObjectKeyFromUrl } from "@/lib/r2-media";

export const dynamic = "force-dynamic";

type R2BucketLike = {
  get: (
    key: string,
  ) => Promise<{
    body: ReadableStream | null;
    httpMetadata?: { contentType?: string };
    size?: number;
  } | null>;
};

let s3: S3Client | null = null;

function getS3(): S3Client | null {
  const endpoint = process.env.R2_ENDPOINT?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  if (!endpoint || !accessKeyId || !secretAccessKey) return null;
  if (!s3) {
    s3 = new S3Client({
      region: "auto",
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return s3;
}

function resolveKey(request: Request): string | null {
  const { searchParams } = new URL(request.url);
  const keyParam = searchParams.get("key")?.trim();
  if (keyParam) {
    const clean = decodeURIComponent(keyParam).replace(/^\/+/, "");
    if (!clean || clean.includes("..")) return null;
    return clean;
  }
  const urlParam = searchParams.get("url")?.trim();
  if (!urlParam) return null;
  return r2ObjectKeyFromUrl(urlParam);
}

async function fromWorkerBinding(key: string): Promise<Response | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const bucket = (env as { MEDIA?: R2BucketLike }).MEDIA;
    if (!bucket?.get) return null;
    const obj = await bucket.get(key);
    if (!obj?.body) return null;
    const type = obj.httpMetadata?.contentType || "image/jpeg";
    return new Response(obj.body, {
      status: 200,
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return null;
  }
}

async function fromS3(key: string): Promise<Response | null> {
  const client = getS3();
  const bucket = process.env.R2_BUCKET?.trim();
  if (!client || !bucket) return null;
  try {
    const out = await client.send(
      new GetObjectCommand({ Bucket: bucket, Key: key }),
    );
    if (!out.Body) return null;
    const bytes = await out.Body.transformToByteArray();
    return new NextResponse(Buffer.from(bytes), {
      status: 200,
      headers: {
        "Content-Type": out.ContentType || "image/jpeg",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return null;
  }
}

/**
 * Stream a place thumbnail from R2 (Worker binding or S3 credentials).
 * Avoids broken/blocked `*.r2.dev` public URLs in the browser.
 *
 * GET /api/r2-media?key=places%2FChIJ...%2Fthumb.jpg
 * GET /api/r2-media?url=https%3A%2F%2Fpub-....r2.dev%2Fplaces%2F...
 */
export async function GET(request: Request) {
  const key = resolveKey(request);
  if (!key) {
    return NextResponse.json({ error: "key or url required" }, { status: 400 });
  }
  if (!key.startsWith("places/")) {
    return NextResponse.json({ error: "key not allowed" }, { status: 400 });
  }

  const viaBinding = await fromWorkerBinding(key);
  if (viaBinding) return viaBinding;

  const viaS3 = await fromS3(key);
  if (viaS3) return viaS3;

  return NextResponse.json(
    { error: "R2 media unavailable (binding/credentials missing or object not found)" },
    { status: 502 },
  );
}
