import { NextResponse } from "next/server";
import {
  hasSharedTripsMongo,
  listSharedTrips,
  publishSharedTrip,
  readJwtSub,
  resolveViewerUserId,
} from "@/lib/api/shared-trips-mongo";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json(
    { error: "Cần đăng nhập để xem chuyến được chia sẻ" },
    { status: 401 },
  );
}

function mongoMissing() {
  return NextResponse.json(
    { error: "MONGO_URL chưa cấu hình cho shared trips" },
    { status: 503 },
  );
}

/** List community shared trips (auth required). */
export async function GET(request: Request) {
  if (!hasSharedTripsMongo()) return mongoMissing();
  const sub = readJwtSub(request.headers.get("authorization"));
  if (!sub) return unauthorized();

  const url = new URL(request.url);
  const tags = url.searchParams.getAll("tag").filter(Boolean);
  const limitRaw = Number(url.searchParams.get("limit") || "50");

  try {
    const viewerId = await resolveViewerUserId(sub);
    const sharedTrips = await listSharedTrips({
      title: url.searchParams.get("title") || undefined,
      sharer: url.searchParams.get("sharer") || undefined,
      sharedFrom: url.searchParams.get("sharedFrom") || undefined,
      sharedTo: url.searchParams.get("sharedTo") || undefined,
      tags,
      limit: Number.isFinite(limitRaw) ? limitRaw : 50,
      viewerId: viewerId || undefined,
    });
    return NextResponse.json({ sharedTrips });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Không tải được danh sách";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** Publish/upsert a trip onto the community feed (auth + owner). */
export async function POST(request: Request) {
  if (!hasSharedTripsMongo()) return mongoMissing();
  const sub = readJwtSub(request.headers.get("authorization"));
  if (!sub) return unauthorized();

  let body: { tripId?: string };
  try {
    body = (await request.json()) as { tripId?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const tripId = typeof body.tripId === "string" ? body.tripId.trim() : "";
  if (!tripId) {
    return NextResponse.json({ error: "Thiếu tripId" }, { status: 400 });
  }

  try {
    const sharedTrip = await publishSharedTrip({
      keycloakSub: sub,
      tripId,
    });
    return NextResponse.json({ sharedTrip });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Không chia sẻ được chuyến đi";
    const status =
      /không tìm thấy|không hợp lệ/i.test(message) ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
