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
 * Google lh3.* blocks Cloudflare Worker / server fetches (403 → media-proxy 502).
 * Prefer the raw HTTPS URL in the browser with `referrerPolicy="no-referrer"`
 * (see PlaceThumb). Do not route Google hosts through `/api/media-proxy`.
 */
export function proxiedMediaUrl(url?: string | null): string | undefined {
  if (!url || typeof url !== "string") return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
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
