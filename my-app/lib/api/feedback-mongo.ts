export type FeedbackInsertInput = {
  keycloakSub: string;
  tripId?: string;
  rating: number;
  comment: string;
  mode: "save" | "update";
  tripTitle?: string;
};

export type FeedbackInsertResult = {
  id: string;
  tripId: string | null;
  rating: number;
  comment: string;
  mode: "save" | "update";
  tripTitle?: string;
  createdAt: string;
};

function mongoUrl(): string | null {
  const url =
    process.env.MONGO_URL?.trim() ||
    process.env.LOCALTRIP_MONGO_URL?.trim() ||
    "";
  return url || null;
}

export function hasFeedbackMongo(): boolean {
  return Boolean(mongoUrl());
}

/**
 * Direct Atlas write used when DO trip-service has not deployed
 * `POST /trips/feedback` yet. Same cluster as api.locatrip services.
 * Dynamic-imports `mongodb` so Cloudflare Workers builds stay lean.
 */
export async function insertServiceFeedbackDirect(
  input: FeedbackInsertInput,
): Promise<FeedbackInsertResult | null> {
  const url = mongoUrl();
  if (!url) return null;

  const { MongoClient, ObjectId } = await import("mongodb");
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db();

    const user = await db.collection("users").findOne({
      keycloakSub: input.keycloakSub,
    });
    if (!user?._id) {
      throw new Error("Không tìm thấy user — đăng nhập lại rồi thử.");
    }
    const ownerId = user._id;

    let tripObjectId: InstanceType<typeof ObjectId> | null = null;
    if (input.tripId) {
      if (!ObjectId.isValid(input.tripId)) {
        throw new Error("tripId không hợp lệ");
      }
      tripObjectId = new ObjectId(input.tripId);
      const trip = await db.collection("trips").findOne({
        _id: tripObjectId,
        ownerId,
      });
      if (!trip) {
        throw new Error("Không tìm thấy chuyến đi");
      }
    }

    const now = new Date();
    const doc = {
      ownerId,
      tripId: tripObjectId,
      rating: Math.round(input.rating),
      comment: input.comment,
      mode: input.mode,
      tripTitle: input.tripTitle,
      createdAt: now,
      updatedAt: now,
    };

    const result = await db.collection("trip_service_feedbacks").insertOne(doc);
    return {
      id: String(result.insertedId),
      tripId: tripObjectId ? String(tripObjectId) : null,
      rating: doc.rating,
      comment: doc.comment,
      mode: doc.mode,
      tripTitle: doc.tripTitle,
      createdAt: now.toISOString(),
    };
  } finally {
    await client.close().catch(() => undefined);
  }
}

/** Decode Keycloak access token payload (no verify — session already established). */
export function readJwtSub(authHeader: string | null): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice("Bearer ".length).trim();
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const json = Buffer.from(parts[1]!, "base64url").toString("utf8");
    const payload = JSON.parse(json) as { sub?: string };
    return typeof payload.sub === "string" && payload.sub ? payload.sub : null;
  } catch {
    return null;
  }
}
