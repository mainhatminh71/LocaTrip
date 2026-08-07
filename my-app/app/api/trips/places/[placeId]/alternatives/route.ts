import {
  getUpstreamBase,
  proxyJsonResponse,
  upstreamHeaders,
  upstreamUnreachable,
} from "@/lib/api/proxy-upstream";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ placeId: string }> };

/** Proxy → LocalTrip `GET /trips/places/:placeId/alternatives` */
export async function GET(request: Request, context: Ctx) {
  const base = getUpstreamBase();
  const { placeId } = await context.params;
  const url = new URL(request.url);
  const qs = url.searchParams.toString();

  try {
    const upstream = await fetch(
      `${base}/trips/places/${encodeURIComponent(placeId)}/alternatives${
        qs ? `?${qs}` : ""
      }`,
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
