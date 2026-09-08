import { mapboxToken } from "@/lib/mapbox";
import type { RouteFeatureCollection } from "@/lib/itinerary-map";

/** Mapbox Directions allows up to 25 coordinates per request. */
const MAX_WAYPOINTS = 25;

type LngLat = { lng: number; lat: number };

function encodeWaypoints(points: LngLat[]): string {
  return points.map((p) => `${p.lng},${p.lat}`).join(";");
}

/**
 * Driving geometry via Mapbox Directions (roads), not crow-flies.
 * Returns one LineString feature, or null on failure / missing token.
 */
export async function fetchDrivingRouteGeoJSON(
  points: LngLat[],
): Promise<RouteFeatureCollection | null> {
  const token = mapboxToken.trim();
  if (!token || points.length < 2) return null;

  const cleaned = points.filter(
    (p) => Number.isFinite(p.lng) && Number.isFinite(p.lat),
  );
  if (cleaned.length < 2) return null;

  const features: RouteFeatureCollection["features"] = [];

  for (let i = 0; i < cleaned.length - 1; ) {
    const end = Math.min(i + MAX_WAYPOINTS - 1, cleaned.length - 1);
    const chunk = cleaned.slice(i, end + 1);
    if (chunk.length < 2) break;

    const url =
      `https://api.mapbox.com/directions/v5/mapbox/driving/${encodeWaypoints(chunk)}` +
      `?geometries=geojson&overview=full&access_token=${encodeURIComponent(token)}`;

    try {
      const res = await fetch(url);
      if (!res.ok) break;
      const data = (await res.json()) as {
        routes?: Array<{ geometry?: { coordinates?: [number, number][] } }>;
      };
      const coords = data.routes?.[0]?.geometry?.coordinates;
      if (coords && coords.length >= 2) {
        features.push({
          type: "Feature",
          properties: { source: "mapbox-driving" },
          geometry: { type: "LineString", coordinates: coords },
        });
      }
    } catch {
      break;
    }

    // Advance with overlap so chunks connect (last point of previous chunk).
    i = end;
    if (i >= cleaned.length - 1) break;
  }

  if (features.length === 0) return null;
  return { type: "FeatureCollection", features };
}
