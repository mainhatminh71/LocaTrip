import {
  embeddedMapboxStyle,
  embeddedMapboxToken,
} from "@/lib/mapbox-embedded";

/**
 * Shared Mapbox public config (client-safe pk.* token).
 *
 * Prefer the embedded public token: on Cloudflare/OpenNext,
 * `process.env.NEXT_PUBLIC_*` is often empty in the browser.
 */
function readPublicEnv(name: string): string {
  if (typeof process === "undefined") return "";
  const v = process.env[name];
  return typeof v === "string" ? v.trim() : "";
}

export const mapboxToken =
  embeddedMapboxToken ||
  readPublicEnv("NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN") ||
  "";

export const mapboxStyle =
  embeddedMapboxStyle ||
  readPublicEnv("NEXT_PUBLIC_MAPBOX_STYLE") ||
  "mapbox://styles/mapbox/outdoors-v12";

/** Default map center: Đà Lạt */
export const DALAT_CENTER: [number, number] = [108.44, 11.94];
