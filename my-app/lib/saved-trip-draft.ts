import {
  resolveTripProgressStatus,
  type SavedTrip,
  type TripGeneratePrefs,
  type TripProgressStatus,
} from "@/lib/api/trips";
import {
  DEFAULT_AUTO_TRIP_DRAFT,
  FORM_ACTIVITY_OPTIONS,
  FORM_ATMOSPHERE_OPTIONS,
  FORM_CONSTRAINT_OPTIONS,
  FORM_FOOD_OPTIONS,
  joinDraftHours,
  normalizeHHMM,
  todayYmd,
  type AutoTripDraft,
  type AutoTripHoursMode,
  type AutoTripStartMode,
} from "@/lib/auto-trip-form";
import { HOURS_OPTIONS, type BudgetLevel, type Pace } from "@/lib/trip";

const ATMOSPHERE = new Set(FORM_ATMOSPHERE_OPTIONS.map((o) => o.value));
const FOOD = new Set(FORM_FOOD_OPTIONS.map((o) => o.value));
const ACTIVITIES = new Set(FORM_ACTIVITY_OPTIONS.map((o) => o.value));
const CONSTRAINTS = new Set(FORM_CONSTRAINT_OPTIONS.map((o) => o.value));

const BUDGETS = new Set<BudgetLevel>(["budget", "mid-range", "luxury"]);
const PACES = new Set<Pace>(["relaxed", "moderate", "active"]);

/** Flatten nested + top-level generate fields from a saved trip. */
export function pickSavedTripPrefs(trip: SavedTrip): TripGeneratePrefs {
  const g = trip.generatePrefs || {};
  const rawCoords =
    g.startCoords ??
    trip.startCoords ??
    (trip.startLatitude != null && trip.startLongitude != null
      ? { latitude: trip.startLatitude, longitude: trip.startLongitude }
      : undefined);

  const startCoords = coerceCoords(rawCoords);

  return {
    tripType: g.tripType ?? trip.tripType,
    targetCustomer: g.targetCustomer ?? trip.targetCustomer,
    preferences: g.preferences ?? trip.preferences,
    budgetLevel: g.budgetLevel ?? trip.budgetLevel,
    pace: g.pace ?? trip.pace,
    radiusKm: coerceFiniteNumber(g.radiusKm ?? trip.radiusKm),
    maxDistance: coerceFiniteNumber(g.maxDistance ?? trip.maxDistance),
    isRoundTrip:
      g.isRoundTrip ?? trip.isRoundTrip ?? trip.roundTrip ?? g.roundTrip,
    startTimePerDay: g.startTimePerDay ?? trip.startTimePerDay,
    endTimePerDay: g.endTimePerDay ?? trip.endTimePerDay,
    showRoad: g.showRoad ?? trip.showRoad,
    startMode: g.startMode ?? trip.startMode,
    startId: g.startId ?? trip.startId,
    startCoords,
  };
}

function coerceFiniteNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const n = Number(value);
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function coerceCoords(
  raw: unknown,
): { latitude: number; longitude: number } | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const o = raw as { latitude?: unknown; longitude?: unknown };
  const latitude = coerceFiniteNumber(o.latitude);
  const longitude = coerceFiniteNumber(o.longitude);
  if (latitude == null || longitude == null) return undefined;
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return undefined;
  }
  return { latitude, longitude };
}

function bucketPreferences(preferences: string[]): Pick<
  AutoTripDraft,
  "atmosphere" | "food" | "activities" | "constraints"
> {
  const atmosphere: string[] = [];
  const food: string[] = [];
  const activities: string[] = [];
  const constraints: string[] = [];
  const seen = new Set<string>();

  for (const raw of preferences) {
    const tag = String(raw || "").trim();
    if (!tag || seen.has(tag)) continue;
    seen.add(tag);

    if (ATMOSPHERE.has(tag) || tag.startsWith("atmosphere:")) {
      atmosphere.push(tag);
    } else if (FOOD.has(tag) || tag.startsWith("specialty:")) {
      food.push(tag);
    } else if (
      CONSTRAINTS.has(tag) ||
      tag === "amenities:pet_allowed" ||
      tag === "feature:pet_friendly" ||
      tag === "amenities:kid_friendly" ||
      tag === "amenities:wheelchair_accessible"
    ) {
      constraints.push(tag);
    } else if (
      ACTIVITIES.has(tag) ||
      tag.startsWith("feature:") ||
      tag.startsWith("amenities:") ||
      tag.startsWith("service:")
    ) {
      activities.push(tag);
    }
  }

  return { atmosphere, food, activities, constraints };
}

