import type { DayItinerary, Pace } from "@/lib/trip";
import type {
  SavedTripSource,
  SavedTripStatus,
  TripProgressStatus,
} from "@/lib/api/trips";
import { resolveTripDate } from "@/lib/api/trips";

/** Sanitized trip payload for public share pages (no owner secrets / paid slots). */
export type PublicTrip = {
  id: string;
  title: string;
  summary?: string;
  itinerary: DayItinerary[];
  date?: string;
  tripDate?: string;
  durationDays?: number;
  pace?: Pace;
  source?: SavedTripSource;
  status?: SavedTripStatus;
  tripStatus?: TripProgressStatus;
  totalEstimatedCost?: number | string;
};

function mongoUrl(): string | null {
  const url =
    process.env.MONGO_URL?.trim() ||
    process.env.LOCALTRIP_MONGO_URL?.trim() ||
    "";
  return url || null;
}

function asIso(value: unknown): string | undefined {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string" && value.trim()) return value;
  return undefined;
}

/**
 * Server-side public trip read from Mongo `trips` (same cluster as api.locatrip).
 * Trip ObjectIds are unguessable; knowing the id is enough to view a read-only copy.
 */
export async function fetchPublicTrip(
  tripId: string,
): Promise<PublicTrip | null> {
  const id = tripId.trim();
  if (!id) return null;

  const url = mongoUrl();
  if (!url) return null;

  const { MongoClient, ObjectId } = await import("mongodb");
  if (!ObjectId.isValid(id)) return null;

  const client = new MongoClient(url);
  try {
    await client.connect();
    const doc = await client.db().collection("trips").findOne({
      _id: new ObjectId(id),
    });
    if (!doc) return null;

    const itinerary = Array.isArray(doc.itinerary)
      ? (doc.itinerary as DayItinerary[])
      : [];

    const raw: PublicTrip = {
      id: String(doc._id),
      title:
        typeof doc.title === "string" && doc.title.trim()
          ? doc.title.trim()
          : "Chuyến đi",
      summary:
        typeof doc.summary === "string" && doc.summary.trim()
          ? doc.summary.trim()
          : undefined,
      itinerary,
      date: typeof doc.date === "string" ? doc.date : undefined,
      tripDate: typeof doc.tripDate === "string" ? doc.tripDate : undefined,
      durationDays:
        typeof doc.durationDays === "number" ? doc.durationDays : undefined,
      pace: typeof doc.pace === "string" ? (doc.pace as Pace) : undefined,
      source:
        typeof doc.source === "string"
          ? (doc.source as SavedTripSource)
          : undefined,
      status:
        typeof doc.status === "string"
          ? (doc.status as SavedTripStatus)
          : undefined,
      tripStatus:
        typeof doc.tripStatus === "string"
          ? (doc.tripStatus as TripProgressStatus)
          : undefined,
      totalEstimatedCost:
        typeof doc.totalEstimatedCost === "number" ||
        typeof doc.totalEstimatedCost === "string"
          ? doc.totalEstimatedCost
          : undefined,
    };

    const createdAt = asIso(doc.createdAt) || "";
    const date = resolveTripDate({
      date: raw.date,
      tripDate: raw.tripDate,
      createdAt,
    });
    return date ? { ...raw, date, tripDate: date } : raw;
  } catch {
    return null;
  } finally {
    await client.close().catch(() => undefined);
  }
}
