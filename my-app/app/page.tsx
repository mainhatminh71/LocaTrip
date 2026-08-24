import type { Metadata } from "next";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ExperiencesSection } from "@/components/sections/ExperiencesSection";
import { DestinationsSection } from "@/components/sections/DestinationsSection";
import { ToursSection } from "@/components/sections/ToursSection";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { BlogsSection } from "@/components/sections/BlogsSection";
import { StoriesSection } from "@/components/sections/StoriesSection";
import { buildPageMetadata, SITE_DEFAULT_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: `${SITE_NAME} — Lên kế hoạch chuyến đi Đà Lạt`,
  description: SITE_DEFAULT_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

/**
 * Homepage — Framer section order. Chrome = shared MarketingChrome (SiteNav…).
 */
export default function HomePage() {
  return (
    <MarketingChrome>
      <main className="w-full overflow-x-clip bg-[var(--lt-white)]">
        <HeroSection />
        <AboutSection />
        <ExperiencesSection />
        <DestinationsSection />
        <ToursSection />
        <WhyUsSection />
        <TestimonialsSection />
        <PricingSection />
        <BlogsSection />
        <StoriesSection />
      </main>
    </MarketingChrome>
  );
}
