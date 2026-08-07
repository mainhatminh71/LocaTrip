import {
  getUpstreamBase,
  proxyJsonResponse,
  upstreamHeaders,
  upstreamUnreachable,
} from "@/lib/api/proxy-upstream";

export const dynamic = "force-dynamic";

/** Proxy → LocalTrip `GET /admin/import-status` */
export async function GET(request: Request) {
  const base = getUpstreamBase();
  try {
    const upstream = await fetch(`${base}/admin/import-status`, {
      method: "GET",
      headers: upstreamHeaders(request),
      cache: "no-store",
    });
    return proxyJsonResponse(upstream);
  } catch (err) {
    return upstreamUnreachable(base, err);
  }
}
