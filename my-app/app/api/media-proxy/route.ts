import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ALLOWED = new Set([
  "lh3.googleusercontent.com",
  "lh4.googleusercontent.com",
  "lh5.googleusercontent.com",
  "lh6.googleusercontent.com",
  "streetviewpixels-pa.googleapis.com",
]);

/**
 * Proxy Google place thumbnails (browser Referer often blocks lh3.*).
 * GET /api/media-proxy?url=https%3A%2F%2Flh3.googleusercontent.com%2F...
 */
export async function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get("url");
  if (!raw) {
    return NextResponse.json({ error: "url required" }, { status: 400 });
  }

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return NextResponse.json({ error: "invalid url" }, { status: 400 });
  }

  if (target.protocol !== "https:" || !ALLOWED.has(target.hostname)) {
    return NextResponse.json({ error: "host not allowed" }, { status: 400 });
  }

  try {
    // Browser-like headers: Google photo URLs often 403/404 bare bots.
    // Do not force-cache failures — only successful bodies get Cache-Control.
    const upstream = await fetch(target.toString(), {
      headers: {
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        "Accept-Language": "vi-VN,vi;q=0.9,en;q=0.8",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Referer: "https://www.google.com/",
      },
      cache: "no-store",
    });
    if (!upstream.ok) {
      return NextResponse.json(
        { error: `upstream ${upstream.status}` },
        { status: 502 },
      );
    }
    const type = upstream.headers.get("content-type") || "";
    if (type && !type.toLowerCase().startsWith("image/")) {
      return NextResponse.json(
        { error: `not an image (${type})` },
        { status: 502 },
      );
    }
    const buf = await upstream.arrayBuffer();
    if (!buf.byteLength || buf.byteLength < 32) {
      return NextResponse.json({ error: "empty image" }, { status: 502 });
    }
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": type || "image/jpeg",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "proxy failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
