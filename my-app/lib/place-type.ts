import type { RecommendedPlace } from "@/lib/discovery";

const HOTEL_TAGS = new Set([
  "category:hotel",
  "category:homestay",
  "category:resort",
  "category:hostel",
  "category:villa",
  "category:apartment",
]);

const HOTEL_CATEGORY_RE =
  /khách\s*sạn|hotel|homestay|resort|hostel|villa|apartment|nhà\s*nghỉ|biệt\s*thự|căn\s*hộ/i;

/** Lodging (hotel / homestay / …) — not an activity stop. */
export function isAccommodation(
  place: Pick<RecommendedPlace, "category" | "tags" | "title"> | {
    category?: string;
    tags?: string[];
    title?: string;
  },
): boolean {
  if (place.tags?.some((t) => HOTEL_TAGS.has(t))) return true;
  if (place.category && HOTEL_CATEGORY_RE.test(place.category)) return true;
  if (place.title && HOTEL_CATEGORY_RE.test(place.title)) return true;
  return false;
}
