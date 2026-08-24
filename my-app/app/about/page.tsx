import type { Metadata } from "next";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { AboutView } from "@/components/pages/AboutView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Về chúng tôi",
  description:
    "LocaTrip giúp bạn lên lịch trình Đà Lạt theo nhịp độ riêng — thư thả, rõ ràng, không vội.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <MarketingChrome>
      <AboutView />
    </MarketingChrome>
  );
}
