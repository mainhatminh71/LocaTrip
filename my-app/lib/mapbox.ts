import {
  embeddedMapboxStyle,
  embeddedMapboxToken,
} from "@/lib/mapbox-embedded";

/**
 * Shared Mapbox public config (client-safe pk.* token).
 *
 * Prefer build-embedded values: on Cloudflare/OpenNext, `process.env.NEXT_PUBLIC_*`
 * is often empty in the browser even when set at build time.
 */
export const mapboxToken =
  (typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    : undefined)?.trim() ||
  embeddedMapboxToken ||
  "";

export const mapboxStyle =
  (typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_MAPBOX_STYLE
    : undefined)?.trim() ||
  embeddedMapboxStyle ||
  "mapbox://styles/mapbox/outdoors-v12";

/** Default map center: Đà Lạt */
export const DALAT_CENTER: [number, number] = [108.44, 11.94];
