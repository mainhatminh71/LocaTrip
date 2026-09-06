import {
  getUpstreamBase,
  proxyJsonResponse,
  upstreamHeaders,
  upstreamUnreachable,
} from "@/lib/api/proxy-upstream";

export const dynamic = "force-dynamic";

/** Proxy → payment-service `GET /wallet/transactions`. */
export async function GET(request: Request) {
  const base = getUpstreamBase("payment");
  const url = new URL(request.url);
  const qs = url.searchParams.toString();
  try {
    const upstream = await fetch(
      `${base}/wallet/transactions${qs ? `?${qs}` : ""}`,
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
