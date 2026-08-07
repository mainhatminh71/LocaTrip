import { NextResponse } from "next/server";
import {
  getUpstreamBase,
  proxyJsonResponse,
  upstreamHeaders,
  upstreamUnreachable,
} from "@/lib/api/proxy-upstream";

export const dynamic = "force-dynamic";

/** Proxy → LocalTrip `GET /trips/places/search?q=` */
export async function GET(request: Request) {
  const base = getUpstreamBase();
  const url = new URL(request.url);
  const qs = url.searchParams.toString();

  try {
    const upstream = await fetch(
      `${base}/trips/places/search${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
        headers: upstreamHeaders(request),
        cache: "no-store",
      },
    );
    return proxyJsonResponse(upstream);
  } catch (err) {
    const res = upstreamUnreachable(base, err);
    const body = await res.json();
    return NextResponse.json({ ...body, places: [] }, { status: res.status });
  }
}
