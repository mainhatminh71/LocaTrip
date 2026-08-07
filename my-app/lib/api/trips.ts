import type {
  AutoTripRequest,
  AutoTripResult,
  DayItinerary,
  Pace,
  ScheduleItem,
} from "@/lib/trip";
import { apiFetch, ApiError } from "@/lib/api/http";

export type PlaceSearchHit = {
  placeId?: string;
  title: string;
  category?: string;
  address?: string;
  reviewRating?: number;
  latitude?: number;
  longitude?: number;
  tags?: string[];
};

export type SavedTripSource = "cart" | "auto" | "manual";
export type SavedTripStatus = "active" | "archived";

export type CreateSavedTripBody = {
  title: string;
  itinerary: DayItinerary[];
  source?: SavedTripSource;
  status?: SavedTripStatus;
  startCoords?: { latitude: number; longitude: number };
  durationDays?: number;
  pace?: Pace;
  unscheduledItems?: { placeId?: string; title: string; reason: string }[];
  warnings?: unknown[];
  summary?: string;
  totalEstimatedCost?: number;
};

export type SavedTrip = {
  id: string;
  ownerId: string;
  title: string;
  source: SavedTripSource;
  itinerary: DayItinerary[];
  startCoords?: { latitude: number; longitude: number };
  durationDays?: number;
  pace?: Pace;
  unscheduledItems?: { placeId?: string; title: string; reason: string }[];
  warnings?: unknown[];
  summary?: string;
  totalEstimatedCost?: number;
  status: SavedTripStatus;
  createdAt: string;
  updatedAt: string;
};

async function readError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error || `Lỗi ${res.status}`;
  } catch {
    return `Lỗi ${res.status}`;
  }
}

/**
 * Drop heavy fields before POST /trips (OSRM polylines + alt lists blow past
 * default Express/Next body limits → "request entity too large").
 */
export function slimItineraryForSave(itinerary: DayItinerary[]): DayItinerary[] {
  return itinerary.map((day) => ({
    day: day.day,
    schedule: (day.schedule || []).map((item: ScheduleItem) => {
      if (item.type === "travel") {
        const { routeGeometry: _rg, ...rest } = item;
        return rest;
      }
      const { topAlternatives: _alts, ...rest } = item;
      return rest;
    }),
  }));
}

/** Same-origin proxy → LocalTrip `POST /trips/generate/auto`. */
export async function generateAutoTrip(
  request: AutoTripRequest,
): Promise<AutoTripResult> {
  const res = await apiFetch("/api/trips/generate/auto/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const data = (await res.json()) as AutoTripResult & { error?: string };
  if (!res.ok) {
    throw new ApiError(data.error || `Lỗi ${res.status}`, res.status);
  }
  if (!data.itineraries?.length) {
    throw new Error(
      "Không có lộ trình phù hợp. Thử đổi điểm bắt đầu / sở thích / bán kính.",
    );
  }
  return data;
}

/** Persist itinerary snapshot → `POST /trips`. */
export async function createSavedTrip(
  body: CreateSavedTripBody,
): Promise<SavedTrip> {
  const payload: CreateSavedTripBody = {
    ...body,
    itinerary: slimItineraryForSave(body.itinerary),
  };
  const res = await apiFetch("/api/trips/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as { trip?: SavedTrip; error?: string };
  if (!res.ok) {
    throw new ApiError(data.error || (await readError(res)), res.status);
  }
  if (!data.trip?.id) {
    throw new ApiError("Server không trả về chuyến đi đã lưu", 502);
  }
  return data.trip;
}

/** List my trips → `GET /trips`. */
export async function listSavedTrips(
  status?: SavedTripStatus,
): Promise<SavedTrip[]> {
  const qs = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await apiFetch(`/api/trips${qs}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = (await res.json()) as {
    trips?: SavedTrip[];
    error?: string;
  };
  if (!res.ok) {
    throw new ApiError(data.error || (await readError(res)), res.status);
  }
  return data.trips ?? [];
}

/** Get one trip → `GET /trips/:id`. */
export async function getSavedTrip(tripId: string): Promise<SavedTrip> {
  const res = await apiFetch(`/api/trips/${encodeURIComponent(tripId)}/`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = (await res.json()) as { trip?: SavedTrip; error?: string };
  if (!res.ok) {
    throw new ApiError(data.error || (await readError(res)), res.status);
  }
  if (!data.trip) {
    throw new ApiError("Không tìm thấy chuyến đi", 404);
  }
  return data.trip;
}

/** Delete trip → `DELETE /trips/:id`. */
export async function deleteSavedTrip(tripId: string): Promise<void> {
  const res = await apiFetch(`/api/trips/${encodeURIComponent(tripId)}/`, {
    method: "DELETE",
    cache: "no-store",
  });
  if (res.status === 204) return;
  if (!res.ok) {
    throw new ApiError(await readError(res), res.status);
  }
}

/** Search places by title/address for replace modal. */
export async function searchPlaces(
  q: string,
  limit = 12,
): Promise<PlaceSearchHit[]> {
  const params = new URLSearchParams({
    q: q.trim(),
    limit: String(limit),
  });
  const res = await apiFetch(`/api/trips/places/search/?${params}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = (await res.json()) as {
    places?: PlaceSearchHit[];
    error?: string;
  };
  if (!res.ok) {
    throw new ApiError(data.error || `Lỗi ${res.status}`, res.status);
  }
  return data.places ?? [];
}

/** Fetch one place (enrich lat/lng for alternatives). */
export async function getPlaceById(
  placeId: string,
): Promise<PlaceSearchHit | null> {
  const res = await apiFetch(
    `/api/trips/places/${encodeURIComponent(placeId)}/`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    },
  );
  if (res.status === 404) return null;
  const data = (await res.json()) as {
    place?: PlaceSearchHit;
    error?: string;
  };
  if (!res.ok) {
    throw new ApiError(await readError(res), res.status);
  }
  return data.place ?? null;
}
