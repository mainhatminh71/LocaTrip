import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Chuyến đi của tôi",
  description: "Danh sách chuyến đi đã lưu trên LocaTrip.",
  path: "/my-trips/",
  noIndex: true,
});

export default function MyTripsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
