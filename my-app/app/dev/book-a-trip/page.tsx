import type { Metadata } from "next";
import { Suspense } from "react";
import { BookATripView } from "@/components/book-a-trip/BookATripView";
import { LtBrandLoader } from "@/components/book-a-trip/LtBrandLoader";

export const metadata: Metadata = {
  title: "Lên kế hoạch Đà Lạt | LocaTrip (dev)",
  description:
    "React book-a-trip preview — same global tokens as production.",
};

export default function BookATripDevPage() {
  return (
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
      <BookATripView />
    </Suspense>
  );
}
