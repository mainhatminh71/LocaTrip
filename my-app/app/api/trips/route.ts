import { NextResponse } from "next/server";
import {
  getUpstreamBase,
  proxyJsonResponse,
  upstreamHeaders,
  upstreamUnreachable,
} from "@/lib/api/proxy-upstream";

export const dynamic = "force-dynamic";

/** Proxy → LocalTrip gateway `GET /trips/` (list) and `POST /trips/` (save).
 *  Nginx redirects `/trips` → `/trips/` (301); POST must hit the slash form or body is lost. */
export async function GET(request: Request) {
  const base = getUpstreamBase();
  const url = new URL(request.url);
  const qs = url.searchParams.toString();
  try {
    const upstream = await fetch(
      `${base}/trips/${qs ? `?${qs}` : ""}`,
      {
        method: "GET",
        headers: upstreamHeaders(request),
        cache: "no-store",
        redirect: "manual",
      },
    );
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
    const upstream = await fetch(`${base}/trips/`, {
      method: "POST",
      headers: upstreamHeaders(request, {
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(body),
      cache: "no-store",
      redirect: "manual",
    });
    return proxyJsonResponse(upstream);
  } catch (err) {
    return upstreamUnreachable(base, err);
  }
}
