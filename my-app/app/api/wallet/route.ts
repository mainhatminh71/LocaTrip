import {
  getUpstreamBase,
  proxyJsonResponse,
  upstreamHeaders,
  upstreamUnreachable,
} from "@/lib/api/proxy-upstream";

export const dynamic = "force-dynamic";

/** Proxy → payment-service `GET /wallet`. */
export async function GET(request: Request) {
  const base = getUpstreamBase("payment");
  try {
    const upstream = await fetch(`${base}/wallet`, {
      method: "GET",
      headers: upstreamHeaders(request),
      cache: "no-store",
    });
    return proxyJsonResponse(upstream);
  } catch (err) {
    return upstreamUnreachable(base, err);
  }
}
