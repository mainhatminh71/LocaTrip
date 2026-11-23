import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Chuyến được chia sẻ",
  description:
    "Khám phá lịch trình Đà Lạt do cộng đồng LocaTrip chia sẻ — đánh giá và tái sử dụng.",
  path: "/shared-trips/",
  noIndex: true,
});

export default function SharedTripsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
