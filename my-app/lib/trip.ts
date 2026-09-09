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
  /** Max hop distance between consecutive stops (km). */
  maxDistance?: number;
  /** Return to start at end of day. */
  isRoundTrip?: boolean;
  /** Prefer higher xu cost (prefs “tạo lại”). */
  regenerate?: boolean;
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
  thumbnail?: string;
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
  /** Which proposal the user picked (when API returns ≥2). */
  selectedOptionId?: number;
};

export const AUTO_TRIP_STORAGE_KEY = "locatrip.autoTrip";

/** Cities available in setup (expand later: nha-trang, da-nang…). */
export const CITY_OPTIONS = [
  { id: "dalat", label: "Đà Lạt", hint: "dalat" },
] as const;

export type CityId = (typeof CITY_OPTIONS)[number]["id"];

export type StartPresetCategory = "landmark" | "bus" | "hotel";

export type StartPreset = {
  id: string;
  label: string;
  category: StartPresetCategory;
  latitude: number;
  longitude: number;
  description: string;
  thumbnail: string;
};

export const START_PRESET_CATEGORY_OPTIONS: readonly {
  id: StartPresetCategory;
  label: string;
}[] = [
  { id: "landmark", label: "Địa điểm nổi bật" },
  { id: "bus", label: "Bến xe" },
  { id: "hotel", label: "Khách sạn" },
] as const;

