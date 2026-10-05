/**
 * Helpers for Cloudflare R2 place thumbnails.
 * Public `*.r2.dev` URLs often fail (TLS reset / rate-limit) in some networks —
 * serve via same-origin `/api/r2-media` instead.
 */

const R2_PUBLIC_HOST_RE = /\.r2\.dev$/i;

export function getConfiguredR2PublicBase(): string {
  return (process.env.R2_PUBLIC_URL || "").trim().replace(/\/$/, "");
}

/** Extract object key from an R2 public URL, or null if not R2. */
export function r2ObjectKeyFromUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    const configured = getConfiguredR2PublicBase();
    const isConfiguredHost =
      configured &&
      trimmed.toLowerCase().startsWith(`${configured.toLowerCase()}/`);
    const isR2Dev = R2_PUBLIC_HOST_RE.test(parsed.hostname);
    if (!isConfiguredHost && !isR2Dev) return null;
    const key = decodeURIComponent(parsed.pathname.replace(/^\/+/, ""));
    return key || null;
  } catch {
    return null;
  }
}

/** Same-origin URL that streams the object through our API. */
export function r2MediaProxyPath(key: string): string {
  const clean = key.replace(/^\/+/, "");
  return `/api/r2-media?key=${encodeURIComponent(clean)}`;
}
