import type { Metadata } from "next";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { PolicyView } from "@/components/pages/PolicyView";
import { TERMS } from "@/lib/pages-content";

export const metadata: Metadata = {
  title: "Terms & Conditions | LocaTrip",
};

export default function TermsPage() {
  return (
    <MarketingChrome>
      <PolicyView title={TERMS.title} sub={TERMS.sub} sections={TERMS.sections} />
    </MarketingChrome>
  );
}
