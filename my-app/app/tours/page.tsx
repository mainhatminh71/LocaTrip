import type { Metadata } from "next";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { ToursView } from "@/components/pages/ToursView";

export const metadata: Metadata = {
  title: "Tours | LocaTrip",
  description: "Mẫu lịch trình có sẵn — tối ưu cho Đà Lạt.",
};

export default function ToursPage() {
  return (
    <MarketingChrome>
      <ToursView />
    </MarketingChrome>
  );
}
