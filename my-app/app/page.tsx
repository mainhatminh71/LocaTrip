import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LocaTrip - Productive Travel Planer Website",
  description:
    "Khám phá bản sắc nơi bạn đang đặt chân. Du lịch là để tận hưởng, không phải vội vã.",
};

/** Homepage is rewritten by middleware to the scraped Framer HTML. */
export default function Home() {
  return null;
}
