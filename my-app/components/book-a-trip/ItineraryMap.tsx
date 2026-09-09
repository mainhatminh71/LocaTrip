"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  DALAT_CENTER,
  mapboxStyle,
  mapboxToken,
  suppressBlockedSeaLabels,
} from "@/lib/mapbox";
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
  /** Sidebar travel row key (`day-scheduleIndex`) — highlights that leg. */
  selectedTravelKey?: string | null;
  routeGeoJSON: RouteFeatureCollection | null;
  onSelectStop: (key: string) => void;
  /** Clear travel highlight (click map empty / outside). */
  onClearTravel?: () => void;
  /** Parent busy (e.g. regenerating trip) — shows branded overlay. */
  busy?: boolean;
  busyLabel?: string;
};

const ROUTE_SOURCE = "itinerary-route";
const ROUTE_LAYER = "itinerary-route-line";
const ROUTE_ARROW_LAYER = "itinerary-route-arrows";
const ROUTE_ARROW_IMAGE = "itinerary-route-arrow-sdf";

/** White chevron as SDF so `icon-color` can match each leg. */
function ensureRouteArrowImage(map: mapboxgl.Map): void {
  if (map.hasImage(ROUTE_ARROW_IMAGE)) return;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  // Triangle pointing right
  ctx.moveTo(size * 0.22, size * 0.2);
  ctx.lineTo(size * 0.82, size * 0.5);
  ctx.lineTo(size * 0.22, size * 0.8);
  ctx.closePath();
  ctx.fill();
  const data = ctx.getImageData(0, 0, size, size);
  map.addImage(ROUTE_ARROW_IMAGE, data, { pixelRatio: 2, sdf: true });
}

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
  selectedTravelKey = null,
  routeGeoJSON,
  onSelectStop,
  onClearTravel,
  busy = false,
  busyLabel = "Đang dựng lộ trình…",
}: ItineraryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const onSelectRef = useRef(onSelectStop);
  onSelectRef.current = onSelectStop;
  const onClearTravelRef = useRef(onClearTravel);
  onClearTravelRef.current = onClearTravel;
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

    const onMapClick = () => {
      onClearTravelRef.current?.();
    };
    map.on("click", onMapClick);

    const onReady = () => {
      suppressBlockedSeaLabels(map);
      map.resize();
      setMapError(null);
      setMapReady(true);
    };
    const onStyleData = () => {
      if (map.isStyleLoaded()) suppressBlockedSeaLabels(map);
    };
    const onError = (ev: { error?: Error }) => {
      const msg = ev?.error?.message || "Không tải được Mapbox";
      setMapError(msg);
      console.error("[ItineraryMap]", msg, ev);
    };
    if (map.isStyleLoaded()) onReady();
    else map.once("load", onReady);
    map.on("styledata", onStyleData);
    map.on("error", onError);

    // Pane can mount at 0 size then expand — keep canvas sized.
    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => map.resize())
        : null;
    if (containerRef.current && ro) ro.observe(containerRef.current);

    return () => {
      ro?.disconnect();
      map.off("click", onMapClick);
      map.off("styledata", onStyleData);
      map.off("error", onError);
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (map.getLayer(ROUTE_ARROW_LAYER)) map.removeLayer(ROUTE_ARROW_LAYER);
      if (map.getLayer(ROUTE_LAYER)) map.removeLayer(ROUTE_LAYER);
      if (map.getSource(ROUTE_SOURCE)) map.removeSource(ROUTE_SOURCE);
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

  // Route polyline + direction arrows (per-leg colors)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady) return;

    if (map.getLayer(ROUTE_ARROW_LAYER)) map.removeLayer(ROUTE_ARROW_LAYER);
    if (map.getLayer(ROUTE_LAYER)) map.removeLayer(ROUTE_LAYER);
    if (map.getSource(ROUTE_SOURCE)) map.removeSource(ROUTE_SOURCE);

    if (!routeGeoJSON || routeGeoJSON.features.length === 0) return;

    ensureRouteArrowImage(map);

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
        "line-color": ["coalesce", ["get", "color"], "#0a6b7c"],
        "line-width": 4,
        "line-opacity": 1,
      },
    });
    map.addLayer({
      id: ROUTE_ARROW_LAYER,
      type: "symbol",
      source: ROUTE_SOURCE,
      layout: {
        "symbol-placement": "line",
        "symbol-spacing": 56,
        "icon-image": ROUTE_ARROW_IMAGE,
        "icon-size": 0.45,
        "icon-allow-overlap": true,
        "icon-ignore-placement": true,
        "icon-rotation-alignment": "map",
        "icon-pitch-alignment": "map",
        "symbol-z-order": "viewport-y",
      },
      paint: {
        "icon-color": ["coalesce", ["get", "color"], "#0a6b7c"],
        "icon-opacity": 1,
      },
    });
  }, [routeGeoJSON, mapReady]);

  // Highlight selected travel leg + fit that segment
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapReady || !map.getLayer(ROUTE_LAYER)) return;

    const hasSelection = Boolean(selectedTravelKey);
    if (!hasSelection) {
      // Click outside / no selection — full color, no dimming
      map.setPaintProperty(ROUTE_LAYER, "line-width", 4);
      map.setPaintProperty(ROUTE_LAYER, "line-opacity", 1);
      if (map.getLayer(ROUTE_ARROW_LAYER)) {
        map.setPaintProperty(ROUTE_ARROW_LAYER, "icon-opacity", 1);
      }
      return;
    }

    map.setPaintProperty(ROUTE_LAYER, "line-width", [
      "case",
      ["==", ["get", "travelKey"], selectedTravelKey ?? ""],
      7,
      2.5,
    ]);
    map.setPaintProperty(ROUTE_LAYER, "line-opacity", [
      "case",
      ["==", ["get", "travelKey"], selectedTravelKey ?? ""],
      1,
      0.22,
    ]);
    if (map.getLayer(ROUTE_ARROW_LAYER)) {
      map.setPaintProperty(ROUTE_ARROW_LAYER, "icon-opacity", [
        "case",
        ["==", ["get", "travelKey"], selectedTravelKey ?? ""],
        1,
        0.15,
      ]);
    }

    if (!routeGeoJSON) return;
    const feature = routeGeoJSON.features.find(
      (f) => f.properties?.travelKey === selectedTravelKey,
    );
    const coords = feature?.geometry?.coordinates;
    if (!coords || coords.length < 2) return;
    const bounds = new mapboxgl.LngLatBounds();
    for (const c of coords) {
      if (
        Array.isArray(c) &&
        Number.isFinite(c[0]) &&
        Number.isFinite(c[1])
      ) {
        bounds.extend([c[0] as number, c[1] as number]);
      }
    }
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, { padding: 80, maxZoom: 15, duration: 550 });
    }
  }, [selectedTravelKey, routeGeoJSON, mapReady]);

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
