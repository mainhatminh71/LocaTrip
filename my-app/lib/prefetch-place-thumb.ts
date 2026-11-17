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

/** Warm browser HTTP cache for place thumbs (list → modal feels instant). */
export function prefetchPlaceThumb(
  src?: string | null | Array<string | null | undefined>,
): void {
  if (typeof window === "undefined") return;
  for (const url of normalizeCandidates(src)) {
    if (warmed.has(url)) continue;
    warmed.add(url);
    const img = new Image();
    img.decoding = "async";
    img.referrerPolicy = url.startsWith("/api/r2-media")
      ? "strict-origin-when-cross-origin"
      : "no-referrer";
    img.src = url;
  }
}
