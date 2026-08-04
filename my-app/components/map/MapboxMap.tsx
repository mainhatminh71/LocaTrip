"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { DALAT_CENTER, mapboxStyle, mapboxToken } from "@/lib/mapbox";

type MapboxMapProps = {
  className?: string;
  center?: [number, number];
  zoom?: number;
};

/** Interactive Mapbox map (Đà Lạt by default). */
export function MapboxMap({
  className,
  center = DALAT_CENTER,
  zoom = 12,
}: MapboxMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

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
      map.remove();
      mapRef.current = null;
    };
  }, [center, zoom]);

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
        Thiếu NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN trong .env.local
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
