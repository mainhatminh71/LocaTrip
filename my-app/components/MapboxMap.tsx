"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";
const STYLE =
  process.env.NEXT_PUBLIC_MAPBOX_STYLE ??
  "mapbox://styles/mapbox/outdoors-v12";

type MapboxMapProps = {
  className?: string;
  center?: [number, number];
  zoom?: number;
};

/** Interactive Mapbox map (Đà Lạt by default). */
export default function MapboxMap({
  className,
  center = [108.44, 11.94],
  zoom = 12,
}: MapboxMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    if (!TOKEN) return;

    mapboxgl.accessToken = TOKEN;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: STYLE,
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

  if (!TOKEN) {
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
