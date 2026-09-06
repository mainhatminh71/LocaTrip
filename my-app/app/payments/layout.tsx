import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Thanh toán",
  description: "Lịch sử và tạo thanh toán LocaTrip.",
  path: "/payments/",
  noIndex: true,
});

export default function PaymentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
