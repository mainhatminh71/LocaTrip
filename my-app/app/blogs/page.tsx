import type { Metadata } from "next";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { BlogsView } from "@/components/pages/BlogsView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Blogs",
  description:
    "Câu chuyện, mẹo và cảm hứng du lịch Đà Lạt từ LocaTrip — đọc trước khi lên đường.",
  path: "/blogs/",
});

export default function BlogsPage() {
  return (
    <MarketingChrome>
      <BlogsView />
    </MarketingChrome>
  );
}
