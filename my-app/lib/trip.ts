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

export type TripPlace = {
  placeId?: string;
  title: string;
  category?: string;
  address?: string;
  reviewRating?: number;
  priceRangeLow?: number;
  priceRangeMax?: number;
  areaType?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
};

export type AlternativePlaceSuggestion = {
  rank: number;
  score: number;
  placeId?: string;
  title: string;
  category?: string;
  address?: string;
  reviewRating?: number;
  latitude?: number;
  longitude?: number;
  tags?: string[];
  distanceKm: number;
  savedKm?: number;
  missingTags?: string[];
  tradeOffMessage: string;
};

export type ScheduledVisit = {
  time: string;
  type: "visit";
  place: TripPlace;
  warning?: { type: string; message: string };
  topAlternatives?: AlternativePlaceSuggestion[];
};

export type ScheduledTravel = {
  time: string;
  type: "travel";
  durationMin: number;
  distanceKm: number;
  instruction: string;
  /** GeoJSON LineString geometry from OSRM when showRoad is true. */
  routeGeometry?: {
    type?: string;
    coordinates?: [number, number][];
  };
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

/** Cities available in setup (expand later: nha-trang, da-nang…). */
export const CITY_OPTIONS = [
  { id: "dalat", label: "Đà Lạt", hint: "dalat" },
] as const;

export type CityId = (typeof CITY_OPTIONS)[number]["id"];

export type StartPreset = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  description: string;
  thumbnail: string;
};

/** Start points keyed by city — only Đà Lạt for now. */
export const START_PRESETS_BY_CITY: Record<CityId, readonly StartPreset[]> = {
  dalat: [
    {
      id: "center",
      label: "Trung tâm Đà Lạt",
      latitude: 11.9404,
      longitude: 108.4583,
      description:
        "Nhịp phố núi quanh chợ và nhà thờ — điểm xuất phát thuận tiện để khám phá quán cà phê, ẩm thực và góc check-in trung tâm.",
      thumbnail: "/media/starts/center.jpg",
    },
    {
      id: "xuan-huong",
      label: "Hồ Xuân Hương",
      latitude: 11.9415,
      longitude: 108.438,
      description:
        "Trái tim xanh của Đà Lạt — mặt hồ êm, đường đi bộ và không khí se lạnh, lý tưởng để bắt đầu ngày thong thả.",
      thumbnail: "/media/starts/xuan-huong.jpg",
    },
    {
      id: "ga",
      label: "Ga Đà Lạt",
      latitude: 11.925,
      longitude: 108.451,
      description:
        "Nhà ga cổ nhất Đông Dương với kiến trúc Pháp độc đáo — điểm hẹn mang hơi thở lịch sử trước khi lên lịch các điểm xung quanh.",
      thumbnail: "/media/starts/ga.jpg",
    },
    {
      id: "tuyen-lam",
      label: "Hồ Tuyền Lâm",
      latitude: 11.889,
      longitude: 108.432,
      description:
        "Hồ lớn giữa rừng thông — không gian rộng, yên và gần các hoạt động ngoài trời; phù hợp chuyến nghỉ dưỡng / thiên nhiên.",
      thumbnail: "/media/starts/tuyen-lam.jpg",
    },
    {
      id: "langbiang",
      label: "Langbiang / Lạc Dương",
      latitude: 12.04,
      longitude: 108.44,
      description:
        "Đỉnh núi biểu tượng phía Bắc thành phố — khí hậu mát, săn mây và view cao nguyên; điểm bắt đầu cho lịch trình hướng ngoại ô.",
      thumbnail: "/media/starts/langbiang.jpg",
    },
  ],
};

/** @deprecated Prefer START_PRESETS_BY_CITY — kept for older imports. */
export const START_PRESETS = START_PRESETS_BY_CITY.dalat;

export const HOURS_OPTIONS = [
  { value: "08:30|21:30", label: "08:30 – 21:30 (cả ngày)" },
  { value: "09:00|17:00", label: "09:00 – 17:00 (ban ngày)" },
  { value: "14:00|21:30", label: "14:00 – 21:30 (chiều tối)" },
] as const;

export const RADIUS_OPTIONS = [
  { value: 8, label: "8 km" },
  { value: 10, label: "10 km" },
  { value: 15, label: "15 km" },
] as const;

/** Labels mirror AutoTrip estimatedCostStr ranges (đ / người / ngày). */
export const BUDGET_OPTIONS: { value: BudgetLevel; label: string; hint: string }[] = [
  {
    value: "budget",
    label: "150.000 – 300.000đ / người",
    hint: "Tiết kiệm",
  },
  {
    value: "mid-range",
    label: "300.000 – 700.000đ / người",
    hint: "Trung bình",
  },
  {
    value: "luxury",
    label: "700.000 – 1.500.000đ / người",
    hint: "Cao cấp",
  },
];

export const TRIP_TYPE_OPTIONS = [
  { value: "backpacking", label: "Phượt / ngoại ô" },
  { value: "exploration", label: "Khám phá & check-in" },
  { value: "relaxation", label: "Nghỉ dưỡng" },
  { value: "family_fun", label: "Gia đình vui chơi" },
  { value: "foodie_nightlife", label: "Ẩm thực & đêm" },
] as const;

export const TARGET_CUSTOMER_OPTIONS = [
  { value: "couple", label: "Cặp đôi" },
  { value: "family", label: "Gia đình" },
  { value: "solo", label: "Một mình" },
  { value: "group", label: "Nhóm bạn" },
  { value: "backpacker", label: "Backpacker" },
  { value: "business", label: "Công tác" },
] as const;

export const PREFERENCE_OPTIONS = [
  { value: "atmosphere:peaceful", label: "Yên bình" },
  { value: "atmosphere:cozy", label: "Ấm cúng" },
  { value: "atmosphere:romantic", label: "Lãng mạn" },
  { value: "atmosphere:dreamy", label: "Mộng mơ" },
  { value: "atmosphere:trendy", label: "Trendy" },
  { value: "feature:scenic_view", label: "View đẹp" },
  { value: "feature:photo_spots", label: "Check-in" },
  { value: "feature:lake_view", label: "View hồ" },
  { value: "feature:flower_field", label: "Cánh đồng hoa" },
  { value: "specialty:local_specialty", label: "Đặc sản địa phương" },
  { value: "specialty:street_food", label: "Ăn vặt" },
  { value: "amenities:kid_friendly", label: "Thân thiện trẻ em" },
  { value: "amenities:pet_allowed", label: "Mang thú cưng" },
  { value: "feature:pet_friendly", label: "Pet-friendly" },
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
