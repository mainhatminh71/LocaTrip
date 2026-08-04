import { SiteConversion } from "@/components/layout/SiteConversion";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteShell } from "@/components/layout/SiteShell";
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

/**
 * Homepage — Framer section order: Hero → … → Stories → Conversion → Footer.
 * Nav lives inside hero capsule (SiteNav).
 */
export default function HomePage() {
  return (
    <SiteShell>
      <main className="w-full overflow-x-clip bg-white">
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
        <SiteConversion />
      </main>
      <SiteFooter />
    </SiteShell>
  );
}
