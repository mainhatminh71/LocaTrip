import { NextResponse } from "next/server";
import {
  getUpstreamBase,
  proxyJsonResponse,
  upstreamHeaders,
  upstreamUnreachable,
} from "@/lib/api/proxy-upstream";

export const dynamic = "force-dynamic";

/** Proxy → LocalTrip `GET|POST /trips/prefs`. */
export async function GET(request: Request) {
  const base = getUpstreamBase();
  try {
    const upstream = await fetch(`${base}/trips/prefs`, {
      method: "GET",
      headers: upstreamHeaders(request),
      cache: "no-store",
    });
    return proxyJsonResponse(upstream);
  } catch (err) {
    return upstreamUnreachable(base, err);
  }
}

export async function POST(request: Request) {
  const base = getUpstreamBase();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${base}/trips/prefs`, {
      method: "POST",
      headers: upstreamHeaders(request, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(body),
      cache: "no-store",
    });
    return proxyJsonResponse(upstream);
  } catch (err) {
    return upstreamUnreachable(base, err);
  }
}
