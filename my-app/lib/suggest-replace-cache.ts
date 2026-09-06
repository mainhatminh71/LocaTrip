import type { AlternativePlaceSuggestion } from "@/lib/trip";
import type { PlaceAlternative } from "@/lib/api/trips";

export type SuggestReplaceCacheEntry = {
  /** Normalized suggestion rows for PlaceStopDetail */
  rows: AlternativePlaceSuggestion[];
  /** Raw server hits for ReplacePlaceModal */
  serverAlts: PlaceAlternative[];
  /** BE `fromCache` (or true when restored from a prior paid call). */
  fromCache: boolean;
  fetchedAt: number;
};

const cache = new Map<string, SuggestReplaceCacheEntry>();

/** Stable key for a stop on a saved trip (placeId so a swap starts a fresh slot). */
export function suggestReplaceCacheKey(opts: {
  tripId: string;
  dayIndex: number;
  scheduleIndex: number;
  placeId?: string | null;
}): string {
  const place = (opts.placeId || "").trim() || "_";
  return `${opts.tripId}|d${opts.dayIndex}|s${opts.scheduleIndex}|p${place}`;
}

export function getSuggestReplaceCache(
  key: string,
): SuggestReplaceCacheEntry | null {
  return cache.get(key) ?? null;
}

export function setSuggestReplaceCache(
  key: string,
  entry: Omit<SuggestReplaceCacheEntry, "fetchedAt">,
) {
  cache.set(key, {
    ...entry,
    fromCache: entry.fromCache !== false,
    fetchedAt: Date.now(),
  });
}

export function clearSuggestReplaceCache(key: string) {
  cache.delete(key);
}
