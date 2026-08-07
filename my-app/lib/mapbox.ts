import type { Map as MapboxMap } from "mapbox-gl";
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

/** Labels we never show on product maps (Mapbox default style copy). */
const BLOCKED_SEA_LABELS = [
  "south china sea",
  "south chinasea",
  "南海",
  "南海诸岛",
  "南海諸島",
];

/**
 * Hide / filter Mapbox water labels that render "South China Sea" (and
 * Chinese equivalents). Safe to call after style load; re-run on styledata.
 */
export function suppressBlockedSeaLabels(map: MapboxMap): void {
  const style = map.getStyle();
  if (!style?.layers) return;

  for (const layer of style.layers) {
    if (layer.type !== "symbol") continue;
    const id = layer.id;
    const idLower = id.toLowerCase();

    // Ocean / major-sea name layers — hide entirely (not needed for Đà Lạt trips).
    if (
      idLower.includes("water-name-ocean") ||
      idLower.includes("water-name-sea") ||
      idLower === "waterway-label-ocean"
    ) {
      try {
        map.setLayoutProperty(id, "visibility", "none");
      } catch {
        /* layer may be non-layout */
      }
      continue;
    }

    if (!/water|ocean|marine|sea/.test(idLower)) continue;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const nameExpr: any = [
        "downcase",
        [
          "to-string",
          [
            "coalesce",
            ["get", "name_en"],
            ["get", "name"],
            ["get", "name_zh-Hans"],
            ["get", "name_zh-Hant"],
            ["get", "name_zh"],
            "",
          ],
        ],
      ];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const notBlocked: any = [
        "all",
        ...BLOCKED_SEA_LABELS.map((label) => [
          "!",
          ["in", label, nameExpr],
        ]),
      ];

      const prev = map.getFilter(id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const next: any = prev ? ["all", prev, notBlocked] : notBlocked;
      map.setFilter(id, next);
    } catch {
      /* ignore layers that reject filters */
    }
  }
}
