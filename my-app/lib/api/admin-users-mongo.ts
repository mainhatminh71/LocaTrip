export type AdminUserFeedback = {
  rating: number;
  comment: string;
  tripTitle?: string;
  createdAt: string;
};

export type AdminUserRow = {
  id: string;
  keycloakSub: string;
  email: string;
  displayName: string;
  role: string;
  isActive: boolean;
  createdAt: string | null;
  updatedAt: string | null;
  lastLoginAt: string | null;
  keycloak: {
    sub: string;
    email: string;
    displayName: string;
    appRole: string;
  };
  wallet: {
    balance: number;
    xuToppedUp: number;
    topupCount: number;
  };
  payments: {
    vndPaid: number;
    paidCount: number;
  };
  trips: {
    count: number;
  };
  feedback: {
    count: number;
    avgRating: number | null;
    recent: AdminUserFeedback[];
  };
};

function mongoUrl(): string | null {
  const url =
    process.env.MONGO_URL?.trim() ||
    process.env.LOCALTRIP_MONGO_URL?.trim() ||
    "";
  return url || null;
}

export function hasAdminUsersMongo(): boolean {
  return Boolean(mongoUrl());
}

function iso(value: unknown): string | null {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString();
  const d = new Date(String(value));
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/**
 * Admin overview: users + Keycloak fields synced in Mongo + wallet top-up,
 * paid VND, trip counts, feedback.
 */
export async function listAdminUsersOverview(): Promise<AdminUserRow[]> {
  const url = mongoUrl();
  if (!url) {
    throw new Error("MONGO_URL chưa cấu hình");
  }

  const { MongoClient } = await import("mongodb");
  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db();

    const users = await db
      .collection("users")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    if (users.length === 0) return [];

    const userIds = users.map((u) => u._id);

    const [wallets, topups, payments, trips, feedbacks] = await Promise.all([
      db
        .collection("wallets")
        .find({ userId: { $in: userIds } })
        .project({ userId: 1, balance: 1 })
        .toArray(),
      db
        .collection("wallet_ledgers")
        .aggregate<{
          _id: unknown;
          xuToppedUp: number;
          topupCount: number;
        }>([
          { $match: { userId: { $in: userIds }, reason: "topup" } },
          {
            $group: {
              _id: "$userId",
              xuToppedUp: { $sum: "$delta" },
              topupCount: { $sum: 1 },
            },
          },
        ])
        .toArray(),
      db
        .collection("payments")
        .aggregate<{
          _id: unknown;
          vndPaid: number;
          paidCount: number;
        }>([
          { $match: { ownerId: { $in: userIds }, status: "paid" } },
          {
            $group: {
              _id: "$ownerId",
              vndPaid: { $sum: "$amount" },
              paidCount: { $sum: 1 },
            },
          },
        ])
        .toArray(),
      db
        .collection("trips")
        .aggregate<{ _id: unknown; count: number }>([
          { $match: { ownerId: { $in: userIds } } },
          { $group: { _id: "$ownerId", count: { $sum: 1 } } },
        ])
        .toArray(),
      db
        .collection("trip_service_feedbacks")
        .aggregate<{
          _id: unknown;
          count: number;
          avgRating: number | null;
          recent: Array<{
            rating: number;
            comment: string;
            tripTitle?: string;
            createdAt: Date | string;
          }>;
        }>([
          { $match: { ownerId: { $in: userIds } } },
          { $sort: { createdAt: -1 } },
          {
            $group: {
              _id: "$ownerId",
              count: { $sum: 1 },
              avgRating: { $avg: "$rating" },
              recent: {
                $push: {
                  rating: "$rating",
                  comment: "$comment",
                  tripTitle: "$tripTitle",
                  createdAt: "$createdAt",
                },
              },
            },
          },
        ])
        .toArray(),
    ]);

    const walletByUser = new Map(
      wallets.map((w) => [String(w.userId), Number(w.balance) || 0]),
    );
    const topupByUser = new Map(
      topups.map((t) => [
        String(t._id),
        {
          xuToppedUp: Number(t.xuToppedUp) || 0,
          topupCount: Number(t.topupCount) || 0,
        },
      ]),
    );
    const payByUser = new Map(
      payments.map((p) => [
        String(p._id),
        {
          vndPaid: Number(p.vndPaid) || 0,
          paidCount: Number(p.paidCount) || 0,
        },
      ]),
    );
    const tripByUser = new Map(
      trips.map((t) => [String(t._id), Number(t.count) || 0]),
    );
    const feedbackByUser = new Map(
      feedbacks.map((f) => [
        String(f._id),
        {
          count: Number(f.count) || 0,
          avgRating:
            typeof f.avgRating === "number" && Number.isFinite(f.avgRating)
              ? Math.round(f.avgRating * 10) / 10
              : null,
          recent: (Array.isArray(f.recent) ? f.recent : [])
            .slice(0, 5)
            .map((r) => ({
              rating: Number(r.rating) || 0,
              comment: String(r.comment || ""),
              tripTitle: r.tripTitle ? String(r.tripTitle) : undefined,
              createdAt: iso(r.createdAt) || "",
            })),
        },
      ]),
    );

    return users.map((u) => {
      const id = String(u._id);
      const email = String(u.email || "");
      const displayName = String(u.displayName || email || "—");
      const role = String(u.role || "traveller");
      const keycloakSub = String(u.keycloakSub || "");
      const topup = topupByUser.get(id) || { xuToppedUp: 0, topupCount: 0 };
      const pay = payByUser.get(id) || { vndPaid: 0, paidCount: 0 };
      const fb = feedbackByUser.get(id) || {
        count: 0,
        avgRating: null as number | null,
        recent: [] as AdminUserFeedback[],
      };

      return {
        id,
        keycloakSub,
        email,
        displayName,
        role,
        isActive: u.isActive !== false,
        createdAt: iso(u.createdAt),
        updatedAt: iso(u.updatedAt),
        lastLoginAt: iso(u.lastLoginAt),
        keycloak: {
          sub: keycloakSub,
          email,
          displayName,
          appRole: role,
        },
        wallet: {
          balance: walletByUser.get(id) ?? 0,
          xuToppedUp: topup.xuToppedUp,
          topupCount: topup.topupCount,
        },
        payments: {
          vndPaid: pay.vndPaid,
          paidCount: pay.paidCount,
        },
        trips: {
          count: tripByUser.get(id) ?? 0,
        },
        feedback: fb,
      };
    });
  } finally {
    await client.close().catch(() => undefined);
  }
}
