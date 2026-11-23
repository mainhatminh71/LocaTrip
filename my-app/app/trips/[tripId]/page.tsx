import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { PublicTripView } from "@/components/trips/PublicTripView";
import { fetchPublicTrip } from "@/lib/trips/fetch-public-trip";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ tripId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tripId: raw } = await params;
  const tripId = decodeURIComponent(raw || "").trim();
  if (!tripId) {
    return buildPageMetadata({
      title: "Chuyến đi",
      description: "Xem chuyến đi trên LocaTrip",
      path: "/trips/",
      noIndex: true,
    });
  }

  const trip = await fetchPublicTrip(tripId);
  if (!trip) {
    return buildPageMetadata({
      title: "Không tìm thấy chuyến đi",
      description: "Chuyến đi này không còn khả dụng trên LocaTrip.",
      path: `/trips/${encodeURIComponent(tripId)}`,
      noIndex: true,
    });
  }

  const title = trip.title.trim() || "Chuyến đi";
  const description =
    trip.summary?.trim() ||
    `Lịch trình ${trip.durationDays || trip.itinerary.length || "?"} ngày trên LocaTrip.`;

  return buildPageMetadata({
    title,
    description,
    path: `/trips/${encodeURIComponent(tripId)}`,
  });
}

export default async function PublicTripPage({ params }: Props) {
  const { tripId: raw } = await params;
  const tripId = decodeURIComponent(raw || "").trim();
  if (!tripId) notFound();

  const trip = await fetchPublicTrip(tripId);
  if (!trip) notFound();

  return (
    <MarketingChrome>
      <PublicTripView trip={trip} />
    </MarketingChrome>
  );
}
