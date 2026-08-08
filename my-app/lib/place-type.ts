import type { RecommendedPlace } from "@/lib/discovery";
import type { TripPlace } from "@/lib/trip";

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

type PlaceLike = Pick<RecommendedPlace, "category" | "tags" | "title"> | {
  category?: string;
  tags?: string[];
  title?: string;
};

/** Lodging (hotel / homestay / …) — not an activity stop. */
export function isAccommodation(place: PlaceLike): boolean {
  if (place.tags?.some((t) => HOTEL_TAGS.has(t))) return true;
  if (place.category && HOTEL_CATEGORY_RE.test(place.category)) return true;
  if (place.title && HOTEL_CATEGORY_RE.test(place.title)) return true;
  return false;
}

const TAG_KIND_LABEL: Array<{ tag: string; label: string }> = [
  { tag: "category:coffee", label: "Cà phê" },
  { tag: "category:restaurant", label: "Ăn uống" },
  { tag: "category:bakery", label: "Tiệm bánh" },
  { tag: "category:bar_pub", label: "Bar / pub" },
  { tag: "category:attraction", label: "Tham quan" },
  { tag: "category:garden_park", label: "Công viên" },
  { tag: "category:farm", label: "Nông trại" },
  { tag: "category:shopping", label: "Mua sắm" },
  { tag: "category:entertainment", label: "Giải trí" },
  { tag: "category:spa_massage", label: "Spa" },
  { tag: "category:market", label: "Chợ" },
];

const RAW_KIND_RE: Array<{ re: RegExp; label: string }> = [
  { re: /cà\s*phê|cafe|coffee/i, label: "Cà phê" },
  { re: /nhà\s*hàng|quán\s*ăn|restaurant|ăn\s*uống|ẩm\s*thực/i, label: "Ăn uống" },
  { re: /bakery|tiệm\s*bánh|bánh/i, label: "Tiệm bánh" },
  { re: /bar|pub|lounge/i, label: "Bar / pub" },
  { re: /công\s*viên|park|garden|vườn/i, label: "Công viên" },
  { re: /farm|nông\s*trại|đồi\s*chè|đồi\s*dâu/i, label: "Nông trại" },
  { re: /chợ|market/i, label: "Chợ" },
  { re: /spa|massage/i, label: "Spa" },
  { re: /mua\s*sắm|shopping|mall/i, label: "Mua sắm" },
  { re: /giải\s*trí|entertainment/i, label: "Giải trí" },
  { re: /tham\s*quan|attraction|điểm\s*đến|check.?in|bảo\s*tàng|nhà\s*thờ|waterfall|thác/i, label: "Tham quan" },
];

/** Short VN eyebrow for itinerary visit cards. */
export function visitKindLabel(place: PlaceLike): string {
  if (isAccommodation(place)) return "Lưu trú";
  for (const { tag, label } of TAG_KIND_LABEL) {
    if (place.tags?.includes(tag)) return label;
  }
  const raw = place.category || "";
  for (const { re, label } of RAW_KIND_RE) {
    if (re.test(raw)) return label;
  }
  if (raw.trim()) {
    // Prefer human category string over generic "Tham quan"
    return raw.trim();
  }
  return "Tham quan";
}

const GENERIC_STOP_TITLES = new Set([
  "điểm dừng",
  "diem dung",
  "stop",
  "break",
  "rest",
]);

export function visitDisplayTitle(place: TripPlace | PlaceLike): string {
  const title = "title" in place ? place.title?.trim() : undefined;
  if (title && !GENERIC_STOP_TITLES.has(title.toLowerCase())) return title;
  if (place.category?.trim() && !GENERIC_STOP_TITLES.has(place.category.trim().toLowerCase())) {
    return place.category.trim();
  }
  return "Nghỉ ngơi";
}

