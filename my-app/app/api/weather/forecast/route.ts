import {
  getUpstreamBase,
  proxyJsonResponse,
  upstreamHeaders,
  upstreamUnreachable,
} from "@/lib/api/proxy-upstream";

export const dynamic = "force-dynamic";

/** Proxy → weather-service `GET /weather/forecast` (Open-Meteo via gateway). */
export async function GET(request: Request) {
  const base = getUpstreamBase();
  const { searchParams } = new URL(request.url);
  const qs = searchParams.toString();

  try {
    const upstream = await fetch(
      `${base}/weather/forecast${qs ? `?${qs}` : ""}`,
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
