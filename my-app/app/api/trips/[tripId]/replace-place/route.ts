import { NextResponse } from "next/server";
import {
  getUpstreamBase,
  proxyJsonResponse,
  upstreamHeaders,
  upstreamUnreachable,
} from "@/lib/api/proxy-upstream";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ tripId: string }> };

/** Proxy → LocalTrip `PUT /trips/:tripId/replace-place` */
export async function PUT(request: Request, ctx: Ctx) {
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
      `${base}/trips/${encodeURIComponent(tripId)}/replace-place`,
      {
        method: "PUT",
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
