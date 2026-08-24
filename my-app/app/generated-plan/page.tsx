import type { Metadata } from "next";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { GeneratedPlanView } from "@/components/generated-plan/GeneratedPlanView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Lịch trình",
  description: "Xem lịch trình đã tạo bởi LocaTrip.",
  path: "/generated-plan/",
  noIndex: true,
});

export default function GeneratedPlanPage() {
  return (
    <MarketingChrome>
      <GeneratedPlanView />
    </MarketingChrome>
  );
}
