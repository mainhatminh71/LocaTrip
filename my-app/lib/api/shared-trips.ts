import { apiFetch, ApiError } from "@/lib/api/http";
import type { SharedTripDoc } from "@/lib/api/shared-trips-mongo";
import type { SavedTrip } from "@/lib/api/trips";

export type { SharedTripDoc };

export type SharedTripListQuery = {
  title?: string;
  sharer?: string;
  sharedFrom?: string;
  sharedTo?: string;
  tags?: string[];
  limit?: number;
};

function buildListQs(query: SharedTripListQuery): string {
  const params = new URLSearchParams();
  if (query.title?.trim()) params.set("title", query.title.trim());
  if (query.sharer?.trim()) params.set("sharer", query.sharer.trim());
  if (query.sharedFrom?.trim()) params.set("sharedFrom", query.sharedFrom.trim());
  if (query.sharedTo?.trim()) params.set("sharedTo", query.sharedTo.trim());
  if (query.tags?.length) {
    for (const tag of query.tags) {
      if (tag.trim()) params.append("tag", tag.trim());
    }
  }
  if (query.limit) params.set("limit", String(query.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

async function readError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string };
    return data.error || `Lỗi ${res.status}`;
  } catch {
    return `Lỗi ${res.status}`;
  }
}

/** Publish/upsert current user's trip to the community feed. */
export async function publishSharedTrip(
  tripId: string,
): Promise<SharedTripDoc> {
  const res = await apiFetch("/api/shared-trips", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ tripId }),
    cache: "no-store",
  });
  const data = (await res.json()) as {
    sharedTrip?: SharedTripDoc;
    error?: string;
  };
  if (!res.ok) {
    throw new ApiError(data.error || (await readError(res)), res.status);
  }
  if (!data.sharedTrip?.id) {
    throw new ApiError("Server không trả về bài chia sẻ", 502);
  }
  return data.sharedTrip;
}

export async function listSharedTrips(
  query: SharedTripListQuery = {},
): Promise<SharedTripDoc[]> {
  const res = await apiFetch(`/api/shared-trips${buildListQs(query)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = (await res.json()) as {
    sharedTrips?: SharedTripDoc[];
    error?: string;
  };
  if (!res.ok) {
    throw new ApiError(data.error || (await readError(res)), res.status);
  }
  return data.sharedTrips ?? [];
}

export async function getSharedTrip(
  sharedId: string,
): Promise<SharedTripDoc> {
  const res = await apiFetch(
    `/api/shared-trips/${encodeURIComponent(sharedId)}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    },
  );
  const data = (await res.json()) as {
    sharedTrip?: SharedTripDoc;
    error?: string;
  };
  if (!res.ok) {
    throw new ApiError(data.error || (await readError(res)), res.status);
  }
  if (!data.sharedTrip) {
    throw new ApiError("Không tìm thấy chuyến được chia sẻ", 404);
  }
  return data.sharedTrip;
}

export async function rateSharedTrip(
  sharedId: string,
  rating: number,
): Promise<SharedTripDoc> {
  const res = await apiFetch(
    `/api/shared-trips/${encodeURIComponent(sharedId)}/rate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ rating }),
      cache: "no-store",
    },
  );
  const data = (await res.json()) as {
    sharedTrip?: SharedTripDoc;
    error?: string;
  };
  if (!res.ok) {
    throw new ApiError(data.error || (await readError(res)), res.status);
  }
  if (!data.sharedTrip) {
    throw new ApiError("Không cập nhật được đánh giá", 502);
  }
  return data.sharedTrip;
}

export async function reuseSharedTrip(
  sharedId: string,
): Promise<{ sharedTrip: SharedTripDoc; trip: SavedTrip }> {
  const res = await apiFetch(
    `/api/shared-trips/${encodeURIComponent(sharedId)}/reuse`,
    {
      method: "POST",
      headers: { Accept: "application/json" },
      cache: "no-store",
    },
  );
  const data = (await res.json()) as {
    sharedTrip?: SharedTripDoc;
    trip?: SavedTrip;
    error?: string;
  };
  if (!res.ok) {
    throw new ApiError(data.error || (await readError(res)), res.status);
  }
  if (!data.sharedTrip || !data.trip?.id) {
    throw new ApiError("Không tái sử dụng được chuyến đi", 502);
  }
  return { sharedTrip: data.sharedTrip, trip: data.trip };
}
