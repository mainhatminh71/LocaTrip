"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { SiteConversion } from "@/components/layout/SiteConversion";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteShell } from "@/components/layout/SiteShell";

type MarketingChromeProps = {
  children: ReactNode;
  /** Hide Conversion CTA band (e.g. 404). */
  hideConversion?: boolean;
  /** Hide nav + footer (focus mode while picking places). */
  hideChrome?: boolean;
  /** Hide footer only (e.g. login). */
  hideFooter?: boolean;
  /** SiteConversion primary CTA href (book-a-trip uses #top). */
  conversionCtaHref?: string;
};

/** Shared site chrome: one SiteNav + optional Conversion + SiteFooter. */
export function MarketingChrome({
  children,
  hideConversion = false,
  hideChrome = false,
  hideFooter = false,
  conversionCtaHref = "/book-a-trip/",
}: MarketingChromeProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <SiteShell>
      {hideChrome ? null : (
        <SiteNav open={menuOpen} onOpenChange={setMenuOpen} />
      )}
      {children}
      {hideConversion || hideChrome ? null : (
        <SiteConversion ctaHref={conversionCtaHref} />
      )}
      {hideChrome || hideFooter ? null : <SiteFooter />}
    </SiteShell>
  );
}
