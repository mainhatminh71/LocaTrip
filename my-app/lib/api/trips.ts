import type {
  AutoTripRequest,
  AutoTripResult,
  BudgetLevel,
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
  thumbnail?: string;
};

/** Full place from GET /trips/places/:placeId */
export type PlaceDetail = PlaceSearchHit & {
  openHours?: unknown;
  website?: string;
  phone?: string;
  reviewCount?: number;
  priceRangeLow?: number;
  priceRangeMax?: number;
  reservations?: unknown;
  orderOnline?: unknown;
  menuLink?: string;
  userReviews?: {
    name?: string;
    rating?: number;
    text?: string;
    publishedAt?: string;
  }[];
  emails?: string;
  busyProfile?: {
    peakHours?: string[];
    peakDays?: string[];
    liveliness?: string;
  };
  poiRole?: string;
  poiRoleConfidence?: string;
  estimatedVisitDurationMin?: number;
  areaType?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type SavedTripSource = "cart" | "auto" | "manual";
export type SavedTripStatus = "active" | "archived";
/** User-facing trip phase (not the active/archived list flag). */
export type TripProgressStatus = "Pending" | "OnGoing" | "Done";

export const TRIP_PROGRESS_OPTIONS: {
  value: TripProgressStatus;
  label: string;
}[] = [
  { value: "Pending", label: "Đề xuất" },
  { value: "OnGoing", label: "Đang đi" },
  { value: "Done", label: "Hoàn thành" },
];

/** Planner prefs aligned with POST /trips generate fields + generatePrefs. */
export type TripGeneratePrefs = {
  tripType?: string;
  targetCustomer?: string;
  preferences?: string[];
  budgetLevel?: BudgetLevel;
  pace?: Pace;
  radiusKm?: number;
  maxDistance?: number;
  isRoundTrip?: boolean;
  roundTrip?: boolean;
  startTimePerDay?: string;
  endTimePerDay?: string;
  showRoad?: boolean;
  startCoords?: { latitude: number; longitude: number };
  startMode?: "gps" | "preset" | string;
  startId?: string;
};

export type CreateSavedTripBody = {
  title: string;
  itinerary: DayItinerary[];
  /** Calendar day YYYY-MM-DD (required on create; ≥ today) */
  date: string;
  /** Alias accepted by LocalTrip */
  tripDate?: string;
  source?: SavedTripSource;
  status?: SavedTripStatus;
  tripStatus?: TripProgressStatus;
  startCoords?: { latitude: number; longitude: number };
  /** Aliases accepted by LocalTrip POST/PATCH /trips */
  startLatitude?: number;
  startLongitude?: number;
  durationDays?: number;
  pace?: Pace;
  unscheduledItems?: { placeId?: string; title: string; reason: string }[];
  warnings?: unknown[];
  summary?: string;
  totalEstimatedCost?: number | string;
  tripType?: string;
  targetCustomer?: string;
  preferences?: string[];
  budgetLevel?: BudgetLevel;
  radiusKm?: number;
  maxDistance?: number;
  isRoundTrip?: boolean;
  roundTrip?: boolean;
  startTimePerDay?: string;
  endTimePerDay?: string;
  showRoad?: boolean;
  startMode?: string;
  startId?: string;
  /** Auto option id from generate response */
  optionId?: number;
  generatePrefs?: TripGeneratePrefs;
};

export type SavedTrip = {
  id: string;
  ownerId: string;
  title: string;
  source: SavedTripSource;
  itinerary: DayItinerary[];
  /** Calendar day YYYY-MM-DD when set */
  date?: string;
  /** Alias some responses / older clients may send */
  tripDate?: string;
  startCoords?: { latitude: number; longitude: number };
  startLatitude?: number;
  startLongitude?: number;
  durationDays?: number;
  pace?: Pace;
  unscheduledItems?: { placeId?: string; title: string; reason: string }[];
  warnings?: unknown[];
  summary?: string;
  totalEstimatedCost?: number | string;
  status: SavedTripStatus;
  tripStatus?: TripProgressStatus;
  createdAt: string;
  updatedAt: string;
  tripType?: string;
  targetCustomer?: string;
  preferences?: string[];
  budgetLevel?: BudgetLevel;
  radiusKm?: number;
  maxDistance?: number;
  isRoundTrip?: boolean;
  roundTrip?: boolean;
  startTimePerDay?: string;
  endTimePerDay?: string;
  showRoad?: boolean;
  startMode?: string;
  startId?: string;
  generatePrefs?: TripGeneratePrefs;
  /** Linked doc in Mongo `trip_prefs` when present */
  prefsId?: string;
};

/** YYYY-MM-DD from trip.date / tripDate / createdAt (Asia/Ho_Chi_Minh). */
export function resolveTripDate(
  trip: Pick<SavedTrip, "date" | "tripDate" | "createdAt">,
): string | undefined {
  const raw = trip.date || trip.tripDate;
  if (typeof raw === "string" && /^\d{4}-\d{2}-\d{2}/.test(raw)) {
    return raw.slice(0, 10);
  }
  if (trip.createdAt) {
    try {
      const d = new Date(trip.createdAt);
      if (!Number.isNaN(d.getTime())) {
        return new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Ho_Chi_Minh",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).format(d);
      }
    } catch {
      /* ignore */
    }
  }
  return undefined;
}

/** Today YYYY-MM-DD in Asia/Ho_Chi_Minh (matches LocalTrip Done derivation). */
export function todayYmdHcm(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/**
 * Effective progress for UI: Done when travel date is before today (VN),
 * even if the stored field still says OnGoing.
 */
export function resolveTripProgressStatus(
  trip: Pick<SavedTrip, "tripStatus" | "date" | "tripDate" | "createdAt">,
): TripProgressStatus | undefined {
  const date = resolveTripDate(trip);
  if (date && date < todayYmdHcm()) return "Done";
  if (trip.tripStatus === "Pending" || trip.tripStatus === "OnGoing" || trip.tripStatus === "Done") {
    return trip.tripStatus;
  }
  return trip.tripStatus;
}

function normalizeSavedTrip(trip: SavedTrip): SavedTrip {
  const date = resolveTripDate(trip);
  const withDate = date ? { ...trip, date, tripDate: date } : trip;
  const tripStatus = resolveTripProgressStatus(withDate);
  return tripStatus ? { ...withDate, tripStatus } : withDate;
}

/** Map known LocalTrip English errors to Vietnamese. */
export function localizeTripApiError(message: string): string {
  const m = message.trim();
  if (/cannot edit a done trip/i.test(m)) {
    return "Chuyến đã hoàn thành — chỉ xem, không thay điểm được.";
  }
  if (/không thể thay đổi chuyến đi đã hoàn thành/i.test(m)) {
    return "Chuyến đã hoàn thành — chỉ xem, không thay điểm được.";
  }
  return message;
}

async function readError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    return localizeTripApiError(data.error || `Lỗi ${res.status}`);
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
  const date = body.date.trim().slice(0, 10);
  const payload: CreateSavedTripBody = {
    ...body,
    date,
    tripDate: body.tripDate || date,
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
  return normalizeSavedTrip(data.trip);
}

/** Partial update → `PATCH /trips/:tripId` (same fields as create). */
export type UpdateSavedTripBody = Partial<CreateSavedTripBody>;

export async function updateSavedTrip(
  tripId: string,
  body: UpdateSavedTripBody,
): Promise<SavedTrip> {
  const payload: UpdateSavedTripBody = { ...body };
  if (body.itinerary) {
    payload.itinerary = slimItineraryForSave(body.itinerary);
  }
  if (payload.date && !payload.tripDate) {
    payload.tripDate = payload.date;
  }
  const res = await apiFetch(`/api/trips/${encodeURIComponent(tripId)}/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const data = (await res.json()) as { trip?: SavedTrip; error?: string };
  if (!res.ok) {
    throw new ApiError(data.error || (await readError(res)), res.status);
  }
  if (!data.trip?.id) {
    throw new ApiError("Server không trả về chuyến đi đã cập nhật", 502);
  }
  return normalizeSavedTrip(data.trip);
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
  return (data.trips ?? []).map(normalizeSavedTrip);
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
  return normalizeSavedTrip(data.trip);
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

/** Body for `trip_prefs` create/patch (options only, no itinerary). */
export type TripPrefsBody = TripGeneratePrefs & {
  label?: string;
  tripId?: string | null;
  roundTrip?: boolean;
  startLatitude?: number;
  startLongitude?: number;
  generatePrefs?: TripGeneratePrefs;
};

export type SavedTripPrefs = TripPrefsBody & {
  id: string;
  ownerId?: string;
  generatePrefs?: TripGeneratePrefs;
  createdAt?: string;
  updatedAt?: string;
};

/** Create options set → `POST /trips/prefs`. */
export async function createTripPrefs(
  body: TripPrefsBody,
): Promise<SavedTripPrefs> {
  const res = await apiFetch("/api/trips/prefs/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = (await res.json()) as { prefs?: SavedTripPrefs; error?: string };
  if (!res.ok) {
    throw new ApiError(data.error || (await readError(res)), res.status);
  }
  if (!data.prefs?.id) {
    throw new ApiError("Server không trả về bộ tiêu chí đã lưu", 502);
  }
  return data.prefs;
}

/** Update options only → `PATCH /trips/prefs/:prefsId`. */
export async function updateTripPrefs(
  prefsId: string,
  body: TripPrefsBody,
): Promise<SavedTripPrefs> {
  const res = await apiFetch(
    `/api/trips/prefs/${encodeURIComponent(prefsId)}/`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );
  const data = (await res.json()) as { prefs?: SavedTripPrefs; error?: string };
  if (!res.ok) {
    throw new ApiError(data.error || (await readError(res)), res.status);
  }
  if (!data.prefs?.id) {
    throw new ApiError("Server không trả về bộ tiêu chí đã cập nhật", 502);
  }
  return data.prefs;
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

/** Fetch one place — full document (incl. thumbnail, hours, reviews, …). */
export async function getPlaceById(
  placeId: string,
): Promise<PlaceDetail | null> {
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
    place?: PlaceDetail;
    error?: string;
  };
  if (!res.ok) {
    throw new ApiError(await readError(res), res.status);
  }
  return data.place ?? null;
}

/** Alternative / suggest-replace hit from LocalTrip. */
export type PlaceAlternative = {
  placeId: string;
  title: string;
  category?: string;
  address?: string;
  reviewRating?: number;
  latitude?: number;
  longitude?: number;
  tags?: string[];
  distanceKm?: number;
  score?: number;
  thumbnail?: string;
};

export type SuggestReplaceBody = {
  dayIndex: number;
  scheduleIndex: number;
  radiusKm?: number;
  limit?: number;
};

export type ReplacePlaceBody = {
  dayIndex: number;
  scheduleIndex: number;
  newPlaceId: string;
};

export type ReplacePlaceResult = {
  message?: string;
  itinerary: DayItinerary[];
};

/** Nearby alternatives → `GET /trips/places/:placeId/alternatives`. */
export async function getPlaceAlternatives(
  placeId: string,
  opts?: { radiusKm?: number; limit?: number },
): Promise<PlaceAlternative[]> {
  const params = new URLSearchParams();
  if (opts?.radiusKm != null) params.set("radius", String(opts.radiusKm));
  if (opts?.limit != null) params.set("limit", String(opts.limit));
  const qs = params.toString();
  const path = `/api/trips/places/${encodeURIComponent(placeId)}/alternatives/`;
  const res = await apiFetch(qs ? `${path}?${qs}` : path, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = (await res.json()) as {
    alternatives?: PlaceAlternative[];
    error?: string;
  };
  if (!res.ok) {
    throw new ApiError(data.error || (await readError(res)), res.status);
  }
  return data.alternatives ?? [];
}

/** Context alternatives for a saved stop → `POST /trips/:tripId/suggest-replace`. */
export async function suggestReplaceForTrip(
  tripId: string,
  body: SuggestReplaceBody,
): Promise<PlaceAlternative[]> {
  const res = await apiFetch(
    `/api/trips/${encodeURIComponent(tripId)}/suggest-replace/`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );
  const data = (await res.json()) as {
    alternatives?: PlaceAlternative[];
    error?: string;
  };
  if (!res.ok) {
    throw new ApiError(data.error || (await readError(res)), res.status);
  }
  return data.alternatives ?? [];
}

/** Persist stop replacement → `PUT /trips/:tripId/replace-place`. */
export async function replacePlaceInTrip(
  tripId: string,
  body: ReplacePlaceBody,
): Promise<ReplacePlaceResult> {
  const res = await apiFetch(
    `/api/trips/${encodeURIComponent(tripId)}/replace-place/`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    },
  );
  const data = (await res.json()) as ReplacePlaceResult & { error?: string };
  if (!res.ok) {
    throw new ApiError(data.error || (await readError(res)), res.status);
  }
  if (!data.itinerary) {
    throw new ApiError("Server không trả về lịch trình sau khi thay điểm", 502);
  }
  return data;
}
