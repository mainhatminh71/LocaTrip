"use client";

import { Suspense, useCallback, useEffect } from "react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { useImmersiveUi } from "@/components/layout/ImmersiveUiContext";
import { BookATripView } from "@/components/book-a-trip/BookATripView";
import { LtBrandLoader } from "@/components/book-a-trip/LtBrandLoader";

/** Client shell: hides site chrome while viewing generated itinerary. */
export function BookATripClient() {
  const { immersive, setImmersive } = useImmersiveUi();
  const onImmersiveChange = useCallback(
    (next: boolean) => {
      setImmersive(next);
    },
    [setImmersive],
  );

  useEffect(() => {
    return () => setImmersive(false);
  }, [setImmersive]);

  return (
    <MarketingChrome hideChrome={immersive} hideConversion>
      <Suspense
        fallback={
          <div
            style={{
              display: "grid",
              placeItems: "center",
              minHeight: "40vh",
              padding: "2rem",
            }}
          >
            <LtBrandLoader size="lg" tone="onLight" label="Đang tải…" />
          </div>
        }
      >
        <BookATripView onImmersiveChange={onImmersiveChange} />
      </Suspense>
    </MarketingChrome>
  );
}
