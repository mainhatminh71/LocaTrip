"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DALAT_CENTER, mapboxStyle, mapboxToken } from "@/lib/mapbox";

export type MapMarker = {
  id: string;
  longitude: number;
  latitude: number;
  label?: string;
};

type MapboxMapProps = {
  className?: string;
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  fitMarkers?: boolean;
};

/** Interactive Mapbox map (Đà Lạt by default). Optional numbered markers. */
export function MapboxMap({
  className,
  center = DALAT_CENTER,
  zoom = 12,
  markers = [],
  fitMarkers = false,
}: MapboxMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: mapboxStyle,
      center,
      zoom,
      attributionControl: true,
    });
    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      for (const m of markersRef.current) m.remove();
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- init once; markers synced below
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapboxToken) return;

    for (const m of markersRef.current) m.remove();
    markersRef.current = [];

    markers.forEach((stop, index) => {
      const el = document.createElement("div");
      el.style.cssText = [
        "width:28px",
        "height:28px",
        "border-radius:999px",
        "background:#0a6b7c",
        "color:#fff",
        "font:700 12px/28px Manrope,system-ui,sans-serif",
        "text-align:center",
        "box-shadow:0 2px 8px rgba(0,0,0,.28)",
        "border:2px solid #fff",
        "cursor:default",
      ].join(";");
      el.textContent = String(index + 1);
      if (stop.label) el.title = stop.label;

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([stop.longitude, stop.latitude])
        .addTo(map);
      markersRef.current.push(marker);
    });

    if (fitMarkers && markers.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      for (const s of markers) bounds.extend([s.longitude, s.latitude]);
      map.fitBounds(bounds, { padding: 72, maxZoom: 13, duration: 600 });
    }
  }, [markers, fitMarkers]);

  if (!mapboxToken) {
    return (
      <div
        className={className}
        style={{
          display: "grid",
          placeItems: "center",
          background: "#e8eef2",
          color: "#033d4a",
          fontFamily: "system-ui, sans-serif",
          padding: 24,
          textAlign: "center",
          minHeight: 320,
        }}
      >
        Thiếu cấu hình Mapbox (NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN).
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%", minHeight: 320 }}
    />
  );
}
