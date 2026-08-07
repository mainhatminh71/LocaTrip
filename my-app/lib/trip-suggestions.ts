import type { DiscoverySession, RecommendedPlace } from "@/lib/discovery";
import { isAccommodation } from "@/lib/place-type";

export type SuggestedTrip = {
  id: string;
  title: string;
  subtitle: string;
  vibe: string;
  placeIds: string[];
  places: RecommendedPlace[];
  cover?: string;
  stopCount: number;
  avgRating: number | null;
};

type Theme = {
  id: string;
  title: string;
  subtitle: string;
  vibe: string;
  cover: string;
  match: (p: RecommendedPlace) => number;
};

const THEMES: Theme[] = [
  {
    id: "nature",
    title: "Chuyến thiên nhiên & thư thái",
    subtitle: "Hồ, rừng thông, điểm view — nhịp chậm, thở đã.",
    vibe: "Thiên nhiên",
    cover: "/media/starts/tuyen-lam.jpg",
    match: (p) =>
      scoreHay(
        p,
        /hồ |lake|công viên|vườn|rừng|thác|waterfall|đồi|view|langbiang|tuyền|xuân hương|garden|park|farm|nông trại/,
      ),
  },
  {
    id: "food",
    title: "Chuyến ẩm thực Đà Lạt",
    subtitle: "Quán ngon, cà phê view, điểm dừng bụng no mắt đẹp.",
    vibe: "Ẩm thực",
    cover: "/media/starts/xuan-huong.jpg",
    match: (p) =>
      scoreHay(
        p,
        /nhà hàng|restaurant|cà phê|cafe|coffee|quán |lẩu|nướng|bakery|bánh|food|ẩm thực/,
      ),
  },
  {
    id: "city",
    title: "Chuyến phố núi & check-in",
    subtitle: "Trung tâm, chợ, góc sống ảo — gói gọn một vòng Đà Lạt.",
    vibe: "Phố núi",
    cover: "/media/starts/center.jpg",
    match: (p) =>
      scoreHay(
        p,
        /chợ|market|nhà thờ|ga |bảo tàng|điểm tham quan|attraction|spa|shop|cửa hàng|phố|check.?in/,
      ),
  },
];

function scoreHay(p: RecommendedPlace, re: RegExp): number {
  const hay = `${p.category || ""} ${p.title} ${(p.tags || []).join(" ")}`.toLowerCase();
  if (!re.test(hay)) return 0;
  return 10 + (p.score || 0) + (p.reviewRating || 0) * 2;
}

function uniqueById(places: RecommendedPlace[]): RecommendedPlace[] {
  const seen = new Set<string>();
  const out: RecommendedPlace[] = [];
  for (const p of places) {
    if (seen.has(p.placeId)) continue;
    seen.add(p.placeId);
    out.push(p);
  }
  return out;
}

function avgRating(places: RecommendedPlace[]): number | null {
  const rated = places.filter((p) => p.reviewRating != null);
  if (!rated.length) return null;
  const sum = rated.reduce((a, p) => a + (p.reviewRating || 0), 0);
  return Math.round((sum / rated.length) * 10) / 10;
}

function pickStops(
  pool: RecommendedPlace[],
  need: number,
  fallback: RecommendedPlace[],
): RecommendedPlace[] {
  const chosen = uniqueById(pool).slice(0, need);
  if (chosen.length >= Math.min(3, need)) return chosen.slice(0, need);
  const ids = new Set(chosen.map((p) => p.placeId));
  for (const p of fallback) {
    if (ids.has(p.placeId)) continue;
    chosen.push(p);
    ids.add(p.placeId);
    if (chosen.length >= need) break;
  }
  return chosen.slice(0, need);
}

/**
 * Build multi-stop trip suggestions. Hotels are never package stops —
 * if the trip has no lodging, suggestions stay hotel-free.
 */
export function buildTripSuggestions(
  places: RecommendedPlace[],
  session: DiscoverySession | null,
): SuggestedTrip[] {
  if (!places.length) return [];

  // Activity stops only — lodging is handled separately (night hotel prompt).
  const ranked = [...places]
    .filter((p) => !isAccommodation(p))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  if (!ranked.length) return [];

  const days = Math.max(1, session?.hardConstraints.durationDays ?? 1);
  const stopsPerTrip = Math.min(18, Math.max(4, days * 5));
  const used = new Set<string>();
  const trips: SuggestedTrip[] = [];

  for (const theme of THEMES) {
    const scored = ranked
      .map((p) => ({ p, s: theme.match(p) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.p);

    const fresh = scored.filter((p) => !used.has(p.placeId));
    const pool = fresh.length >= 3 ? fresh : scored;
    const stops = pickStops(pool, stopsPerTrip, ranked);
    if (stops.length < 3) continue;

    for (const s of stops) used.add(s.placeId);

    trips.push({
      id: theme.id,
      title: theme.title,
      subtitle: theme.subtitle,
      vibe: theme.vibe,
      places: stops,
      placeIds: stops.map((p) => p.placeId),
      cover: theme.cover,
      stopCount: stops.length,
      avgRating: avgRating(stops),
    });

    if (trips.length >= 3) break;
  }

  if (trips.length < 2) {
    const leftover = ranked.filter((p) => !used.has(p.placeId));
    const mix = pickStops(
      leftover.length ? leftover : ranked,
      stopsPerTrip,
      ranked,
    );
    if (mix.length >= 3) {
      trips.push({
        id: "mixed",
        title: "Chuyến cân bằng cả ngày",
        subtitle: "Mix điểm nổi bật theo vị trí bắt đầu và gu hiện tại.",
        vibe: "Cân bằng",
        places: mix,
        placeIds: mix.map((p) => p.placeId),
        cover: "/media/starts/langbiang.jpg",
        stopCount: mix.length,
        avgRating: avgRating(mix),
      });
    }
  }

  return trips;
}
