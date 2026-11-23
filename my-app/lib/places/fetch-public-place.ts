import type { PlaceDetail } from "@/lib/api/trips";
import { getUpstreamBase } from "@/lib/api/proxy-upstream";

/**
 * Server-side place fetch for public `/places/[placeId]` pages.
 * Calls LocalTrip upstream directly (no browser Bearer required).
 */
export async function fetchPublicPlace(
  placeId: string,
): Promise<PlaceDetail | null> {
  const id = placeId.trim();
  if (!id) return null;

  const base = getUpstreamBase();
  try {
    const res = await fetch(
      `${base}/trips/places/${encodeURIComponent(id)}`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      },
    );
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const data = (await res.json()) as {
      place?: PlaceDetail;
      title?: string;
      placeId?: string;
    };
    if (data.place) return data.place;
    // Some upstreams return the place object at the root.
    if (typeof data.title === "string" || typeof data.placeId === "string") {
      return data as PlaceDetail;
    }
    return null;
  } catch {
    return null;
  }
}
