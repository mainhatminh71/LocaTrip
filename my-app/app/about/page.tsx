import type { Metadata } from "next";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { AboutView } from "@/components/pages/AboutView";

export const metadata: Metadata = {
  title: "Về chúng tôi | LocaTrip",
  description: "Du lịch là để thư thả, không phải để vội.",
};

export default function AboutPage() {
  return (
    <MarketingChrome>
      <AboutView />
    </MarketingChrome>
  );
}
