import { NextResponse } from "next/server";
import {
  getUpstreamBase,
  proxyJsonResponse,
  upstreamHeaders,
  upstreamUnreachable,
} from "@/lib/api/proxy-upstream";
import {
  hasSharedTripsMongo,
  prepareReuseSharedTrip,
  readJwtSub,
} from "@/lib/api/shared-trips-mongo";
import { todayYmdHcm } from "@/lib/api/trips";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ id: string }> };

/**
 * Clone a shared trip into the caller's account (upstream POST /trips)
 * and bump reuseCount on the shared doc.
 */
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
      { error: "Cần đăng nhập để tái sử dụng" },
      { status: 401 },
    );
  }

  const { id } = await context.params;
  let prepared;
  try {
    prepared = await prepareReuseSharedTrip({
      keycloakSub: sub,
      sharedId: id,
      travelDate: todayYmdHcm(),
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Không tái sử dụng được";
    const status = /không tìm thấy|không hợp lệ/i.test(message) ? 404 : 400;
    return NextResponse.json({ error: message }, { status });
  }

  const base = getUpstreamBase("trip");
  try {
    const upstream = await fetch(`${base}/trips/`, {
      method: "POST",
      headers: upstreamHeaders(request, {
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify(prepared.createBody),
      cache: "no-store",
    });

    if (!upstream.ok) {
      return proxyJsonResponse(upstream);
    }

    const data = (await upstream.json()) as {
      trip?: { id?: string; [key: string]: unknown };
      error?: string;
    };
    if (!data.trip?.id) {
      return NextResponse.json(
        { error: "Server không trả về chuyến đi đã tạo" },
        { status: 502 },
      );
    }

    return NextResponse.json({
      sharedTrip: prepared.shared,
      trip: data.trip,
    });
  } catch (err) {
    return upstreamUnreachable(base, err);
  }
}
