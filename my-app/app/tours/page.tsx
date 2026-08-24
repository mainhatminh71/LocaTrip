import type { Metadata } from "next";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { ToursView } from "@/components/pages/ToursView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Tours",
  description:
    "Mẫu lịch trình Đà Lạt có sẵn — thiên nhiên, lãng mạn, gia đình hoặc mạo hiểm.",
  path: "/tours/",
});

export default function ToursPage() {
  return (
    <MarketingChrome>
      <ToursView />
    </MarketingChrome>
  );
}
