/** Shared Mapbox public config (client-safe pk.* token). */
export const mapboxToken =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";

export const mapboxStyle =
  process.env.NEXT_PUBLIC_MAPBOX_STYLE ??
  "mapbox://styles/mapbox/outdoors-v12";

/** Default map center: Đà Lạt */
export const DALAT_CENTER: [number, number] = [108.44, 11.94];
