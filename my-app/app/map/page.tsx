import type { Metadata } from "next";
import { Suspense } from "react";
import { SampleTourMapView } from "@/components/map/SampleTourMapView";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Bản đồ mẫu",
  description: "Xem lịch trình mẫu trên bản đồ Đà Lạt với LocaTrip.",
  path: "/map/",
});

export default function MapPage() {
  return (
    <main className="h-screen w-full">
      <Suspense
        fallback={
          <div
            style={{
              minHeight: "100dvh",
              display: "grid",
              placeItems: "center",
              background: "#eef3f1",
              color: "#012830",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            Đang tải bản đồ…
          </div>
        }
      >
        <SampleTourMapView />
      </Suspense>
    </main>
  );
}
