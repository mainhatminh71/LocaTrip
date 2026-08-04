import Link from "next/link";
import { PlanMapSlot } from "@/components/map";

export const metadata = {
  title: "Generated Plan | LocaTrip",
};

/**
 * Plan result view: chrome + map slot (Mapbox replaces the old image placeholder).
 */
export default function GeneratedPlanPage() {
  return (
    <div className="relative min-h-screen bg-[#f4f1ea]">
      <header className="pointer-events-none absolute inset-x-0 top-4 z-20 flex justify-center px-4">
        <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-lt-teal-deep/90 px-5 py-2.5 text-white shadow-lg backdrop-blur-md">
          <Link
            href="/"
            className="font-display text-sm font-bold tracking-[0.12em]"
          >
            LOCATRIP
          </Link>
          <Link
            href="/book-a-trip"
            className="rounded-full bg-white/15 px-3 py-1 text-xs text-white/90 hover:bg-white/25"
          >
            Tạo lịch trình
          </Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-screen max-w-[1280px] flex-col gap-4 px-4 pb-8 pt-20 md:px-8">
        <div className="min-h-0 flex-1">
          <PlanMapSlot className="h-[min(70vh,720px)] w-full" />
        </div>
        <p className="text-center text-sm text-lt-ink/60">
          Bản đồ Đà Lạt (Mapbox) — khung lịch trình sẽ mở rộng tại đây.
        </p>
      </main>
    </div>
  );
}
