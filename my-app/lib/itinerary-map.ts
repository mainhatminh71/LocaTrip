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
  startCoords?: { latitude: number; longitude: number } | null,
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
  if (features.length > 0) {
    return { type: "FeatureCollection", features };
  }

  // Saved trips strip OSRM polylines — connect stop coords (straight segments).
  const stops = stopsForMap(itinerary);
  if (stops.length === 0) return null;

  const line: [number, number][] = [];
  if (
    startCoords &&
    Number.isFinite(startCoords.latitude) &&
    Number.isFinite(startCoords.longitude)
  ) {
    line.push([startCoords.longitude, startCoords.latitude]);
  }
  for (const stop of stops) {
    line.push([stop.lng, stop.lat]);
  }
  if (line.length < 2) return null;

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { synthetic: true },
        geometry: { type: "LineString", coordinates: line },
      },
    ],
  };
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
    let lat = toFiniteNumber(stop.place.latitude);
    let lng = toFiniteNumber(stop.place.longitude);

    if (lat == null || lng == null) {
      const day = itinerary.find((d) => d.day === stop.day);
      const prev = day?.schedule?.[stop.scheduleIndex - 1];
      if (prev && prev.type === "travel") {
        const coords = prev.routeGeometry?.coordinates;
        if (coords && coords.length > 0) {
          const last = coords[coords.length - 1]!;
          lng = toFiniteNumber(last[0]);
          lat = toFiniteNumber(last[1]);
        }
      }
    }

    if (lat == null || lng == null) continue;

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

function toFiniteNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/**
 * Fill missing visit lat/lng via place lookup (saved trips often lack coords).
 */
export async function enrichItineraryCoords(
  itinerary: DayItinerary[],
  fetchPlace: (
    placeId: string,
  ) => Promise<{ latitude?: number; longitude?: number } | null>,
): Promise<DayItinerary[]> {
  const next = structuredClone(itinerary);
  const cache = new Map<string, { latitude?: number; longitude?: number } | null>();

  const tasks: Promise<void>[] = [];
  for (const day of next) {
    for (const item of day.schedule || []) {
      if (item.type !== "visit" || !item.place) continue;

      const existingLat = toFiniteNumber(item.place.latitude);
      const existingLng = toFiniteNumber(item.place.longitude);
      if (existingLat != null && existingLng != null) {
        item.place.latitude = existingLat;
        item.place.longitude = existingLng;
        continue;
      }

      const placeId = item.place.placeId?.trim();
      if (!placeId) continue;

      tasks.push(
        (async () => {
          let hit = cache.get(placeId);
          if (hit === undefined) {
            try {
              hit = await fetchPlace(placeId);
            } catch {
              hit = null;
            }
            cache.set(placeId, hit);
          }
          const lat = toFiniteNumber(hit?.latitude);
          const lng = toFiniteNumber(hit?.longitude);
          if (lat != null && lng != null) {
            item.place.latitude = lat;
            item.place.longitude = lng;
          }
        })(),
      );
    }
  }

  await Promise.all(tasks);
  return next;
}

export type OptionCardSummary = {
  stopCount: number;
  timeRange: string | null;
  previewTitles: string[];
  moreCount: number;
  styleLabel: string | null;
};

const TRIP_STYLE_LABEL: Record<string, string> = {
  city_culture: "Nội thành",
  suburbs_nature: "Ngoại ô / thiên nhiên",
};

/** Compact facts for the “Chọn lộ trình” cards. */
export function summarizeOptionForCard(
  option: ItineraryOption,
  previewLimit = 3,
): OptionCardSummary {
  const visits = (option.itinerary || []).flatMap((day) =>
    visitItems(day.schedule || []),
  );
  const titles = visits
    .map((v) => v.place?.title?.trim())
    .filter((t): t is string => Boolean(t));
  const firstTime = visits[0]?.time?.split("-")[0]?.trim() || null;
  const lastTime =
    visits[visits.length - 1]?.time?.split("-").pop()?.trim() || null;
  const timeRange =
    firstTime && lastTime
      ? firstTime === lastTime
        ? firstTime
        : `${firstTime} – ${lastTime}`
      : null;
  const previewTitles = titles.slice(0, previewLimit);
  return {
    stopCount: visits.length,
    timeRange,
    previewTitles,
    moreCount: Math.max(0, titles.length - previewTitles.length),
    styleLabel: option.tripStyle
      ? TRIP_STYLE_LABEL[option.tripStyle] || null
      : null,
  };
}

