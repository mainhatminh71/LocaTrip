/**
 * Framer book-a-trip form options (exact labels/values from scrape).
 * Mapped to AutoTrip API under the hood — UI stays Framer-faithful.
 */
import type { BudgetLevel, Pace } from "@/lib/trip";

export const FRAMER_AREA_OPTIONS = [
  "Chọn khu vực",
  "Ngẫu nhiên",
  "Khu vực Trung tâm Thành phố",
  "Khu vực Hồ Tuyền Lâm & Đèo Prenn",
  "Khu vực Trại Mát & Cầu Đất",
  "Khu vực Thung lũng Tình Yêu & Đồi Mộng Mơ",
  "Khu vực Núi Langbiang & Lạc Dương",
  "Khu vực Tà Nung (Đường hoa)",
] as const;

export const FRAMER_INTEREST_OPTIONS = [
  "Chọn sở thích",
  "Ngẫu nhiên",
  "Mạo hiểm",
  "Thiên nhiên",
  "Lãng mạn",
  "Thư thái",
] as const;

export const FRAMER_PRIORITY_OPTIONS = [
  "Loại hình lưu trú",
  "Ngẫu nhiên",
  "Tiện lợi",
  "Trải nghiệm địa phương",
  "Sang trọng",
  "Thư giãn",
] as const;

export const FRAMER_STAY_OPTIONS = [
  "Không bắt buộc",
  "Ngẫu nhiên",
  "Không chọn",
  "Khách sạn",
  "Homestay",
  "Cắm trại",
  "Nhà Trọ",
] as const;

export const FRAMER_BUS_OPTIONS = [
  "Chọn nhà xe",
  "Phương Trang",
  "Thành Bưởi",
] as const;

export const FRAMER_TRIP_LEG_OPTIONS = [
  "Chọn hành trình",
  "Một chiều",
  "Khứ hồi",
] as const;

const AREA_TO_START: Record<string, string> = {
  "Ngẫu nhiên": "center",
  "Khu vực Trung tâm Thành phố": "center",
  "Khu vực Hồ Tuyền Lâm & Đèo Prenn": "tuyen-lam",
  "Khu vực Trại Mát & Cầu Đất": "ga",
  "Khu vực Thung lũng Tình Yêu & Đồi Mộng Mơ": "xuan-huong",
  "Khu vực Núi Langbiang & Lạc Dương": "langbiang",
  "Khu vực Tà Nung (Đường hoa)": "center",
};

const INTEREST_TO_PREFS: Record<string, string[]> = {
  "Ngẫu nhiên": ["atmosphere:peaceful", "feature:scenic_view"],
  "Mạo hiểm": ["feature:scenic_view", "feature:photo_spots"],
  "Thiên nhiên": ["feature:scenic_view", "feature:lake_view", "feature:flower_field"],
  "Lãng mạn": ["atmosphere:romantic", "atmosphere:dreamy", "feature:scenic_view"],
  "Thư thái": ["atmosphere:peaceful", "atmosphere:cozy"],
};

const PRIORITY_TO_TRIP: Record<string, string> = {
  "Ngẫu nhiên": "exploration",
  "Tiện lợi": "exploration",
  "Trải nghiệm địa phương": "backpacking",
  "Sang trọng": "relaxation",
  "Thư giãn": "relaxation",
};

export type FramerBookTripForm = {
  departureDate: string;
  durationDays: string;
  people: string;
  budgetMillion: string;
  area: string;
  interest: string;
  priority: string;
  stay: string;
  bus: string;
  tripLeg: string;
  agree: boolean;
};

export function mapBudgetMillion(raw: string): BudgetLevel {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 3) return "budget";
  if (n <= 10) return "mid-range";
  return "luxury";
}

export function mapPeopleToCustomer(raw: string): string {
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 1) return "solo";
  if (n === 2) return "couple";
  if (n <= 4) return "family";
  return "group";
}

export function mapInterestToPreferences(interest: string): string[] {
  return INTEREST_TO_PREFS[interest] ?? INTEREST_TO_PREFS["Ngẫu nhiên"];
}

export function mapPriorityToTripType(priority: string): string {
  return PRIORITY_TO_TRIP[priority] ?? "exploration";
}

export function mapPriorityToPace(priority: string): Pace {
  if (priority === "Thư giãn" || priority === "Sang trọng") return "relaxed";
  if (priority === "Tiện lợi") return "active";
  return "moderate";
}

export function mapAreaToStartId(area: string): string {
  return AREA_TO_START[area] ?? "center";
}

/** Wider radius for outer areas. */
export function mapAreaToRadiusKm(area: string): number {
  if (area.includes("Langbiang") || area.includes("Tà Nung")) return 20;
  if (area.includes("Tuyền Lâm") || area.includes("Trại Mát")) return 15;
  return 10;
}
