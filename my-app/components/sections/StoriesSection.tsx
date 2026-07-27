"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { IMG } from "@/lib/content";
import { SectionTag } from "@/components/ui/SectionTag";

const stories = [
  { image: IMG.story1, label: "Story" },
  { image: IMG.story2, label: "Story" },
  { image: IMG.story3, label: "Story" },
];

export function StoriesSection() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const started = Date.now();
    const duration = 5000;
    const tick = window.setInterval(() => {
      const p = Math.min(1, (Date.now() - started) / duration);
      setProgress(p);
      if (p >= 1) {
        setActive((v) => (v + 1) % stories.length);
      }
    }, 50);
    return () => window.clearInterval(tick);
  }, [active]);

  return (
    <section className="section-pad bg-lt-black text-white">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 max-w-2xl">
          <SectionTag tone="light">Vibe với LocalTrip</SectionTag>
          <h2 className="font-display mt-4 text-[32px] font-bold leading-[1.2] md:text-4xl">
            Stories của khách hàng sau khi được LocaTrip lên kế hoạch
          </h2>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[320px_1fr]">
          <div className="relative mx-auto aspect-[9/16] w-full max-w-[320px] overflow-hidden rounded-3xl bg-black">
            <div className="absolute inset-x-3 top-3 z-10 flex gap-1">
              {stories.map((_, i) => (
                <div
                  key={i}
                  className="h-0.5 flex-1 overflow-hidden rounded-full bg-white/30"
                >
                  <div
                    className="h-full bg-white transition-[width] duration-75"
                    style={{
                      width:
                        i < active
                          ? "100%"
                          : i === active
                            ? `${progress * 100}%`
                            : "0%",
                    }}
                  />
                </div>
              ))}
            </div>
            <Image
              src={stories[active]!.image}
              alt=""
              fill
              className="object-cover"
              sizes="320px"
            />
            <p className="absolute bottom-4 left-4 font-cal text-sm">Story</p>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {stories.map((story, i) => (
              <button
                key={story.image}
                type="button"
                onClick={() => setActive(i)}
                className={`relative min-w-[180px] overflow-hidden rounded-3xl ${
                  i === active ? "ring-2 ring-white" : "opacity-80"
                }`}
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={story.image}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="180px"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-8 font-cal text-white/70">
          Tag #VibeWithLocalTrip để được đề xuất
        </p>
      </div>
    </section>
  );
}
