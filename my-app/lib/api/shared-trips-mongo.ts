import type { BudgetLevel, DayItinerary, Pace } from "@/lib/trip";
import type { SavedTripSource, TripProgressStatus } from "@/lib/api/trips";
import { slimItineraryForSave } from "@/lib/api/trips";
import { readJwtSub } from "@/lib/api/feedback-mongo";

export type SharedTripStatus = "public" | "removed";

export type SharedTripDoc = {
  id: string;
  sourceTripId: string;
  sharerId: string;
  sharerDisplayName: string;
  title: string;
  summary?: string;
  itinerary: DayItinerary[];
  date?: string;
  durationDays?: number;
  pace?: Pace;
  tripType?: string;
  targetCustomer?: string;
  preferences: string[];
  budgetLevel?: BudgetLevel;
  reuseCount: number;
  ratingSum: number;
  ratingCount: number;
  avgRating: number;
  sharedAt: string;
  updatedAt: string;
  status: SharedTripStatus;
  /** Present on detail when viewer is authenticated. */
  myRating?: number | null;
  isOwner?: boolean;
};

export type SharedTripListFilters = {
  title?: string;
  sharer?: string;
  sharedFrom?: string;
  sharedTo?: string;
  /** Style tags: tripType values and/or preference chip values. */
  tags?: string[];
  limit?: number;
  viewerId?: string;
};

function mongoUrl(): string | null {
  const url =
    process.env.MONGO_URL?.trim() ||
    process.env.LOCALTRIP_MONGO_URL?.trim() ||
    "";
  return url || null;
}

export function hasSharedTripsMongo(): boolean {
  return Boolean(mongoUrl());
}

export { readJwtSub };

function asIso(value: unknown): string | undefined {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "string" && value.trim()) return value;
  return undefined;
}

function coercePrefs(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((x) => (typeof x === "string" ? x.trim() : ""))
    .filter(Boolean);
}

function displayNameFromUser(user: Record<string, unknown>): string {
  const name =
    (typeof user.displayName === "string" && user.displayName.trim()) ||
    (typeof user.name === "string" && user.name.trim()) ||
    (typeof user.email === "string" && user.email.trim()) ||
    "";
  return name || "Người dùng LocaTrip";
}

function mapSharedDoc(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doc: any,
  viewerId?: string,
): SharedTripDoc {
  const ratingSum = Number(doc.ratingSum) || 0;
  const ratingCount = Number(doc.ratingCount) || 0;
  const avgRating =
    typeof doc.avgRating === "number" && Number.isFinite(doc.avgRating)
      ? doc.avgRating
      : ratingCount > 0
        ? Math.round((ratingSum / ratingCount) * 10) / 10
        : 0;

  return {
    id: String(doc._id),
    sourceTripId: String(doc.sourceTripId || ""),
    sharerId: String(doc.sharerId || ""),
    sharerDisplayName:
      typeof doc.sharerDisplayName === "string" && doc.sharerDisplayName.trim()
        ? doc.sharerDisplayName.trim()
        : "Người dùng LocaTrip",
    title:
      typeof doc.title === "string" && doc.title.trim()
        ? doc.title.trim()
        : "Chuyến đi",
    summary:
      typeof doc.summary === "string" && doc.summary.trim()
        ? doc.summary.trim()
        : undefined,
    itinerary: Array.isArray(doc.itinerary)
      ? (doc.itinerary as DayItinerary[])
      : [],
    date: typeof doc.date === "string" ? doc.date : undefined,
    durationDays:
      typeof doc.durationDays === "number" ? doc.durationDays : undefined,
    pace: typeof doc.pace === "string" ? (doc.pace as Pace) : undefined,
    tripType: typeof doc.tripType === "string" ? doc.tripType : undefined,
    targetCustomer:
      typeof doc.targetCustomer === "string" ? doc.targetCustomer : undefined,
    preferences: coercePrefs(doc.preferences),
    budgetLevel:
      typeof doc.budgetLevel === "string"
        ? (doc.budgetLevel as BudgetLevel)
        : undefined,
    reuseCount: Number(doc.reuseCount) || 0,
    ratingSum,
    ratingCount,
    avgRating,
    sharedAt: asIso(doc.sharedAt) || new Date(0).toISOString(),
    updatedAt: asIso(doc.updatedAt) || asIso(doc.sharedAt) || new Date(0).toISOString(),
    status: doc.status === "removed" ? "removed" : "public",
    isOwner: viewerId ? String(doc.sharerId) === viewerId : undefined,
  };
}

