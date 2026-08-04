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
};

/** Shared React chrome: SiteNav + page body + Conversion + SiteFooter. */
export function MarketingChrome({
  children,
  hideConversion = false,
}: MarketingChromeProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <SiteShell>
      <SiteNav open={menuOpen} onOpenChange={setMenuOpen} />
      {children}
      {hideConversion ? null : <SiteConversion />}
      <SiteFooter />
    </SiteShell>
  );
}
