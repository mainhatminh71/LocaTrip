import { mapboxToken } from "@/lib/mapbox";
import type { RouteFeatureCollection } from "@/lib/itinerary-map";
import { routeLegColor } from "@/lib/route-leg-colors";

type LngLat = { lng: number; lat: number };

/**
 * Driving geometry via Mapbox Directions (roads), not crow-flies.
 * Fetches each consecutive pair so a place-swap still redraws the full path
 * even when older multi-stop OSRM polylines are incomplete/cleared.
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

  for (let i = 0; i < cleaned.length - 1; i++) {
    const a = cleaned[i]!;
    const b = cleaned[i + 1]!;
    const path = `${a.lng},${a.lat};${b.lng},${b.lat}`;
    const url =
      `https://api.mapbox.com/directions/v5/mapbox/driving/${path}` +
      `?geometries=geojson&overview=full&access_token=${encodeURIComponent(token)}`;

    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = (await res.json()) as {
        routes?: Array<{ geometry?: { coordinates?: [number, number][] } }>;
      };
      const coords = data.routes?.[0]?.geometry?.coordinates;
      if (coords && coords.length >= 2) {
        features.push({
          type: "Feature",
          properties: {
            source: "mapbox-driving",
            legIndex: i,
            color: routeLegColor(i),
          },
          geometry: { type: "LineString", coordinates: coords },
        });
      }
    } catch {
      /* skip this leg; keep drawing others */
    }
  }

  if (features.length === 0) return null;
  return { type: "FeatureCollection", features };
}
