import { NextResponse } from "next/server";
import {
  getUpstreamBase,
  proxyJsonResponse,
  upstreamHeaders,
  upstreamUnreachable,
} from "@/lib/api/proxy-upstream";
import {
  hasFeedbackMongo,
  insertServiceFeedbackDirect,
  readJwtSub,
} from "@/lib/api/feedback-mongo";

export const dynamic = "force-dynamic";

function looksLikeMissingRoute(status: number, text: string): boolean {
  if (status === 404) return true;
  const lower = text.toLowerCase();
  return (
    lower.includes("not found in trip service") ||
    lower.includes("api route not found")
  );
}

/** Proxy → LocalTrip `GET /trips/feedback` (DO gateway). */
export async function GET(request: Request) {
  const base = getUpstreamBase("feedback");
  const url = new URL(request.url);
  const qs = url.searchParams.toString();
  try {
    const upstream = await fetch(
      `${base}/trips/feedback${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
        headers: upstreamHeaders(request),
        cache: "no-store",
      },
    );
    return proxyJsonResponse(upstream);
  } catch (err) {
    return upstreamUnreachable(base, err);
  }
}

/**
 * Proxy → `POST /trips/feedback` on api.locatrip.app.
 * If trip-service on DO chưa deploy route mới → fallback ghi Mongo Atlas
 * (cùng DB với api.locatrip) khi có MONGO_URL.
 */
export async function POST(request: Request) {
  const base = getUpstreamBase("feedback");
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
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

  try {
    const upstream = await fetch(`${base}/trips/feedback`, {
      method: "POST",
      headers: upstreamHeaders(request, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(body),
      cache: "no-store",
    });

    if (upstream.ok || upstream.status === 401 || upstream.status === 403) {
      return proxyJsonResponse(upstream);
    }

    const text = await upstream.text();
    if (!looksLikeMissingRoute(upstream.status, text) || !hasFeedbackMongo()) {
      let data: unknown = null;
      try {
        data = text ? JSON.parse(text) : { error: `Lỗi ${upstream.status}` };
      } catch {
        data = { error: text || `Lỗi ${upstream.status}` };
      }
      return NextResponse.json(data ?? {}, { status: upstream.status });
    }

    // Fall through to Atlas write below.
  } catch (err) {
    if (!hasFeedbackMongo()) {
      return upstreamUnreachable(base, err);
    }
  }

  const sub = readJwtSub(request.headers.get("authorization"));
  if (!sub) {
    return NextResponse.json(
      { error: "Missing or invalid Authorization header" },
      { status: 401 },
    );
  }

  const comment =
    typeof body.comment === "string" ? body.comment.trim().slice(0, 800) : "";
  const modeRaw = String(body.mode || "save").toLowerCase();
  const mode = modeRaw === "update" ? "update" : "save";
  const tripId =
    typeof body.tripId === "string" ? body.tripId.trim() : undefined;
  const tripTitle =
    typeof body.tripTitle === "string"
      ? body.tripTitle.trim().slice(0, 200)
      : undefined;

  try {
    const feedback = await insertServiceFeedbackDirect({
      keycloakSub: sub,
      tripId,
      rating,
      comment,
      mode,
      tripTitle,
    });
    if (!feedback) {
      return NextResponse.json(
        { error: "MONGO_URL chưa cấu hình để lưu feedback" },
        { status: 503 },
      );
    }
    return NextResponse.json({ feedback }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Không lưu được đánh giá";
    const status = message.includes("Không tìm thấy") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
