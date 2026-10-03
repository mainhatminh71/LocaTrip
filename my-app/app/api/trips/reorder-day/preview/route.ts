import { NextResponse } from "next/server";
import {
  getUpstreamBase,
  proxyJsonResponse,
  upstreamHeaders,
  upstreamUnreachable,
} from "@/lib/api/proxy-upstream";

export const dynamic = "force-dynamic";

/** Proxy → LocalTrip `POST /trips/reorder-day/preview` */
export async function POST(request: Request) {
  const base = getUpstreamBase();
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${base}/trips/reorder-day/preview`, {
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
