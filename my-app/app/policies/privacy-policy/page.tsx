import type { Metadata } from "next";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { PolicyView } from "@/components/pages/PolicyView";
import { PRIVACY } from "@/lib/pages-content";

export const metadata: Metadata = {
  title: "Privacy Policy | LocaTrip",
};

export default function PrivacyPolicyPage() {
  return (
    <MarketingChrome>
      <PolicyView
        title={PRIVACY.title}
        sub={PRIVACY.sub}
        sections={PRIVACY.sections}
      />
    </MarketingChrome>
  );
}
