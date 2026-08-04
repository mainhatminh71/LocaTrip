import type { Metadata } from "next";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { BlogsView } from "@/components/pages/BlogsView";

export const metadata: Metadata = {
  title: "Blogs | LocaTrip",
  description: "Travel stories & guides.",
};

export default function BlogsPage() {
  return (
    <MarketingChrome>
      <BlogsView />
    </MarketingChrome>
  );
}
