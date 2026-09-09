/** Distinct colors per travel leg (1→2, 2→3, …). Cycles if more legs than palette. */
export const ROUTE_LEG_COLORS = [
  "#e11d48", // red
  "#2563eb", // blue
  "#ca8a04", // yellow/gold
  "#059669", // green
  "#7c3aed", // violet
  "#ea580c", // orange
  "#0891b2", // cyan
  "#db2777", // pink
  "#4f46e5", // indigo
  "#65a30d", // lime
] as const;

export function routeLegColor(legIndex: number): string {
  const i =
    ((legIndex % ROUTE_LEG_COLORS.length) + ROUTE_LEG_COLORS.length) %
    ROUTE_LEG_COLORS.length;
  return ROUTE_LEG_COLORS[i]!;
}
