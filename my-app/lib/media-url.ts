import { r2MediaProxyPath, r2ObjectKeyFromUrl } from "@/lib/r2-media";

const PROXY_HOSTS = new Set([
  "lh3.googleusercontent.com",
  "lh4.googleusercontent.com",
  "lh5.googleusercontent.com",
  "lh6.googleusercontent.com",
  "streetviewpixels-pa.googleapis.com",
]);

/**
 * Display URL for place media.
 *
 * - Google lh3.*: use raw HTTPS in the browser with `referrerPolicy="no-referrer"`
 *   (Worker media-proxy often gets 403 from Google).
 * - Cloudflare R2 `*.r2.dev` / configured R2_PUBLIC_URL: rewrite to same-origin
 *   `/api/r2-media` — public r2.dev URLs frequently fail (TLS reset) in some networks.
 */
export function proxiedMediaUrl(url?: string | null): string | undefined {
  if (!url || typeof url !== "string") return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;

  // Already proxied.
  if (trimmed.startsWith("/api/r2-media")) return trimmed;

  const r2Key = r2ObjectKeyFromUrl(trimmed);
  if (r2Key) return r2MediaProxyPath(r2Key);

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:" && PROXY_HOSTS.has(parsed.hostname)) {
      return trimmed;
    }
  } catch {
    return trimmed;
  }
  return trimmed;
}
