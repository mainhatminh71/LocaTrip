import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { PublicPlaceView } from "@/components/places/PublicPlaceView";
import { fetchPublicPlace } from "@/lib/places/fetch-public-place";
import { buildPageMetadata, DEFAULT_OG_IMAGE } from "@/lib/seo";
import { proxiedMediaUrl } from "@/lib/media-url";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ placeId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { placeId: raw } = await params;
  const placeId = decodeURIComponent(raw || "").trim();
  if (!placeId) {
    return buildPageMetadata({
      title: "Địa điểm",
      description: "Xem địa điểm trên LocaTrip",
      path: "/places/",
      noIndex: true,
    });
  }

  const place = await fetchPublicPlace(placeId);
  if (!place) {
    return buildPageMetadata({
      title: "Không tìm thấy địa điểm",
      description: "Địa điểm này không còn khả dụng trên LocaTrip.",
      path: `/places/${encodeURIComponent(placeId)}`,
      noIndex: true,
    });
  }

  const title = place.title?.trim() || "Địa điểm";
  const description = [
    place.address?.trim(),
    place.category?.trim(),
    "Xem trên LocaTrip — lên lịch trình Đà Lạt thông minh.",
  ]
    .filter(Boolean)
    .join(" · ");

  const image =
    proxiedMediaUrl(place.thumbnail) || place.thumbnail || DEFAULT_OG_IMAGE;

  return buildPageMetadata({
    title,
    description,
    path: `/places/${encodeURIComponent(placeId)}`,
    image,
  });
}

export default async function PublicPlacePage({ params }: Props) {
  const { placeId: raw } = await params;
  const placeId = decodeURIComponent(raw || "").trim();
  if (!placeId) notFound();

  const place = await fetchPublicPlace(placeId);
  if (!place) notFound();

  return (
    <MarketingChrome>
      <PublicPlaceView place={place} placeId={placeId} />
    </MarketingChrome>
  );
}
