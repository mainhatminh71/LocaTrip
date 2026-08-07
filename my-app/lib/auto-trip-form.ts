import type { TripProgressStatus } from "@/lib/api/trips";
import type { BudgetLevel, Pace } from "@/lib/trip";

export type ChipOption = { value: string; label: string };

/**
 * Option `value` must match LocalTrip TAG_MASTER / TRIP_TYPE_MAP strings.
 * Soft prefs that auto-planner can actually score are only:
 * atmosphere | specialty | feature | amenities | service
 * (see ALLOWED_TAGS_MAP in tagging.service.ts — category/poiRole do not soft-score).
 */

export const FORM_TRIP_TYPE_OPTIONS: ChipOption[] = [
  { value: "backpacking", label: "Phượt / ngoại ô" },
  { value: "exploration", label: "Khám phá & check-in" },
  { value: "relaxation", label: "Nghỉ dưỡng" },
  { value: "family_fun", label: "Gia đình vui chơi" },
  { value: "foodie_nightlife", label: "Ẩm thực & đêm" },
];

export const FORM_TARGET_CUSTOMER_OPTIONS: ChipOption[] = [
  { value: "couple", label: "Cặp đôi" },
  { value: "family", label: "Gia đình" },
  { value: "solo", label: "Một mình" },
  { value: "group", label: "Nhóm bạn" },
  { value: "backpacker", label: "Backpacker" },
  { value: "business", label: "Công tác" },
];

/** atmosphere:* — soft +15 when allowed for place group */
export const FORM_ATMOSPHERE_OPTIONS: ChipOption[] = [
  { value: "atmosphere:peaceful", label: "Yên bình" },
  { value: "atmosphere:romantic", label: "Lãng mạn" },
  { value: "atmosphere:cozy", label: "Ấm cúng" },
  { value: "atmosphere:trendy", label: "Trendy" },
  { value: "atmosphere:luxurious", label: "Sang trọng" },
  { value: "atmosphere:rustic", label: "Mộc mạc" },
  { value: "atmosphere:dreamy", label: "Mộng mơ" },
  { value: "atmosphere:quiet", label: "Tĩnh lặng" },
  { value: "atmosphere:crowded", label: "Nhộn nhịp" },
];

/** specialty:* + dining features that score on restaurant/coffee/bar */
export const FORM_FOOD_OPTIONS: ChipOption[] = [
  { value: "specialty:local_specialty", label: "Đặc sản địa phương" },
  { value: "specialty:street_food", label: "Ăn vặt" },
  { value: "specialty:bbq", label: "BBQ" },
  { value: "specialty:grilled", label: "Nướng" },
  { value: "specialty:vegetarian", label: "Chay" },
  { value: "specialty:hotpot", label: "Lẩu" },
  { value: "specialty:seafood", label: "Hải sản" },
  { value: "specialty:breakfast_brunch", label: "Brunch / sáng" },
  { value: "specialty:buffet", label: "Buffet" },
  { value: "feature:outdoor_seating", label: "Ngồi ngoài trời" },
  { value: "feature:live_music", label: "Nhạc sống" },
  { value: "feature:rooftop", label: "Rooftop" },
];

/**
 * feature:* + amenities:* used heavily on attraction / coffee / tripType childTags.
 * Avoid category:* here — auto-planner soft-score ignores them.
 */
export const FORM_ACTIVITY_OPTIONS: ChipOption[] = [
  { value: "feature:scenic_view", label: "View đẹp" },
  { value: "feature:photo_spots", label: "Check-in" },
  { value: "feature:flower_field", label: "Cánh đồng hoa" },
  { value: "feature:lake_view", label: "View hồ" },
  { value: "feature:picnic_area", label: "Dã ngoại" },
  { value: "feature:campfire", label: "Lửa trại" },
  { value: "feature:balcony", label: "Ban công / view cao" },
  { value: "amenities:spa", label: "Spa" },
  { value: "amenities:swimming_pool", label: "Hồ bơi" },
  { value: "amenities:parking", label: "Có chỗ đậu xe" },
  { value: "amenities:motorbike_rental", label: "Thuê xe máy" },
];

/** Hard-scored in auto-planner (+50 / −30). */
export const FORM_CONSTRAINT_OPTIONS: ChipOption[] = [
  { value: "amenities:pet_allowed", label: "Mang thú cưng" },
  { value: "feature:pet_friendly", label: "Pet-friendly" },
  { value: "amenities:kid_friendly", label: "Có trẻ nhỏ" },
  { value: "amenities:wheelchair_accessible", label: "Xe lăn / tiếp cận" },
];

export type AutoTripStartMode = "gps" | "preset";
export type AutoTripHoursMode = "preset" | "custom";

