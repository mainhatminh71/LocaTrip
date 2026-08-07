/**
 * Hardcoded sample itineraries for /tours → /map.
 * No LocalTrip API — demo schedule + map route only.
 */

import type { RouteFeatureCollection } from "@/lib/itinerary-map";

export type SampleStop = {
  title: string;
  latitude: number;
  longitude: number;
  /** Category chip, e.g. Cà phê / Tham quan */
  kind: string;
  address?: string;
  rating?: number;
  /** Visit window "HH:MM – HH:MM" */
  time: string;
  /** Travel minutes from previous stop (0 for first). */
  travelMin: number;
  note?: string;
};

export type SampleTour = {
  slug: string;
  title: string;
  days: string;
  price: string;
  filter: string;
  image: string;
  summary: string;
  stops: SampleStop[];
};

function stop(
  partial: Omit<SampleStop, "kind" | "time" | "travelMin"> &
    Partial<Pick<SampleStop, "kind" | "time" | "travelMin">>,
): SampleStop {
  return {
    kind: "Tham quan",
    time: "09:00 – 10:00",
    travelMin: 0,
    ...partial,
  };
}

const SAMPLES: SampleTour[] = [
  {
    slug: "morocco-cultural-desert-journey",
    title: "Thung lũng Tình Yêu",
    days: "3 ngày / 2 đêm",
    price: "đ3,600K",
    filter: "Lãng mạn",
    image: "/media/travelers.jpg",
    summary: "Vòng lãng mạn quanh thung lũng, hồ và góc check-in cổ điển.",
    stops: [
      stop({
        title: "Thung Lũng Tình Yêu",
        latitude: 11.9735,
        longitude: 108.4428,
        kind: "Tham quan",
        address: "Phường 7, Đà Lạt, Lâm Đồng",
        rating: 4.5,
        time: "08:30 – 10:00",
        travelMin: 0,
        note: "Điểm bắt đầu",
      }),
      stop({
        title: "Hồ Xuân Hương",
        latitude: 11.9415,
        longitude: 108.438,
        kind: "Công viên",
        address: "Trung tâm Đà Lạt",
        rating: 4.6,
        time: "10:20 – 11:30",
        travelMin: 18,
      }),
      stop({
        title: "Nhà thờ Con Gà",
        latitude: 11.9456,
        longitude: 108.4392,
        kind: "Tham quan",
        address: "Trần Phú, Đà Lạt",
        rating: 4.7,
        time: "11:40 – 12:20",
        travelMin: 8,
      }),
      stop({
        title: "Quảng trường Lâm Viên",
        latitude: 11.9408,
        longitude: 108.4425,
        kind: "Check-in",
        address: "Đà Lạt, Lâm Đồng",
        rating: 4.6,
        time: "12:30 – 13:30",
        travelMin: 7,
      }),
    ],
  },
  {
    slug: "italy-classic-discovery",
    title: "Khám phá Langbiang",
    days: "7 Days / 6 Nights",
    price: "đ1,400K",
    filter: "Thiên nhiên",
    image: "/media/mountain-mist.jpg",
    summary: "Lên đỉnh Langbiang, rừng thông và view cao nguyên.",
    stops: [
      stop({
        title: "Langbiang",
        latitude: 12.0472,
        longitude: 108.4408,
        kind: "Đỉnh núi",
        address: "Lạc Dương, Lâm Đồng",
        rating: 4.6,
        time: "07:30 – 10:00",
        travelMin: 0,
        note: "Đỉnh núi",
      }),
      stop({
        title: "Đỉnh Đồi Thiên Phúc Đức",
        latitude: 11.968,
        longitude: 108.425,
        kind: "View",
        address: "Đà Lạt, Lâm Đồng",
        rating: 4.5,
        time: "10:45 – 12:00",
        travelMin: 35,
      }),
      stop({
        title: "Hồ Tuyền Lâm",
        latitude: 11.889,
        longitude: 108.432,
        kind: "Hồ",
        address: "Phường 3, Đà Lạt",
        rating: 4.7,
        time: "12:40 – 14:30",
        travelMin: 28,
      }),
      stop({
        title: "Đồi chè Cầu Đất",
        latitude: 11.862,
        longitude: 108.521,
        kind: "Thiên nhiên",
        address: "Cầu Đất, Đà Lạt",
        rating: 4.4,
        time: "15:10 – 17:00",
        travelMin: 32,
      }),
    ],
  },
  {
    slug: "paris-classics",
    title: "Săn Mây Đồi Thiên Phúc Đức",
    days: "6 Days / 5 Nights",
    price: "đ1,500K",
    filter: "Thiên nhiên",
    image: "/media/sunset-hills.jpg",
    summary: "Săn mây sớm, đồi thông và hoàng hôn Đà Lạt.",
    stops: [
      stop({
        title: "Đồi Thiên Phúc Đức",
        latitude: 11.968,
        longitude: 108.425,
        kind: "Săn mây",
        time: "05:00 – 07:00",
        travelMin: 0,
        note: "Săn mây",
      }),
      stop({
        title: "Đồi Đa Phú",
        latitude: 11.955,
        longitude: 108.418,
        kind: "View",
        time: "07:30 – 09:00",
        travelMin: 15,
      }),
      stop({
        title: "Hồ Xuân Hương",
        latitude: 11.9415,
        longitude: 108.438,
        kind: "Công viên",
        time: "09:30 – 11:00",
        travelMin: 18,
      }),
      stop({
        title: "Ga Đà Lạt",
        latitude: 11.925,
        longitude: 108.451,
        kind: "Tham quan",
        time: "11:20 – 12:30",
        travelMin: 12,
      }),
    ],
  },
  {
    slug: "paris-cultural-getaway",
    title: "Thác Voi – Chùa Linh Ẩn",
    days: "5 Days / 4 Nights",
    price: "đ4,100K",
    filter: "Thiên nhiên",
    image: "/media/waterfall.jpg",
    summary: "Thác nước, chùa và không gian xanh ngoại ô.",
    stops: [
      stop({
        title: "Thác Voi",
        latitude: 11.897,
        longitude: 108.395,
        kind: "Thác",
        time: "08:00 – 09:30",
        travelMin: 0,
      }),
      stop({
        title: "Chùa Linh Ẩn",
        latitude: 11.912,
        longitude: 108.402,
        kind: "Chùa",
        time: "10:00 – 11:15",
        travelMin: 14,
      }),
      stop({
        title: "Thiền Viện Trúc Lâm",
        latitude: 11.899,
        longitude: 108.436,
        kind: "Tham quan",
        time: "11:50 – 13:00",
        travelMin: 20,
      }),
      stop({
        title: "Hồ Tuyền Lâm",
        latitude: 11.889,
        longitude: 108.432,
        kind: "Hồ",
        time: "13:20 – 15:00",
        travelMin: 10,
      }),
    ],
  },
  {
    slug: "africa-safari-experience",
    title: "Đà Lạt Xanh",
    days: "8 Days / 7 Nights",
    price: "đ2,200K",
    filter: "Thiên nhiên",
    image: "/media/forest-path.jpg",
    summary: "Rừng thông, đồi chè và nhịp chậm xanh mát.",
    stops: [
      stop({
        title: "Đồi chè Cầu Đất",
        latitude: 11.862,
        longitude: 108.521,
        kind: "Thiên nhiên",
        time: "08:00 – 10:00",
        travelMin: 0,
      }),
      stop({
        title: "Hồ Tuyền Lâm",
        latitude: 11.889,
        longitude: 108.432,
        kind: "Hồ",
        time: "10:40 – 12:30",
        travelMin: 30,
      }),
      stop({
        title: "Vườn hoa thành phố",
        latitude: 11.9428,
        longitude: 108.4412,
        kind: "Vườn hoa",
        time: "13:10 – 14:30",
        travelMin: 25,
      }),
      stop({
        title: "Công viên Yersin",
        latitude: 11.9465,
        longitude: 108.4378,
        kind: "Công viên",
        time: "14:50 – 16:00",
        travelMin: 8,
      }),
    ],
  },
  {
    slug: "new-york-highlights-copy",
    title: "Đà Lạt Mạo Hiểm",
    days: "6 Days / 5 Nights",
    price: "đ1,300K",
    filter: "Mạo hiểm",
    image: "/media/dalat-hills.jpg",
    summary: "Đèo, đỉnh cao và cung đường phượt nhẹ quanh phố núi.",
    stops: [
      stop({
        title: "Đèo Prenn",
        latitude: 11.908,
        longitude: 108.448,
        kind: "Đèo",
        time: "07:00 – 08:30",
        travelMin: 0,
      }),
      stop({
        title: "Langbiang",
        latitude: 12.0472,
        longitude: 108.4408,
        kind: "Đỉnh núi",
        time: "09:30 – 12:00",
        travelMin: 45,
      }),
      stop({
        title: "Đồi Đa Phú",
        latitude: 11.955,
        longitude: 108.418,
        kind: "View",
        time: "12:50 – 14:00",
        travelMin: 35,
      }),
      stop({
        title: "Hồ Tuyền Lâm",
        latitude: 11.889,
        longitude: 108.432,
        kind: "Hồ",
        time: "14:40 – 16:30",
        travelMin: 25,
      }),
    ],
  },
  {
    slug: "spain-cultural-trail",
    title: "Đà Lạt Gia Đình",
    days: "6 Days / 5 Nights",
    price: "đ1,200K",
    filter: "Lãng mạn",
    image: "/media/group-travel.jpg",
    summary: "Lịch nhẹ nhàng cho gia đình — hồ, vườn hoa, trung tâm.",
    stops: [
      stop({
        title: "Hồ Xuân Hương",
        latitude: 11.9415,
        longitude: 108.438,
        kind: "Công viên",
        time: "08:30 – 10:00",
        travelMin: 0,
      }),
      stop({
        title: "Vườn hoa thành phố",
        latitude: 11.9428,
        longitude: 108.4412,
        kind: "Vườn hoa",
        time: "10:15 – 11:30",
        travelMin: 8,
      }),
      stop({
        title: "Chợ Đà Lạt",
        latitude: 11.9406,
        longitude: 108.437,
        kind: "Chợ",
        time: "11:45 – 13:15",
        travelMin: 6,
      }),
      stop({
        title: "Quảng trường Lâm Viên",
        latitude: 11.9408,
        longitude: 108.4425,
        kind: "Check-in",
        time: "13:30 – 14:30",
        travelMin: 7,
      }),
    ],
  },
  {
    slug: "bali-cultural-retreat",
    title: "Đà Lạt Hot Trend",
    days: "6 Days / 5 Nights",
    price: "đ2,950K",
    filter: "Mạo hiểm",
    image: "/media/vietnam-street.jpg",
    summary: "Các điểm đang hot — check-in nhanh quanh thành phố.",
    stops: [
      stop({
        title: "Quảng trường Lâm Viên",
        latitude: 11.9408,
        longitude: 108.4425,
        kind: "Check-in",
        time: "09:00 – 10:00",
        travelMin: 0,
      }),
      stop({
        title: "Nhà thờ Con Gà",
        latitude: 11.9456,
        longitude: 108.4392,
        kind: "Tham quan",
        time: "10:15 – 11:00",
        travelMin: 8,
      }),
      stop({
        title: "Ga Đà Lạt",
        latitude: 11.925,
        longitude: 108.451,
        kind: "Tham quan",
        time: "11:20 – 12:30",
        travelMin: 12,
      }),
      stop({
        title: "Thung Lũng Tình Yêu",
        latitude: 11.9735,
        longitude: 108.4428,
        kind: "Tham quan",
        time: "13:10 – 15:00",
        travelMin: 22,
      }),
    ],
  },
];

export function getSampleTour(slug: string): SampleTour | null {
  return SAMPLES.find((t) => t.slug === slug) ?? null;
}

export function listSampleTours(): SampleTour[] {
  return SAMPLES;
}

/** Straight-segment route between hardcoded stops (no Directions API). */
export function buildSampleRouteGeoJSON(
  stops: SampleStop[],
): RouteFeatureCollection | null {
  if (stops.length < 2) return null;
  const coordinates: [number, number][] = stops.map((s) => [
    s.longitude,
    s.latitude,
  ]);
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { sample: true },
        geometry: { type: "LineString", coordinates },
      },
    ],
  };
}
