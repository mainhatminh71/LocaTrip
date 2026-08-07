import type {
  AlternativePlaceSuggestion,
  DayItinerary,
  ItineraryOption,
  ScheduleItem,
  ScheduledTravel,
  ScheduledVisit,
  TripPlace,
} from "@/lib/trip";

export type ItineraryStop = {
  key: string;
  day: number;
  scheduleIndex: number;
  order: number;
  time: string;
  place: TripPlace;
  alternatives: AlternativePlaceSuggestion[];
  warning?: ScheduledVisit["warning"];
};

export function visitItems(schedule: ScheduleItem[]): ScheduledVisit[] {
  return schedule.filter((i): i is ScheduledVisit => i.type === "visit");
}

export function extractStops(itinerary: DayItinerary[]): ItineraryStop[] {
  const stops: ItineraryStop[] = [];
  let order = 0;
  for (const day of itinerary) {
    (day.schedule || []).forEach((item, scheduleIndex) => {
      if (item.type !== "visit") return;
      order += 1;
      stops.push({
        key: `${day.day}-${scheduleIndex}`,
        day: day.day,
        scheduleIndex,
        order,
        time: item.time,
        place: item.place,
        alternatives: item.topAlternatives ?? [],
        warning: item.warning,
      });
    });
  }
  return stops;
}

/** Merge travel leg GeoJSON LineStrings into one FeatureCollection. */
export type RouteFeatureCollection = {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: Record<string, unknown>;
    geometry: {
      type: "LineString";
      coordinates: [number, number][];
    };
  }>;
};

export function buildRouteGeoJSON(
  itinerary: DayItinerary[],
): RouteFeatureCollection | null {
  const features: RouteFeatureCollection["features"] = [];
  for (const day of itinerary) {
    for (const item of day.schedule || []) {
      if (item.type !== "travel") continue;
      const travel = item as ScheduledTravel;
      const coords = travel.routeGeometry?.coordinates;
      if (!coords || coords.length < 2) continue;
      features.push({
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: coords,
        },
      });
    }
  }
  if (features.length === 0) return null;
  return { type: "FeatureCollection", features };
}

export function cloneOption(opt: ItineraryOption): ItineraryOption {
  return structuredClone(opt);
}

/** Clear routeGeometry on all travel legs (after a place swap). */
export function clearRouteGeometry(option: ItineraryOption): ItineraryOption {
  const next = cloneOption(option);
  for (const day of next.itinerary) {
    for (const item of day.schedule || []) {
      if (item.type === "travel") {
        delete item.routeGeometry;
      }
    }
  }
  return next;
}

export function swapVisitPlace(
  option: ItineraryOption,
  day: number,
  scheduleIndex: number,
  alt: AlternativePlaceSuggestion,
  coordsFallback?: { latitude?: number; longitude?: number },
): ItineraryOption {
  let next = cloneOption(option);
  const dayBlock = next.itinerary.find((d) => d.day === day);
  if (!dayBlock) return option;
  const item = dayBlock.schedule[scheduleIndex];
  if (!item || item.type !== "visit") return option;

  const lat =
    alt.latitude ?? coordsFallback?.latitude ?? item.place.latitude;
  const lng =
    alt.longitude ?? coordsFallback?.longitude ?? item.place.longitude;

  item.place = {
    ...item.place,
    placeId: alt.placeId,
    title: alt.title,
    category: alt.category ?? item.place.category,
    address: alt.address ?? item.place.address,
    reviewRating: alt.reviewRating ?? item.place.reviewRating,
    latitude: lat,
    longitude: lng,
    tags: alt.tags ?? item.place.tags,
  };
  // Alternatives were relative to the old place — drop them after swap.
  item.topAlternatives = [];
  next = clearRouteGeometry(next);
  return next;
}

export function tagChips(tags: string[] | undefined, limit = 4): string[] {
  if (!tags?.length) return [];
  return tags
    .filter((t) => !t.startsWith("category:"))
    .map((t) => t.split(":")[1] || t)
    .filter(Boolean)
    .slice(0, limit);
}

export type MapStopPoint = {
  key: string;
  lat: number;
  lng: number;
  order: number;
  label: string;
  category?: string;
};

/**
 * Stops with coordinates for the map.
 * Falls back to the end of the preceding travel routeGeometry when place
 * lat/lng are missing (older API responses / cached trips).
 */
export function stopsForMap(itinerary: DayItinerary[]): MapStopPoint[] {
  const stops = extractStops(itinerary);
  const out: MapStopPoint[] = [];

  for (const stop of stops) {
    let lat = stop.place.latitude;
    let lng = stop.place.longitude;

    if (
      lat == null ||
      lng == null ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      const day = itinerary.find((d) => d.day === stop.day);
      const prev = day?.schedule?.[stop.scheduleIndex - 1];
      if (prev && prev.type === "travel") {
        const coords = prev.routeGeometry?.coordinates;
        if (coords && coords.length > 0) {
          const last = coords[coords.length - 1]!;
          lng = last[0];
          lat = last[1];
        }
      }
    }

    if (
      lat == null ||
      lng == null ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      continue;
    }

    out.push({
      key: stop.key,
      lat,
      lng,
      order: stop.order,
      label: stop.place.title,
      category: stop.place.category,
    });
  }

  return out;
}
