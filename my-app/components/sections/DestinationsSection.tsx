"use client";

import Image from "next/image";
import { destinations, IMG } from "@/lib/content";
import { SectionTag } from "@/components/ui/SectionTag";

export function DestinationsSection() {
  return (
    <section className="section-pad bg-lt-black text-white">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 max-w-2xl">
          <SectionTag tone="light">Địa điểm được yêu thích nhất</SectionTag>
          <h2 className="font-display mt-4 text-[32px] font-bold leading-[1.2] md:text-4xl">
            Khám phá những địa điểm được nhiều người lựa chọn
          </h2>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {destinations.map((dest) => (
            <article
              key={dest.title}
              className="group relative min-w-[280px] flex-1 overflow-hidden rounded-3xl bg-[#111] sm:min-w-[320px] lg:min-w-0"
            >
              <div className="relative aspect-[460/347]">
                <Image
                  src={dest.image}
                  alt={dest.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="320px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5">
                <div className="mb-3 flex -space-x-2">
                  {[IMG.dest1, IMG.dest2, IMG.dest3].map((src) => (
                    <Image
                      key={src}
                      src={src}
                      alt=""
                      width={36}
                      height={36}
                      className="size-9 rounded-full border-2 border-black object-cover"
                    />
                  ))}
                </div>
                <h3 className="font-display text-2xl font-bold">{dest.title}</h3>
                <p className="mt-1 text-sm text-white/70">{dest.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
