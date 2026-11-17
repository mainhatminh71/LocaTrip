import { proxiedMediaUrl } from "@/lib/media-url";

const warmed = new Set<string>();

function normalizeCandidates(
  src?: string | null | Array<string | null | undefined>,
): string[] {
  const list = Array.isArray(src) ? src : [src];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of list) {
    const raw = String(item || "").trim();
    if (!raw) continue;
    const display = proxiedMediaUrl(raw) || raw;
    if (!display || seen.has(display)) continue;
    seen.add(display);
    out.push(display);
  }
  return out;
}

/**
 * Warm HTTP + browser image cache for place thumbs.
 * Same-origin `/api/r2-media` uses `fetch` so CF/browser cache hits when modal opens.
 */
export function prefetchPlaceThumb(
  src?: string | null | Array<string | null | undefined>,
): void {
  if (typeof window === "undefined") return;
  for (const url of normalizeCandidates(src)) {
    if (warmed.has(url)) continue;
    warmed.add(url);

    // Same-origin R2 proxy: populate Cache Storage / HTTP cache explicitly.
    if (url.startsWith("/api/r2-media") || url.startsWith(window.location.origin)) {
      void fetch(url, {
        method: "GET",
        credentials: "omit",
        cache: "force-cache",
        priority: "low",
      } as RequestInit).catch(() => {
        warmed.delete(url);
      });
    }

    const img = new Image();
    img.decoding = "async";
    img.referrerPolicy = url.startsWith("/api/r2-media")
      ? "strict-origin-when-cross-origin"
      : "no-referrer";
    img.src = url;
  }
}
