const PROXY_HOSTS = new Set([
  "lh3.googleusercontent.com",
  "lh4.googleusercontent.com",
  "lh5.googleusercontent.com",
  "lh6.googleusercontent.com",
  "streetviewpixels-pa.googleapis.com",
]);

/** Route Google place thumbnails through same-origin media-proxy when needed. */
export function proxiedMediaUrl(url?: string | null): string | undefined {
  if (!url || typeof url !== "string") return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "https:" && PROXY_HOSTS.has(parsed.hostname)) {
      return `/api/media-proxy?url=${encodeURIComponent(trimmed)}`;
    }
  } catch {
    return trimmed;
  }
  return trimmed;
}
