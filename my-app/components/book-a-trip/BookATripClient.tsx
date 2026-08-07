"use client";

import { useCallback, useState } from "react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { BookATripView } from "@/components/book-a-trip/BookATripView";

/** Client shell: hides site chrome while viewing generated itinerary. */
export function BookATripClient() {
  const [immersive, setImmersive] = useState(false);
  const onImmersiveChange = useCallback((next: boolean) => {
    setImmersive(next);
  }, []);

  return (
    <MarketingChrome
      hideChrome={immersive}
      hideConversion
    >
      <BookATripView onImmersiveChange={onImmersiveChange} />
    </MarketingChrome>
  );
}
