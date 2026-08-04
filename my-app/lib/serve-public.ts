import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const publicDir = path.join(process.cwd(), "public");

function safeJoin(...parts: string[]): string | null {
  const resolved = path.resolve(publicDir, ...parts);
  const rel = path.relative(publicDir, resolved);
  if (rel.startsWith("..") || path.isAbsolute(rel)) return null;
  return resolved;
}

function contentType(filePath: string): string {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".js") || filePath.endsWith(".mjs"))
    return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg"))
    return "image/jpeg";
  if (filePath.endsWith(".webp")) return "image/webp";
  if (filePath.endsWith(".woff2")) return "font/woff2";
  if (filePath.endsWith(".woff")) return "font/woff";
  return "application/octet-stream";
}

/** Read first existing candidate under public/, safely. */
export async function servePublicFile(
  candidates: string[][],
): Promise<Response | null> {
  for (const parts of candidates) {
    const filePath = safeJoin(...parts);
    if (!filePath || !existsSync(filePath)) continue;
    const body = await readFile(filePath);
    return new Response(body, {
      status: 200,
      headers: {
        "content-type": contentType(filePath),
        "cache-control": "public, max-age=60",
      },
    });
  }
  return null;
}

export const SCRAPE_SITE = ["scrape", "locatrip.framer.website"] as const;
