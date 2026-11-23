import { NextResponse } from "next/server";
import {
  hasSharedTripsMongo,
  readJwtSub,
  unshareSharedTrip,
} from "@/lib/api/shared-trips-mongo";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/** Owner withdraws their shared trip from the community feed. */
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
      { error: "Cần đăng nhập để thu hồi" },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  try {
    const result = await unshareSharedTrip({
      keycloakSub: sub,
      sharedId: id,
    });
    return NextResponse.json({ ok: true, id: result.id });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Không thu hồi được";
    const status = /chỉ người|không tìm thấy/i.test(message)
      ? /chỉ người/i.test(message)
        ? 403
        : 404
      : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