/**
 * Map a saved trip's generate prefs → book-a-trip draft (+ optional GPS override).
 */
export function draftFromSavedTrip(trip: SavedTrip): {
  draft: AutoTripDraft;
  locationOverride: { latitude: number; longitude: number } | null;
} {
  const prefs = pickSavedTripPrefs(trip);
  const buckets = bucketPreferences(prefs.preferences || []);

  const start =
    normalizeHHMM(prefs.startTimePerDay || "") ||
    DEFAULT_AUTO_TRIP_DRAFT.hours.split("|")[0]!;
  const end =
    normalizeHHMM(prefs.endTimePerDay || "") ||
    DEFAULT_AUTO_TRIP_DRAFT.hours.split("|")[1]!;
  const hours = joinDraftHours(start, end);
  const hoursMode: AutoTripHoursMode = HOURS_OPTIONS.some(
    (o) => o.value === hours,
  )
    ? "preset"
    : "custom";

  const startMode: AutoTripStartMode =
    prefs.startMode === "gps" ? "gps" : "preset";

  const budgetLevel =
    prefs.budgetLevel && BUDGETS.has(prefs.budgetLevel)
      ? prefs.budgetLevel
      : DEFAULT_AUTO_TRIP_DRAFT.budgetLevel;
  const pace =
    prefs.pace && PACES.has(prefs.pace)
      ? prefs.pace
      : DEFAULT_AUTO_TRIP_DRAFT.pace;

  const today = todayYmd();
  const rawDate =
    typeof trip.date === "string" && /^\d{4}-\d{2}-\d{2}/.test(trip.date)
      ? trip.date.slice(0, 10)
      : today;
  const tripDate = rawDate < today ? today : rawDate;

  const cleanTitle =
    trip.title.replace(/^Lộ trình\s+\d+:\s*/i, "").trim() || trip.title;

  const tripStatus: TripProgressStatus =
    resolveTripProgressStatus(trip) || "OnGoing";

  const draft: AutoTripDraft = {
    ...DEFAULT_AUTO_TRIP_DRAFT,
    title: cleanTitle.slice(0, 120),
    tripStatus,
    startId: prefs.startId || DEFAULT_AUTO_TRIP_DRAFT.startId,
    startMode,
    radiusKm:
      prefs.radiusKm != null && Number.isFinite(prefs.radiusKm)
        ? String(prefs.radiusKm)
        : DEFAULT_AUTO_TRIP_DRAFT.radiusKm,
    maxDistance:
      prefs.maxDistance != null && Number.isFinite(prefs.maxDistance)
        ? String(prefs.maxDistance)
        : DEFAULT_AUTO_TRIP_DRAFT.maxDistance,
    isRoundTrip: prefs.isRoundTrip ?? DEFAULT_AUTO_TRIP_DRAFT.isRoundTrip,
    budgetLevel,
    pace,
    date: tripDate,
    hours,
    hoursMode,
    tripType: prefs.tripType || null,
    targetCustomer: prefs.targetCustomer || null,
    atmosphere: buckets.atmosphere,
    food: buckets.food,
    activities: buckets.activities,
    constraints: buckets.constraints,
    showRoad: prefs.showRoad ?? DEFAULT_AUTO_TRIP_DRAFT.showRoad,
  };

  let locationOverride: { latitude: number; longitude: number } | null = null;
  // Always restore saved coords when present (preset + GPS) so regenerate /
  // map start marker match the trip that was saved — not only GPS mode.
  if (prefs.startCoords) {
    locationOverride = {
      latitude: prefs.startCoords.latitude,
      longitude: prefs.startCoords.longitude,
    };
  }

  return { draft, locationOverride };
}