async function withDb<T>(
  fn: (
    db: import("mongodb").Db,
    ObjectId: typeof import("mongodb").ObjectId,
  ) => Promise<T>,
): Promise<T> {
  const url = mongoUrl();
  if (!url) throw new Error("MONGO_URL chưa cấu hình");
  const { MongoClient, ObjectId } = await import("mongodb");
  const client = new MongoClient(url);
  try {
    await client.connect();
    return await fn(client.db(), ObjectId);
  } finally {
    await client.close().catch(() => undefined);
  }
}

async function resolveUser(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  db: any,
  keycloakSub: string,
): Promise<{ id: string; displayName: string }> {
  const user = await db.collection("users").findOne({ keycloakSub });
  if (!user?._id) {
    throw new Error("Không tìm thấy user — đăng nhập lại rồi thử.");
  }
  return {
    id: String(user._id),
    displayName: displayNameFromUser(user as Record<string, unknown>),
  };
}

function prefsFromTripDoc(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trip: any,
): {
  tripType?: string;
  targetCustomer?: string;
  preferences: string[];
  budgetLevel?: BudgetLevel;
  pace?: Pace;
} {
  const g =
    trip.generatePrefs && typeof trip.generatePrefs === "object"
      ? trip.generatePrefs
      : {};
  return {
    tripType:
      (typeof g.tripType === "string" && g.tripType) ||
      (typeof trip.tripType === "string" ? trip.tripType : undefined),
    targetCustomer:
      (typeof g.targetCustomer === "string" && g.targetCustomer) ||
      (typeof trip.targetCustomer === "string"
        ? trip.targetCustomer
        : undefined),
    preferences: coercePrefs(g.preferences ?? trip.preferences),
    budgetLevel:
      (typeof g.budgetLevel === "string" && g.budgetLevel) ||
      (typeof trip.budgetLevel === "string" ? trip.budgetLevel : undefined),
    pace:
      (typeof g.pace === "string" && g.pace) ||
      (typeof trip.pace === "string" ? trip.pace : undefined),
  };
}

/** Publish or refresh a community shared-trip from an owned saved trip. */
export async function publishSharedTrip(input: {
  keycloakSub: string;
  tripId: string;
}): Promise<SharedTripDoc> {
  return withDb(async (db, ObjectId) => {
    if (!ObjectId.isValid(input.tripId)) {
      throw new Error("tripId không hợp lệ");
    }
    const user = await resolveUser(db, input.keycloakSub);
    const tripOid = new ObjectId(input.tripId);
    const trip = await db.collection("trips").findOne({
      _id: tripOid,
      ownerId: new ObjectId(user.id),
    });
    if (!trip) {
      throw new Error("Không tìm thấy chuyến đi của bạn");
    }

    const itinerary = slimItineraryForSave(
      Array.isArray(trip.itinerary) ? (trip.itinerary as DayItinerary[]) : [],
    );
    const prefs = prefsFromTripDoc(trip);
    const now = new Date();
    const date =
      (typeof trip.date === "string" && trip.date.slice(0, 10)) ||
      (typeof trip.tripDate === "string" && trip.tripDate.slice(0, 10)) ||
      undefined;

    const existing = await db.collection("shared_trips").findOne({
      sourceTripId: tripOid,
      status: "public",
    });

    const baseFields = {
      sourceTripId: tripOid,
      sharerId: new ObjectId(user.id),
      sharerDisplayName: user.displayName,
      title:
        typeof trip.title === "string" && trip.title.trim()
          ? trip.title.trim()
          : "Chuyến đi",
      summary:
        typeof trip.summary === "string" && trip.summary.trim()
          ? trip.summary.trim()
          : undefined,
      itinerary,
      date,
      durationDays:
        typeof trip.durationDays === "number"
          ? trip.durationDays
          : itinerary.length || undefined,
      pace: prefs.pace,
      tripType: prefs.tripType,
      targetCustomer: prefs.targetCustomer,
      preferences: prefs.preferences,
      budgetLevel: prefs.budgetLevel,
      updatedAt: now,
      status: "public" as const,
    };

    if (existing) {
      await db.collection("shared_trips").updateOne(
        { _id: existing._id },
        { $set: baseFields },
      );
      const updated = await db.collection("shared_trips").findOne({
        _id: existing._id,
      });
      return mapSharedDoc(updated, user.id);
    }

    const insert = {
      ...baseFields,
      reuseCount: 0,
      ratingSum: 0,
      ratingCount: 0,
      avgRating: 0,
      sharedAt: now,
    };
    const result = await db.collection("shared_trips").insertOne(insert);
    return mapSharedDoc({ ...insert, _id: result.insertedId }, user.id);
  });
}

