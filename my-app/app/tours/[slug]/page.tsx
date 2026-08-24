import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { TourDetailView } from "@/components/pages/TourDetailView";
import { JsonLd } from "@/components/seo/JsonLd";
import { TOUR_CARDS } from "@/lib/pages-content";
import { buildPageMetadata, tourJsonLd } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return TOUR_CARDS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = TOUR_CARDS.find((t) => t.slug === slug);
  if (!tour) {
    return buildPageMetadata({
      title: "Tour",
      description: "Tour LocaTrip",
      path: "/tours/",
      noIndex: true,
    });
  }
  const description = `${tour.title} — ${tour.days}. Mẫu lịch trình ${tour.filter} tại Đà Lạt.`;
  return buildPageMetadata({
    title: tour.title,
    description,
    path: `/tours/${tour.slug}/`,
    image: tour.image,
  });
}

export default async function TourDetailPage({ params }: Props) {
  const { slug } = await params;
  const tour = TOUR_CARDS.find((t) => t.slug === slug);
  if (!tour) notFound();

  const description = `${tour.title} — ${tour.days}. Mẫu lịch trình ${tour.filter} tại Đà Lạt.`;

  return (
    <MarketingChrome>
      <JsonLd
        data={tourJsonLd({
          title: tour.title,
          description,
          path: `/tours/${tour.slug}/`,
          image: tour.image,
          priceLabel: tour.price,
        })}
      />
      <TourDetailView tour={tour} />
    </MarketingChrome>
  );
}
