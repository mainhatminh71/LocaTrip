import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { TourDetailView } from "@/components/pages/TourDetailView";
import { TOUR_CARDS } from "@/lib/pages-content";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TOUR_CARDS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = TOUR_CARDS.find((t) => t.slug === slug);
  return { title: tour ? `${tour.title} | LocaTrip` : "Tour | LocaTrip" };
}

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;
  const tour = TOUR_CARDS.find((t) => t.slug === slug);
  if (!tour) notFound();

  return (
    <MarketingChrome>
      <TourDetailView tour={tour} />
    </MarketingChrome>
  );
}