export async function listSharedTrips(
  filters: SharedTripListFilters = {},
): Promise<SharedTripDoc[]> {
  return withDb(async (db, ObjectId) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const match: Record<string, any> = { status: "public" };

    const title = filters.title?.trim();
    if (title) {
      match.title = { $regex: title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    }

    const sharer = filters.sharer?.trim();
    if (sharer) {
      match.sharerDisplayName = {
        $regex: sharer.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    }

    const from = filters.sharedFrom?.trim();
    const to = filters.sharedTo?.trim();
    if (from || to) {
      match.sharedAt = {};
      if (from && /^\d{4}-\d{2}-\d{2}/.test(from)) {
        match.sharedAt.$gte = new Date(`${from.slice(0, 10)}T00:00:00.000Z`);
      }
      if (to && /^\d{4}-\d{2}-\d{2}/.test(to)) {
        match.sharedAt.$lte = new Date(`${to.slice(0, 10)}T23:59:59.999Z`);
      }
    }

    const tags = (filters.tags || []).map((t) => t.trim()).filter(Boolean);
    if (tags.length) {
      match.$or = [
        { tripType: { $in: tags } },
        { preferences: { $in: tags } },
        { targetCustomer: { $in: tags } },
      ];
    }

    const limit = Math.min(Math.max(filters.limit || 50, 1), 100);
    const docs = await db
      .collection("shared_trips")
      .find(match)
      .sort({ reuseCount: -1, sharedAt: -1 })
      .limit(limit)
      .toArray();

    let viewerOid: InstanceType<typeof ObjectId> | null = null;
    if (filters.viewerId && ObjectId.isValid(filters.viewerId)) {
      viewerOid = new ObjectId(filters.viewerId);
    }

    const mapped = docs.map((d) =>
      mapSharedDoc(d, filters.viewerId),
    );

    if (viewerOid && mapped.length) {
      const ids = mapped.map((m) => new ObjectId(m.id));
      const ratings = await db
        .collection("shared_trip_ratings")
        .find({
          sharedTripId: { $in: ids },
          raterId: viewerOid,
        })
        .toArray();
      const byShared = new Map(
        ratings.map((r) => [String(r.sharedTripId), Number(r.rating) || 0]),
      );
      for (const item of mapped) {
        item.myRating = byShared.get(item.id) ?? null;
      }
    }

    return mapped;
  });
}

export async function getSharedTrip(
  sharedId: string,
  viewerId?: string,
): Promise<SharedTripDoc | null> {
  return withDb(async (db, ObjectId) => {
    if (!ObjectId.isValid(sharedId)) return null;
    const doc = await db.collection("shared_trips").findOne({
      _id: new ObjectId(sharedId),
      status: "public",
    });
    if (!doc) return null;
    const mapped = mapSharedDoc(doc, viewerId);
    if (viewerId && ObjectId.isValid(viewerId)) {
      const rating = await db.collection("shared_trip_ratings").findOne({
        sharedTripId: new ObjectId(sharedId),
        raterId: new ObjectId(viewerId),
      });
      mapped.myRating =
        rating && typeof rating.rating === "number" ? rating.rating : null;
    }
    return mapped;
  });
}

export async function rateSharedTrip(input: {
  keycloakSub: string;
  sharedId: string;
  rating: number;
}): Promise<SharedTripDoc> {
  const rating = Math.round(input.rating);
  if (rating < 1 || rating > 5) {
    throw new Error("rating phải từ 1 đến 5");
  }

  return withDb(async (db, ObjectId) => {
    if (!ObjectId.isValid(input.sharedId)) {
      throw new Error("sharedId không hợp lệ");
    }
    const user = await resolveUser(db, input.keycloakSub);
    const sharedOid = new ObjectId(input.sharedId);
    const shared = await db.collection("shared_trips").findOne({
      _id: sharedOid,
      status: "public",
    });
    if (!shared) throw new Error("Không tìm thấy chuyến được chia sẻ");
    if (String(shared.sharerId) === user.id) {
      throw new Error("Không thể tự đánh giá chuyến của bạn");
    }

    const raterOid = new ObjectId(user.id);
    const existing = await db.collection("shared_trip_ratings").findOne({
      sharedTripId: sharedOid,
      raterId: raterOid,
    });

    const now = new Date();
    let ratingSum = Number(shared.ratingSum) || 0;
    let ratingCount = Number(shared.ratingCount) || 0;

    if (existing) {
      const prev = Number(existing.rating) || 0;
      ratingSum = ratingSum - prev + rating;
      await db.collection("shared_trip_ratings").updateOne(
        { _id: existing._id },
        { $set: { rating, updatedAt: now } },
      );
    } else {
      ratingSum += rating;
      ratingCount += 1;
      await db.collection("shared_trip_ratings").insertOne({
        sharedTripId: sharedOid,
        raterId: raterOid,
        rating,
        createdAt: now,
        updatedAt: now,
      });
    }

    const avgRating =
      ratingCount > 0
        ? Math.round((ratingSum / ratingCount) * 10) / 10
        : 0;

    await db.collection("shared_trips").updateOne(
      { _id: sharedOid },
      {
        $set: {
          ratingSum,
          ratingCount,
          avgRating,
          updatedAt: now,
        },
      },
    );

    const updated = await db.collection("shared_trips").findOne({
      _id: sharedOid,
    });
    const mapped = mapSharedDoc(updated, user.id);
    mapped.myRating = rating;
    return mapped;
  });
}

export type ReuseSharedTripResult = {
  shared: SharedTripDoc;
  /** Body for upstream POST /trips (caller creates with Bearer). */
  createBody: {
    title: string;
    itinerary: DayItinerary[];
    date: string;
    tripDate: string;
    source: SavedTripSource;
    status: "active";
    tripStatus: TripProgressStatus;
    summary?: string;
    durationDays?: number;
    pace?: Pace;
    tripType?: string;
    targetCustomer?: string;
    preferences?: string[];
    budgetLevel?: BudgetLevel;
  };
};

/** Load snapshot + bump reuse; caller must create the cloned trip via upstream. */
/** Owner withdraws a shared trip from the community feed. */
export async function unshareSharedTrip(input: {
  keycloakSub: string;
  sharedId: string;
}): Promise<{ id: string }> {
  return withDb(async (db, ObjectId) => {
    if (!ObjectId.isValid(input.sharedId)) {
      throw new Error("sharedId không hợp lệ");
    }
    const user = await resolveUser(db, input.keycloakSub);
    const sharedOid = new ObjectId(input.sharedId);
    const shared = await db.collection("shared_trips").findOne({
      _id: sharedOid,
      status: "public",
    });
    if (!shared) throw new Error("Không tìm thấy chuyến được chia sẻ");
    if (String(shared.sharerId) !== user.id) {
      throw new Error("Chỉ người chia sẻ mới thu hồi được");
    }
    await db.collection("shared_trips").updateOne(
      { _id: sharedOid },
      {
        $set: {
          status: "removed",
          updatedAt: new Date(),
        },
      },
    );
    return { id: String(sharedOid) };
  });
}

export async function prepareReuseSharedTrip(input: {
  keycloakSub: string;
  sharedId: string;
  travelDate: string;
}): Promise<ReuseSharedTripResult> {
  return withDb(async (db, ObjectId) => {
    if (!ObjectId.isValid(input.sharedId)) {
      throw new Error("sharedId không hợp lệ");
    }
    const user = await resolveUser(db, input.keycloakSub);
    const sharedOid = new ObjectId(input.sharedId);
    const shared = await db.collection("shared_trips").findOne({
      _id: sharedOid,
      status: "public",
    });
    if (!shared) throw new Error("Không tìm thấy chuyến được chia sẻ");

    await db.collection("shared_trips").updateOne(
      { _id: sharedOid },
      {
        $inc: { reuseCount: 1 },
        $set: { updatedAt: new Date() },
      },
    );

    const updated = await db.collection("shared_trips").findOne({
      _id: sharedOid,
    });
    const mapped = mapSharedDoc(updated, user.id);
    const date = input.travelDate.slice(0, 10);
    const itinerary = slimItineraryForSave(
      Array.isArray(shared.itinerary)
        ? (shared.itinerary as DayItinerary[])
        : [],
    );

    return {
      shared: mapped,
      createBody: {
        title: mapped.title,
        itinerary,
        date,
        tripDate: date,
        source: "manual",
        status: "active",
        tripStatus: "Pending",
        summary: mapped.summary,
        durationDays: mapped.durationDays || itinerary.length || undefined,
        pace: mapped.pace,
        tripType: mapped.tripType,
        targetCustomer: mapped.targetCustomer,
        preferences: mapped.preferences,
        budgetLevel: mapped.budgetLevel,
      },
    };
  });
}

export async function resolveViewerUserId(
  keycloakSub: string,
): Promise<string | null> {
  try {
    return await withDb(async (db) => {
      const user = await resolveUser(db, keycloakSub);
      return user.id;
    });
  } catch {
    return null;
  }
}
