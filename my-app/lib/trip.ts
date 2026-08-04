/** Client + server types for LocalTrip auto trip flow. */

export type BudgetLevel = "budget" | "mid-range" | "luxury";
export type Pace = "relaxed" | "moderate" | "active";

export type AutoTripRequest = {
  startLatitude: number;
  startLongitude: number;
  radiusKm: number;
  budgetLevel: BudgetLevel;
  tripType?: string;
  targetCustomer?: string;
  preferences: string[];
  pace: Pace;
  showRoad?: boolean;
  startTimePerDay?: string;
  endTimePerDay?: string;
};

export type ScheduledVisit = {
  time: string;
  type: "visit";
  place: {
    placeId?: string;
    title: string;
    category?: string;
    address?: string;
    reviewRating?: number;
    priceRangeLow?: number;
    priceRangeMax?: number;
    areaType?: string;
  };
  warning?: { type: string; message: string };
};

export type ScheduledTravel = {
  time: string;
  type: "travel";
  durationMin: number;
  distanceKm: number;
  instruction: string;
};

export type ScheduleItem = ScheduledVisit | ScheduledTravel;

export type DayItinerary = {
  day: number;
  schedule: ScheduleItem[];
};

export type ItineraryOption = {
  optionId: number;
  title: string;
  totalScore: number;
  tripStyle: string;
  totalEstimatedCost: string;
  summary: string;
  itinerary: DayItinerary[];
};

export type AutoTripResult = {
  totalItineraries: number;
  itineraries: ItineraryOption[];
};

export type StoredAutoTrip = {
  request: AutoTripRequest;
  result: AutoTripResult;
  createdAt: string;
};

export const AUTO_TRIP_STORAGE_KEY = "locatrip.autoTrip";

export const START_PRESETS = [
  {
    id: "center",
    label: "Trung tâm Đà Lạt",
    latitude: 11.9404,
    longitude: 108.4583,
  },
  {
    id: "xuan-huong",
    label: "Hồ Xuân Hương",
    latitude: 11.9415,
    longitude: 108.438,
  },
  {
    id: "ga",
    label: "Ga Đà Lạt",
    latitude: 11.925,
    longitude: 108.451,
  },
  {
    id: "tuyen-lam",
    label: "Hồ Tuyền Lâm",
    latitude: 11.889,
    longitude: 108.432,
  },
  {
    id: "langbiang",
    label: "Langbiang / Lạc Dương",
    latitude: 12.04,
    longitude: 108.44,
  },
] as const;

export const HOURS_OPTIONS = [
  { value: "08:30|21:30", label: "08:30 – 21:30 (cả ngày)" },
  { value: "09:00|17:00", label: "09:00 – 17:00 (ban ngày)" },
  { value: "14:00|21:30", label: "14:00 – 21:30 (chiều tối)" },
] as const;

export const RADIUS_OPTIONS = [
  { value: 5, label: "5 km" },
  { value: 10, label: "10 km" },
  { value: 15, label: "15 km" },
  { value: 20, label: "20 km" },
] as const;

export const BUDGET_OPTIONS: { value: BudgetLevel; label: string; hint: string }[] = [
  { value: "budget", label: "Tiết kiệm", hint: "Ưu tiên chỗ giá nhẹ" },
  { value: "mid-range", label: "Trung bình", hint: "Cân bằng trải nghiệm" },
  { value: "luxury", label: "Cao cấp", hint: "Không khí sang / giá cao hơn" },
];

export const TRIP_TYPE_OPTIONS = [
  { value: "exploration", label: "Khám phá" },
  { value: "relaxation", label: "Nghỉ dưỡng" },
  { value: "backpacking", label: "Phượt / ngoại ô" },
  { value: "family_fun", label: "Gia đình" },
  { value: "foodie_nightlife", label: "Ẩm thực & đêm" },
] as const;

export const TARGET_CUSTOMER_OPTIONS = [
  { value: "solo", label: "Một mình" },
  { value: "couple", label: "Cặp đôi" },
  { value: "family", label: "Gia đình" },
  { value: "group", label: "Nhóm bạn" },
  { value: "backpacker", label: "Backpacker" },
] as const;

export const PREFERENCE_OPTIONS = [
  { value: "atmosphere:peaceful", label: "Yên bình" },
  { value: "atmosphere:cozy", label: "Ấm cúng" },
  { value: "atmosphere:romantic", label: "Lãng mạn" },
  { value: "atmosphere:dreamy", label: "Mộng mơ" },
  { value: "feature:scenic_view", label: "View đẹp" },
  { value: "feature:photo_spots", label: "Check-in" },
  { value: "feature:lake_view", label: "View hồ" },
  { value: "feature:flower_field", label: "Cánh đồng hoa" },
  { value: "specialty:local_specialty", label: "Đặc sản địa phương" },
  { value: "specialty:street_food", label: "Ăn vặt" },
  { value: "amenities:kid_friendly", label: "Thân thiện trẻ em" },
  { value: "amenities:pet_allowed", label: "Mang thú cưng" },
] as const;

export const PACE_OPTIONS: { value: Pace; label: string }[] = [
  { value: "relaxed", label: "Thoải mái" },
  { value: "moderate", label: "Vừa phải" },
  { value: "active", label: "Năng động" },
];

export function saveAutoTrip(data: StoredAutoTrip) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(AUTO_TRIP_STORAGE_KEY, JSON.stringify(data));
}

export function loadAutoTrip(): StoredAutoTrip | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(AUTO_TRIP_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAutoTrip;
  } catch {
    return null;
  }
}
