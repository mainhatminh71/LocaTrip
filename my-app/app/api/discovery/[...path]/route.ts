import { NextResponse } from "next/server";
import { getUpstreamBase } from "@/lib/api/proxy-upstream";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ path: string[] }> };

async function proxy(request: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  const base = getUpstreamBase();
  const suffix = path.map(encodeURIComponent).join("/");
  const url = new URL(request.url);
  const target = `${base}/discovery/${suffix}${url.search}`;

  const headers: HeadersInit = { Accept: "application/json" };
  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    const text = await request.text();
    if (text) {
      headers["Content-Type"] = "application/json";
      init.body = text;
    }
  }

  try {
    const upstream = await fetch(target, init);
    const bodyText = await upstream.text();
    let data: unknown = null;
    try {
      data = bodyText ? JSON.parse(bodyText) : null;
    } catch {
      data = { error: bodyText || "Upstream returned non-JSON" };
    }
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Cannot reach LocalTrip API";
    return NextResponse.json(
      {
        error: `Không kết nối được backend (${base}). Chi tiết: ${message}`,
      },
      { status: 502 },
    );
  }
}

export const GET = proxy;
export const POST = proxy;
