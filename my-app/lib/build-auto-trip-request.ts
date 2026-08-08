import type { AutoTripRequest } from "@/lib/trip";
import { START_PRESETS_BY_CITY, type CityId } from "@/lib/trip";
import {
  isScorablePreferenceTag,
  normalizeHHMM,
  validateSameDayHours,
  type AutoTripDraft,
} from "@/lib/auto-trip-form";

/**
 * Pet chips: send both hard tags auto-planner recognizes
 * (amenities:pet_allowed + feature:pet_friendly).
 */
function expandConstraintTags(tags: string[]): string[] {
  const out = [...tags];
  if (tags.includes("amenities:pet_allowed") && !tags.includes("feature:pet_friendly")) {
    out.push("feature:pet_friendly");
  }
  if (tags.includes("feature:pet_friendly") && !tags.includes("amenities:pet_allowed")) {
    out.push("amenities:pet_allowed");
  }
  return out;
}

/**
 * Build preferences[] from form chips.
 * Only atmosphere|specialty|feature|amenities|service soft-score in auto-planner
 * (ALLOWED_TAGS_MAP). tripType/targetCustomer go as separate request fields —
 * TRIP_TYPE_MAP.childTags are applied server-side.
 */
export function buildPreferences(draft: AutoTripDraft): string[] {
  const raw = [
    ...draft.atmosphere,
    ...draft.food,
    ...draft.activities,
    ...expandConstraintTags(draft.constraints),
  ];

  const seen = new Set<string>();
  const out: string[] = [];
  for (const tag of raw) {
    if (!tag || seen.has(tag)) continue;
    if (!isScorablePreferenceTag(tag)) continue;
    seen.add(tag);
    out.push(tag);
  }
  return out;
}

/**
 * Map single-page form draft → AutoTripRequest.
 * Empty soft fields are omitted (skip ≠ dislike).
 * Optional `locationOverride` replaces start preset coords (e.g. GPS).
 */
export function buildAutoTripRequest(
  draft: AutoTripDraft,
  cityId: CityId = "dalat",
  locationOverride?: { latitude: number; longitude: number } | null,
): AutoTripRequest {
  const presets = START_PRESETS_BY_CITY[cityId] ?? START_PRESETS_BY_CITY.dalat;
  const start =
    presets.find((p) => p.id === draft.startId) ?? presets[0]!;

  const [startTimePerDay, endTimePerDay] = draft.hours.split("|");

  const hoursError = validateSameDayHours(
    startTimePerDay || "",
    endTimePerDay || "",
  );
  if (hoursError) {
    throw new Error(hoursError);
  }

  const radiusKm = Number(String(draft.radiusKm).trim().replace(",", "."));
  if (!Number.isFinite(radiusKm) || radiusKm <= 0) {
    throw new Error("Bán kính phải là số km lớn hơn 0");
  }

  const maxDistance = Number(String(draft.maxDistance).trim().replace(",", "."));
  if (!Number.isFinite(maxDistance) || maxDistance < 1) {
    throw new Error("Khoảng cách giữa các điểm phải là số km ≥ 1");
  }

  const request: AutoTripRequest = {
    startLatitude: locationOverride?.latitude ?? start.latitude,
    startLongitude: locationOverride?.longitude ?? start.longitude,
    radiusKm,
    budgetLevel: draft.budgetLevel,
    preferences: buildPreferences(draft),
    pace: draft.pace,
    showRoad: true,
    maxDistance,
    isRoundTrip: draft.isRoundTrip,
  };

  const startNorm = normalizeHHMM(startTimePerDay || "");
  const endNorm = normalizeHHMM(endTimePerDay || "");
  if (startNorm && endNorm) {
    request.startTimePerDay = startNorm;
    request.endTimePerDay = endNorm;
  }

  if (draft.tripType) request.tripType = draft.tripType;
  if (draft.targetCustomer) request.targetCustomer = draft.targetCustomer;

  return request;
}

export function getBrowserLocation(
  timeoutMs = 12000,
): Promise<{ latitude: number; longitude: number }> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Trình duyệt không hỗ trợ lấy vị trí."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      (err) => {
        const msg =
          err.code === err.PERMISSION_DENIED
            ? "Bạn đã từ chối quyền vị trí."
            : err.code === err.TIMEOUT
              ? "Hết thời gian lấy vị trí."
              : "Không lấy được vị trí hiện tại.";
        reject(new Error(msg));
      },
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 60_000 },
    );
  });
}
