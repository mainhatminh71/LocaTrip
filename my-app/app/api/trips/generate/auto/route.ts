import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_API = "http://localhost:5000";

/**
 * Proxy to LocalTrip backend `POST /trips/generate/auto`
 * so the browser stays same-origin (no CORS on Express).
 */
export async function POST(request: Request) {
  const base = (process.env.LOCALTRIP_API_URL || DEFAULT_API).replace(/\/$/, "");
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${base}/trips/generate/auto`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const text = await upstream.text();
    let data: unknown = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { error: text || "Upstream returned non-JSON" };
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Cannot reach LocalTrip API";
    return NextResponse.json(
      {
        error: `Không kết nối được backend (${base}). Chạy server LocalTrip rồi thử lại. Chi tiết: ${message}`,
      },
      { status: 502 },
    );
  }
}
