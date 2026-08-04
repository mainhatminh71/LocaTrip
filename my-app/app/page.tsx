import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteShell } from "@/components/layout/SiteShell";
import { HeroSection } from "@/components/sections/HeroSection";
import { MarqueeBanner } from "@/components/sections/MarqueeBanner";
import { AboutSection } from "@/components/sections/AboutSection";
import { ExperiencesSection } from "@/components/sections/ExperiencesSection";
import { DestinationsSection } from "@/components/sections/DestinationsSection";
import { ToursSection } from "@/components/sections/ToursSection";
import { WhyUsSection } from "@/components/sections/WhyUsSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { BlogsSection } from "@/components/sections/BlogsSection";
import { StoriesSection } from "@/components/sections/StoriesSection";

export default function HomePage() {
  return (
    <SiteShell>
      <Header />
      <main>
        <HeroSection />
        <MarqueeBanner />
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
      <Footer />
    </SiteShell>
  );
}
