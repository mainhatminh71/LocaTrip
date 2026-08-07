"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DALAT_CENTER, mapboxStyle, mapboxToken } from "@/lib/mapbox";
import type { RouteFeatureCollection } from "@/lib/itinerary-map";
import { LtBrandLoader } from "./LtBrandLoader";
import styles from "./book-a-trip.module.css";

export type MapStop = {
  key: string;
  lat: number;
  lng: number;
  order: number;
  label: string;
  category?: string;
  /** Start / hotel point — distinct pin, not a numbered visit. */
  kind?: "start" | "stop";
};

type ItineraryMapProps = {
  className?: string;
  stops: MapStop[];
  selectedKey: string | null;
  routeGeoJSON: RouteFeatureCollection | null;
  onSelectStop: (key: string) => void;
  /** Parent busy (e.g. regenerating trip) — shows branded overlay. */
  busy?: boolean;
  busyLabel?: string;
};

const ROUTE_SOURCE = "itinerary-route";
const ROUTE_LAYER = "itinerary-route-line";

function truncateLabel(text: string, max = 22): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function createMarkerElement(
  stop: MapStop,
  selected: boolean,
  onSelect: (key: string) => void,
): HTMLElement {
  const isStart = stop.kind === "start";
  const wrap = document.createElement("div");
  wrap.className = isStart
    ? styles.mapPinStart
    : selected
      ? styles.mapPinSelected
      : styles.mapPin;

  const badge = document.createElement("button");
  badge.type = "button";
  badge.className = isStart
    ? styles.mapMarkerStart
    : selected
      ? styles.mapMarkerSelected
      : styles.mapMarker;
  badge.textContent = isStart ? "★" : String(stop.order);
  badge.setAttribute("aria-label", stop.label);

  const tag = document.createElement("span");
  tag.className = isStart
    ? styles.mapPlaceTagStart
    : selected
      ? styles.mapPlaceTagSelected
      : styles.mapPlaceTag;
  tag.textContent = truncateLabel(stop.label);

  wrap.append(badge, tag);

  if (!isStart) {
    const handle = (e: Event) => {
      e.stopPropagation();
      onSelect(stop.key);
    };
    wrap.addEventListener("click", handle);
    badge.addEventListener("click", handle);
  }

  return wrap;
}

export function ItineraryMap({
  className,
  stops,
  selectedKey,
  routeGeoJSON,
  onSelectStop,
  busy = false,
  busyLabel = "Đang dựng lộ trình…",
}: ItineraryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const onSelectRef = useRef(onSelectStop);
  onSelectRef.current = onSelectStop;
  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  const showOverlay = (!mapReady || busy) && !mapError;
  const overlayLabel = !mapReady
    ? "Đang tải bản đồ…"
    : busyLabel;

  // Init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: mapboxStyle,
      center: DALAT_CENTER,
      zoom: 12,
      attributionControl: true,
    });
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");
    mapRef.current = map;

    const onReady = () => {
      map.resize();
      setMapError(null);
      setMapReady(true);
    };
    const onError = (ev: { error?: Error }) => {
      const msg = ev?.error?.message || "Không tải được Mapbox";
      setMapError(msg);
      console.error("[ItineraryMap]", msg, ev);
    };
    if (map.isStyleLoaded()) onReady();
    else map.once("load", onReady);
    map.on("error", onError);

    // Pane can mount at 0 size then expand — keep canvas sized.
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => map.resize())
        : null;
    if (containerRef.current && ro) ro.observe(containerRef.current);

    return () => {
      ro?.disconnect();
      map.off("error", onError);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, []);

  // Markers + labels + fitBounds
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();

    for (const stop of stops) {
      if (!Number.isFinite(stop.lat) || !Number.isFinite(stop.lng)) continue;

      const el = createMarkerElement(
        stop,
        stop.key === selectedKey,
        (key) => onSelectRef.current(key),
      );

      const marker = new mapboxgl.Marker({ element: el, anchor: "left" })
        .setLngLat([stop.lng, stop.lat])
        .addTo(map);
      markersRef.current.push(marker);
      bounds.extend([stop.lng, stop.lat]);
    }

    if (stops.length === 1) {
      map.easeTo({
        center: [stops[0]!.lng, stops[0]!.lat],
        zoom: 13.5,
        duration: 500,
      });
    } else if (stops.length > 1 && !bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 72, maxZoom: 14, duration: 600 });
    }
  }, [stops, selectedKey, mapReady]);

  // Route polyline
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    if (map.getLayer(ROUTE_LAYER)) map.removeLayer(ROUTE_LAYER);
    if (map.getSource(ROUTE_SOURCE)) map.removeSource(ROUTE_SOURCE);

    if (!routeGeoJSON || routeGeoJSON.features.length === 0) return;

    map.addSource(ROUTE_SOURCE, {
      type: "geojson",
      data: routeGeoJSON,
    });
    map.addLayer({
      id: ROUTE_LAYER,
      type: "line",
      source: ROUTE_SOURCE,
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#0a6b7c",
        "line-width": 4,
        "line-opacity": 0.85,
      },
    });
  }, [routeGeoJSON, mapReady]);

  if (!mapboxToken) {
    return (
      <div className={`${styles.mapMissing} ${className ?? ""}`}>
        Thiếu cấu hình Mapbox (NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN).
      </div>
    );
  }

  return (
    <div className={`${styles.mapShell} ${className ?? ""}`}>
      <div ref={containerRef} className={styles.mapCanvas} />
      {mapError ? (
        <div className={styles.mapLoadingOverlay}>
          <div className={styles.mapLoadingCard}>
            <p className={styles.mapMissing}>{mapError}</p>
          </div>
        </div>
      ) : null}
      {showOverlay ? (
        <div className={styles.mapLoadingOverlay}>
          <div className={styles.mapLoadingCard}>
            <LtBrandLoader size="lg" tone="onLight" label={overlayLabel} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
