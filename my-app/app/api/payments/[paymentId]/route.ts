import {
  getUpstreamBase,
  proxyJsonResponse,
  upstreamHeaders,
  upstreamUnreachable,
} from "@/lib/api/proxy-upstream";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ paymentId: string }> };

/** Proxy → LocalTrip `GET /payments/:paymentId`. */
export async function GET(request: Request, ctx: Ctx) {
  const { paymentId } = await ctx.params;
  const base = getUpstreamBase("payment");
  try {
    const upstream = await fetch(
      `${base}/payments/${encodeURIComponent(paymentId)}`,
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
