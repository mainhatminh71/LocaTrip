import type { Metadata } from "next";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { PolicyView } from "@/components/pages/PolicyView";
import { TERMS } from "@/lib/pages-content";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Điều khoản sử dụng",
  description:
    "Điều khoản và điều kiện khi dùng LocaTrip để lên kế hoạch và lưu chuyến đi.",
  path: "/policies/terms-conditions/",
});

export default function TermsPage() {
  return (
    <MarketingChrome>
      <PolicyView title={TERMS.title} sub={TERMS.sub} sections={TERMS.sections} />
    </MarketingChrome>
  );
}
