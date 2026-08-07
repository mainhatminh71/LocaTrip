import { NextResponse } from "next/server";

const DEFAULT_API = "http://localhost:5000";

export function getUpstreamBase(): string {
  return (process.env.LOCALTRIP_API_URL || DEFAULT_API).replace(/\/$/, "");
}

/** Forward Authorization (and content-type when present) to LocalTrip. */
export function upstreamHeaders(
  request: Request,
  extra?: HeadersInit,
): Headers {
  const headers = new Headers(extra);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  const auth = request.headers.get("authorization");
  if (auth) headers.set("Authorization", auth);
  return headers;
}

export async function proxyJsonResponse(
  upstream: Response,
): Promise<NextResponse> {
  const text = await upstream.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: text || "Upstream returned non-JSON" };
  }
  return NextResponse.json(data, { status: upstream.status });
}

export function upstreamUnreachable(base: string, err: unknown): NextResponse {
  const message = err instanceof Error ? err.message : "Cannot reach LocalTrip API";
  return NextResponse.json(
    {
      error: `Không kết nối được backend (${base}). Chạy server LocalTrip rồi thử lại. Chi tiết: ${message}`,
    },
    { status: 502 },
  );
}
