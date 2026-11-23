import { NextResponse } from "next/server";
import {
  findOwnedPublicSharedBySourceTrip,
  hasSharedTripsMongo,
  readJwtSub,
} from "@/lib/api/shared-trips-mongo";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ tripId: string }> };

/** Owner: return public shared post for a saved trip, or null. */
export async function GET(_request: Request, context: Ctx) {
  if (!hasSharedTripsMongo()) {
    return NextResponse.json(
      { error: "MONGO_URL chưa cấu hình cho shared trips" },
      { status: 503 },
    );
  }
  const sub = readJwtSub(_request.headers.get("authorization"));
  if (!sub) {
    return NextResponse.json(
      { error: "Cần đăng nhập" },
      { status: 401 },
    );
  }

  const { tripId: raw } = await context.params;
  const tripId = typeof raw === "string" ? raw.trim() : "";
  if (!tripId) {
    return NextResponse.json({ error: "Thiếu tripId" }, { status: 400 });
  }

  try {
    const sharedTrip = await findOwnedPublicSharedBySourceTrip({
      keycloakSub: sub,
      tripId,
    });
    return NextResponse.json({ sharedTrip: sharedTrip ?? null });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Không kiểm tra được trạng thái chia sẻ";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
