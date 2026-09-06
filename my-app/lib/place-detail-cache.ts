import type { PlaceDetail } from "@/lib/api/trips";

const placeCache = new Map<string, PlaceDetail>();
/** Successfully decoded image object URLs, keyed by raw thumbnail URL. */
const thumbBlobCache = new Map<string, string>();

export function getCachedPlaceDetail(placeId: string): PlaceDetail | null {
  const id = placeId.trim();
  if (!id) return null;
  return placeCache.get(id) ?? null;
}

export function setCachedPlaceDetail(placeId: string, place: PlaceDetail) {
  const id = placeId.trim();
  if (!id) return;
  placeCache.set(id, place);
}

export function getCachedThumbBlob(rawSrc: string): string | null {
  const key = rawSrc.trim();
  if (!key) return null;
  return thumbBlobCache.get(key) ?? null;
}

export function setCachedThumbBlob(rawSrc: string, objectUrl: string) {
  const key = rawSrc.trim();
  if (!key) return;
  const prev = thumbBlobCache.get(key);
  if (prev && prev !== objectUrl) {
    try {
      URL.revokeObjectURL(prev);
    } catch {
      /* ignore */
    }
  }
  thumbBlobCache.set(key, objectUrl);
}
