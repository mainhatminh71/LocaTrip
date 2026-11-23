import { NextResponse } from "next/server";
import {
  getSharedTrip,
  hasSharedTripsMongo,
  readJwtSub,
  resolveViewerUserId,
} from "@/lib/api/shared-trips-mongo";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Detail of one shared trip (auth required). */
export async function GET(request: Request, context: Ctx) {
  if (!hasSharedTripsMongo()) {
    return NextResponse.json(
      { error: "MONGO_URL chưa cấu hình cho shared trips" },
      { status: 503 },
    );
  }
  const sub = readJwtSub(request.headers.get("authorization"));
  if (!sub) {
    return NextResponse.json(
      { error: "Cần đăng nhập để xem chuyến được chia sẻ" },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  try {
    const viewerId = await resolveViewerUserId(sub);
    const sharedTrip = await getSharedTrip(id, viewerId || undefined);
    if (!sharedTrip) {
      return NextResponse.json(
        { error: "Không tìm thấy chuyến được chia sẻ" },
        { status: 404 },
      );
    }
    return NextResponse.json({ sharedTrip });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Không tải được chuyến đi";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
