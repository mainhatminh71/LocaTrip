"use client";

import Image from "next/image";
import { useState } from "react";
import { IMG, whyUs } from "@/lib/content";
import { SectionTag } from "@/components/ui/SectionTag";

export function WhyUsSection() {
  const [active, setActive] = useState(0);
  const images = [IMG.why1, IMG.why2, IMG.why3, IMG.why4];

  return (
    <section className="relative overflow-hidden bg-lt-teal-deep text-white">
      <div className="absolute inset-0">
        <Image
          src={IMG.aurora}
          alt=""
          fill
          className="object-cover opacity-30"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-lt-teal-deep/75" />
      </div>

      <div className="section-pad relative mx-auto max-w-[1280px]">
        <div className="mb-10 max-w-2xl">
          <SectionTag tone="light">Lý do chọn LocaTrip</SectionTag>
          <h2 className="font-display mt-4 text-[32px] font-bold leading-[1.2] md:text-4xl">
            Lên kế hoạch với một nút bấm, Du lịch với tâm trí thư thái
          </h2>
        </div>

        <div className="grid items-stretch gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[360px] overflow-hidden rounded-3xl lg:min-h-[520px]">
            <Image
              src={images[active] ?? images[0]}
              alt=""
              fill
              className="object-cover transition-opacity duration-500"
              sizes="(max-width:1024px) 100vw, 55vw"
            />
          </div>

          <div className="flex flex-col justify-center gap-3 rounded-md">
            {whyUs.map((item, index) => {
              const isActive = active === index;
              return (
                <button
                  key={item.title}
                  type="button"
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  className={`rounded-3xl p-5 text-left transition-colors ${
                    isActive ? "bg-white/10" : "bg-transparent hover:bg-white/5"
                  }`}
                >
                  <h3 className="font-cal text-[24px] leading-tight md:text-[28px]">
                    {item.title}
                  </h3>
                  <p
                    className={`mt-2 text-sm text-white/70 transition-all ${
                      isActive ? "max-h-20 opacity-100" : "max-h-0 overflow-hidden opacity-0 md:max-h-20 md:opacity-100"
                    }`}
                  >
                    {item.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
