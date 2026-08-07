import type { Metadata } from "next";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { GeneratedPlanView } from "@/components/generated-plan/GeneratedPlanView";

export const metadata: Metadata = {
  title: "Lịch trình | LocaTrip",
  description: "Xem lịch trình đã tạo bởi LocaTrip.",
};

export default function GeneratedPlanPage() {
  return (
    <MarketingChrome>
      <GeneratedPlanView />
    </MarketingChrome>
  );
}
