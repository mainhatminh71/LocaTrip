import { NextResponse } from "next/server";
import {
  hasSharedTripsMongo,
  rateSharedTrip,
  readJwtSub,
} from "@/lib/api/shared-trips-mongo";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Rate a shared trip 1–5 (not own posts). */
export async function POST(request: Request, context: Ctx) {
  if (!hasSharedTripsMongo()) {
    return NextResponse.json(
      { error: "MONGO_URL chưa cấu hình cho shared trips" },
      { status: 503 },
    );
  }
  const sub = readJwtSub(request.headers.get("authorization"));
  if (!sub) {
    return NextResponse.json(
      { error: "Cần đăng nhập để đánh giá" },
      { status: 401 },
    );
  }

  let body: { rating?: number };
  try {
    body = (await request.json()) as { rating?: number };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const rating = Number(body.rating);
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "rating phải từ 1 đến 5" },
      { status: 400 },
    );
  }

  const { id } = await context.params;
  try {
    const sharedTrip = await rateSharedTrip({
      keycloakSub: sub,
      sharedId: id,
      rating,
    });
    return NextResponse.json({ sharedTrip });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Không đánh giá được";
    const status = /không thể tự|không tìm thấy/i.test(message)
      ? /không thể tự/i.test(message)
        ? 403
        : 404
      : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