/** Start points keyed by city — only Đà Lạt for now. */
export const START_PRESETS_BY_CITY: Record<CityId, readonly StartPreset[]> = {
  dalat: [
    // —— Địa điểm nổi bật ——
    {
      id: "center",
      label: "Trung tâm Đà Lạt",
      category: "landmark",
      latitude: 11.9404,
      longitude: 108.4583,
      description:
        "Nhịp phố núi quanh chợ và nhà thờ — điểm xuất phát thuận tiện để khám phá quán cà phê, ẩm thực và góc check-in trung tâm.",
      thumbnail: "/media/starts/center.jpg",
    },
    {
      id: "xuan-huong",
      label: "Hồ Xuân Hương",
      category: "landmark",
      latitude: 11.9415,
      longitude: 108.438,
      description:
        "Trái tim xanh của Đà Lạt — mặt hồ êm, đường đi bộ và không khí se lạnh, lý tưởng để bắt đầu ngày thong thả.",
      thumbnail: "/media/starts/xuan-huong.jpg",
    },
    {
      id: "ga",
      label: "Ga Đà Lạt",
      category: "landmark",
      latitude: 11.925,
      longitude: 108.451,
      description:
        "Nhà ga cổ nhất Đông Dương với kiến trúc Pháp độc đáo — điểm hẹn mang hơi thở lịch sử trước khi lên lịch các điểm xung quanh.",
      thumbnail: "/media/starts/ga.jpg",
    },
    {
      id: "tuyen-lam",
      label: "Hồ Tuyền Lâm",
      category: "landmark",
      latitude: 11.889,
      longitude: 108.432,
      description:
        "Hồ lớn giữa rừng thông — không gian rộng, yên và gần các hoạt động ngoài trời; phù hợp chuyến nghỉ dưỡng / thiên nhiên.",
      thumbnail: "/media/starts/tuyen-lam.jpg",
    },
    {
      id: "langbiang",
      label: "Langbiang / Lạc Dương",
      category: "landmark",
      latitude: 12.04,
      longitude: 108.44,
      description:
        "Đỉnh núi biểu tượng phía Bắc thành phố — khí hậu mát, săn mây và view cao nguyên; điểm bắt đầu cho lịch trình hướng ngoại ô.",
      thumbnail: "/media/starts/langbiang.jpg",
    },

    // —— Bến xe / văn phòng nhà xe nổi bật (Đà Lạt) ——
    {
      id: "bus-lien-tinh",
      label: "Bến xe liên tỉnh Đà Lạt",
      category: "bus",
      latitude: 11.9268818,
      longitude: 108.4455138,
      description:
        "Bến hạng I tại 01 Tô Hiến Thành — cửa ngõ xe khách liên tỉnh (HCM, Nha Trang, Buôn Ma Thuột…). Tiện bắt đầu lịch ngay khi xuống xe.",
      thumbnail: "/media/starts/bus-lien-tinh.jpg",
    },
    {
      id: "bus-phuong-trang",
      label: "VP Phương Trang (Lê Quý Đôn)",
      category: "bus",
      latitude: 11.9411068,
      longitude: 108.4311997,
      description:
        "Văn phòng / điểm đón trả FUTA gần trung tâm — thuận nếu bạn đi xe Phương Trang và muốn xuất phát quanh khu Cam Ly / Hồ Xuân Hương.",
      thumbnail: "/media/starts/bus-phuong-trang.jpg",
    },
    {
      id: "bus-thanh-buoi-lu-gia",
      label: "VP Thành Bưởi (Lữ Gia)",
      category: "bus",
      latitude: 11.9539927,
      longitude: 108.4669027,
      description:
        "Trụ sở Thành Bưởi tại Lữ Gia — điểm đón trả quen thuộc phía Đông Bắc trung tâm, gần khu Lâm Viên.",
      thumbnail: "/media/starts/bus-thanh-buoi.jpg",
    },
    {
      id: "bus-thanh-buoi-pbc",
      label: "VP Thành Bưởi (Phan Bội Châu)",
      category: "bus",
      latitude: 11.9439993,
      longitude: 108.4384544,
      description:
        "Điểm Thành Bưởi gần hồ Xuân Hương / Golf Valley — dễ kết nối cafe, chợ và các điểm check-in trung tâm.",
      thumbnail: "/media/starts/bus-thanh-buoi-pbc.jpg",
    },

    // —— Khách sạn / resort nổi bật ——
    {
      id: "hotel-dalat-palace",
      label: "Dalat Palace Heritage",
      category: "hotel",
      latitude: 11.9375798,
      longitude: 108.4403914,
      description:
        "Biểu tượng di sản nhìn ra Hồ Xuân Hương — điểm bắt đầu sang trọng ngay trung tâm phố núi.",
      thumbnail: "/media/starts/dalat-palace.jpg",
    },
    {
      id: "hotel-ana-mandara",
      label: "Ana Mandara Villas",
      category: "hotel",
      latitude: 11.9442284,
      longitude: 108.4236004,
      description:
        "Quần thể biệt thự Pháp phục chế trên đồi thông Cam Ly — xuất phát yên tĩnh, cách trung tâm khoảng 10 phút.",
      thumbnail: "/media/starts/ana-mandara.jpg",
    },
    {
      id: "hotel-terracotta",
      label: "Terracotta Hotel & Resort",
      category: "hotel",
      latitude: 11.8952539,
      longitude: 108.4375041,
      description:
        "Resort lớn bên Hồ Tuyền Lâm — phù hợp lịch trình nghỉ dưỡng, thiên nhiên và hoạt động quanh hồ.",
      thumbnail: "/media/starts/terracotta.jpg",
    },
    {
      id: "hotel-swiss-belresort",
      label: "Swiss-Belresort Tuyền Lâm",
      category: "hotel",
      latitude: 11.8978,
      longitude: 108.4428,
      description:
        "Resort view sân golf / thung lũng thông phía Nam thành phố — điểm xuất phát hướng Tuyền Lâm & thác.",
      thumbnail: "/media/starts/swiss-belresort.jpg",
    },
    {
      id: "hotel-mercure",
      label: "Mercure Dalat Resort",
      category: "hotel",
      latitude: 11.9454247,
      longitude: 108.4595463,
      description:
        "Resort khu Lâm Viên — gần trung tâm nhưng không gian xanh, thuận lịch trình nửa ngày phố núi.",
      thumbnail: "/media/starts/mercure.jpg",
    },
    {
      id: "hotel-saigon-dalat",
      label: "Saigon – Dalat Hotel",
      category: "hotel",
      latitude: 11.9392953,
      longitude: 108.4296304,
      description:
        "Khách sạn quen thuộc gần trung tâm — xuất phát tiện cho chợ, nhà thờ và vòng quanh Hồ Xuân Hương.",
      thumbnail: "/media/starts/saigon-dalat.jpg",
    },
    {
      id: "hotel-edensee",
      label: "Dalat Edensee Lake Resort",
      category: "hotel",
      latitude: 11.8856405,
      longitude: 108.4236024,
      description:
        "Resort sát mặt nước Hồ Tuyền Lâm — điểm bắt đầu cho hành trình phía Nam thành phố, chậm rãi và riêng tư.",
      thumbnail: "/media/starts/edensee.jpg",
    },
    {
      id: "hotel-muong-thanh",
      label: "Mường Thanh Đà Lạt",
      category: "hotel",
      latitude: 11.9439,
      longitude: 108.4376,
      description:
        "Chuỗi khách sạn gần trung tâm / Golf Valley — dễ kết nối điểm ăn uống và tham quan trong phố.",
      thumbnail: "/media/starts/muong-thanh.jpg",
    },
    {
      id: "hotel-best-western",
      label: "Best Western Premier Đà Lạt",
      category: "hotel",
      latitude: 11.949,
      longitude: 108.4345,
      description:
        "Khách sạn khu Golf Valley — view đồi thông, thuận lịch trình cao cấp quanh trung tâm phía Bắc hồ.",
      thumbnail: "/media/starts/best-western-premier.jpg",
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

/** Chip value for free start/end time inputs (not sent as hours). */
export const HOURS_CUSTOM_VALUE = "custom";

export const HOURS_CHIP_OPTIONS = [
  ...HOURS_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
  { value: HOURS_CUSTOM_VALUE, label: "Tự do (chỉnh giờ)" },
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
  try {
    localStorage.setItem(AUTO_TRIP_STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* quota / private mode */
  }
}

export function loadAutoTrip(): StoredAutoTrip | null {
  if (typeof window === "undefined") return null;
  try {
    const raw =
      localStorage.getItem(AUTO_TRIP_STORAGE_KEY) ||
      sessionStorage.getItem(AUTO_TRIP_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredAutoTrip;
    // Migrate older sessionStorage drafts into localStorage.
    if (!localStorage.getItem(AUTO_TRIP_STORAGE_KEY)) {
      saveAutoTrip(parsed);
    }
    return parsed;
  } catch {
    return null;
  }
}

/** Persist which itinerary option was chosen (no API / no toast). */
export function saveAutoTripSelection(optionId: number) {
  const current = loadAutoTrip();
  if (!current) return;
  saveAutoTrip({ ...current, selectedOptionId: optionId });
}
