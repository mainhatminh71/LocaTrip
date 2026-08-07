import { NextResponse } from "next/server";
import {
  getUpstreamBase,
  proxyJsonResponse,
  upstreamHeaders,
  upstreamUnreachable,
} from "@/lib/api/proxy-upstream";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ tripId: string }> };

/** Proxy → LocalTrip `GET|PATCH|DELETE /trips/:tripId`. */
export async function GET(request: Request, ctx: Ctx) {
  const { tripId } = await ctx.params;
  const base = getUpstreamBase();
  try {
    const upstream = await fetch(
      `${base}/trips/${encodeURIComponent(tripId)}`,
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

export async function PATCH(request: Request, ctx: Ctx) {
  const { tripId } = await ctx.params;
  const base = getUpstreamBase();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    const upstream = await fetch(
      `${base}/trips/${encodeURIComponent(tripId)}`,
      {
        method: "PATCH",
        headers: upstreamHeaders(request, {
          "Content-Type": "application/json",
        }),
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );
    return proxyJsonResponse(upstream);
  } catch (err) {
    return upstreamUnreachable(base, err);
  }
}

export async function DELETE(request: Request, ctx: Ctx) {
  const { tripId } = await ctx.params;
  const base = getUpstreamBase();
  try {
    const upstream = await fetch(
      `${base}/trips/${encodeURIComponent(tripId)}`,
      {
        method: "DELETE",
        headers: upstreamHeaders(request),
        cache: "no-store",
      },
    );
    if (upstream.status === 204) {
      return new NextResponse(null, { status: 204 });
    }
    return proxyJsonResponse(upstream);
  } catch (err) {
    return upstreamUnreachable(base, err);
  }
}
