import type { Metadata } from "next";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { PolicyView } from "@/components/pages/PolicyView";
import { PRIVACY } from "@/lib/pages-content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Chính sách bảo mật",
  description:
    "Cách LocaTrip thu thập, dùng và bảo vệ thông tin khi bạn lên kế hoạch chuyến đi.",
  path: "/policies/privacy-policy/",
});

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