/** Local calendar day as YYYY-MM-DD. */
export function todayYmd(d = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export type AutoTripDraft = {
  /** User-facing trip name for My Trips (required to save). */
  title: string;
  startId: string;
  /** GPS vs preset list for start coordinates. */
  startMode: AutoTripStartMode;
  /** Free-text km; parsed when building the AutoTrip request. */
  radiusKm: string;
  /** Free-text km; hop limit between consecutive stops. */
  maxDistance: string;
  /** Return to start at end of day. */
  isRoundTrip: boolean;
  budgetLevel: BudgetLevel;
  pace: Pace;
  /** Trip calendar day YYYY-MM-DD */
  date: string;
  /** Derived on server for saved trips: OnGoing → Done; Pending = unsaved proposals only. */
  tripStatus: TripProgressStatus;
  hours: string; // "HH:MM|HH:MM"
  /** Preset chips vs free time inputs. */
  hoursMode: AutoTripHoursMode;
  tripType: string | null;
  targetCustomer: string | null;
  atmosphere: string[];
  food: string[];
  activities: string[];
  constraints: string[];
  showRoad: boolean;
};

export const DEFAULT_AUTO_TRIP_DRAFT: AutoTripDraft = {
  title: "",
  startId: "center",
  startMode: "preset",
  radiusKm: "10",
  maxDistance: "5",
  isRoundTrip: true,
  budgetLevel: "mid-range",
  pace: "moderate",
  date: todayYmd(),
  tripStatus: "OnGoing",
  hours: "08:30|21:30",
  hoursMode: "preset",
  tripType: null,
  targetCustomer: null,
  atmosphere: [],
  food: [],
  activities: [],
  constraints: [],
  showRoad: false,
};

const LABEL_MAP = new Map<string, string>(
  [
    ...FORM_TRIP_TYPE_OPTIONS,
    ...FORM_TARGET_CUSTOMER_OPTIONS,
    ...FORM_ATMOSPHERE_OPTIONS,
    ...FORM_FOOD_OPTIONS,
    ...FORM_ACTIVITY_OPTIONS,
    ...FORM_CONSTRAINT_OPTIONS,
  ].map((o) => [o.value, o.label] as const),
);

export function labelForValue(value: string): string {
  return LABEL_MAP.get(value) || value.split(":").pop()?.replace(/_/g, " ") || value;
}

/** Short Vietnamese preview of soft choices (UI labels, not raw tag ids). */
export function previewSoftLabels(draft: AutoTripDraft): string[] {
  const values = [
    draft.tripType,
    draft.targetCustomer,
    ...draft.atmosphere,
    ...draft.food,
    ...draft.activities,
    ...draft.constraints,
  ].filter(Boolean) as string[];
  return values.map(labelForValue);
}

export function toggleMulti(
  list: string[],
  value: string,
  max?: number,
): string[] {
  if (list.includes(value)) return list.filter((v) => v !== value);
  if (max != null && list.length >= max) return list;
  return [...list, value];
}

/** Normalize `<input type="time">` / draft values to `HH:MM` (same calendar day window). */
export function normalizeHHMM(raw: string): string | null {
  const m = String(raw || "")
    .trim()
    .match(/^([01]?\d|2[0-3]):([0-5]\d)/);
  if (!m) return null;
  return `${m[1]!.padStart(2, "0")}:${m[2]}`;
}

export function parseDraftHours(hours: string): {
  start: string;
  end: string;
} {
  const [a, b] = String(hours || "").split("|");
  return {
    start: normalizeHHMM(a || "") || "08:30",
    end: normalizeHHMM(b || "") || "21:30",
  };
}

export function joinDraftHours(start: string, end: string): string {
  const s = normalizeHHMM(start) || "08:30";
  const e = normalizeHHMM(end) || "21:30";
  return `${s}|${e}`;
}

export function minutesFromHHMM(hhmm: string): number | null {
  const n = normalizeHHMM(hhmm);
  if (!n) return null;
  const [h, m] = n.split(":").map(Number);
  return h! * 60 + m!;
}

/** Same-day window: end must be strictly after start (no overnight). */
export function validateSameDayHours(
  start: string,
  end: string,
): string | null {
  const s = minutesFromHHMM(start);
  const e = minutesFromHHMM(end);
  if (s == null || e == null) {
    return "Giờ bắt đầu / kết thúc phải đúng định dạng HH:MM.";
  }
  if (e <= s) {
    return "Giờ kết thúc phải sau giờ bắt đầu trong cùng một ngày.";
  }
  return null;
}

/** Required trip name + calendar date (≥ today when creating; past OK when editing). */
export function validateTripTitleAndDate(
  draft: Pick<AutoTripDraft, "title" | "date">,
  opts?: { allowPast?: boolean; today?: string },
): string | null {
  const today = opts?.today ?? todayYmd();
  const title = draft.title.trim();
  if (!title) {
    return "Vui lòng nhập tên chuyến đi.";
  }
  if (title.length > 120) {
    return "Tên chuyến đi tối đa 120 ký tự.";
  }
  const day = (draft.date || "").trim().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
    return "Vui lòng chọn ngày đi.";
  }
  if (!opts?.allowPast && day < today) {
    return "Ngày đi phải từ hôm nay trở đi.";
  }
  return null;
}

/** Groups auto-planner can soft-score via ALLOWED_TAGS_MAP. */
const SCORABLE_PREFIXES = [
  "atmosphere:",
  "specialty:",
  "feature:",
  "amenities:",
  "service:",
] as const;

export function isScorablePreferenceTag(tag: string): boolean {
  return SCORABLE_PREFIXES.some((p) => tag.startsWith(p));
}
