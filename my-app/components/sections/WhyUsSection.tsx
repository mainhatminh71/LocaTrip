"use client";

import Image from "next/image";
import { useState } from "react";
import { IMG, whyUs } from "@/lib/content";
import { SectionTag } from "@/components/ui/SectionTag";

/** Ported from Framer “Lý do chọn LocaTrip”. */
export function WhyUsSection() {
  const [active, setActive] = useState(0);
  const images = [IMG.why1, IMG.why2, IMG.why3, IMG.why4];

  return (
    <section
      className="relative w-full overflow-hidden bg-[#033d4a] px-5 py-[100px] text-white md:px-10"
      data-framer-name="Why Us"
    >
      <div className="pointer-events-none absolute inset-0 opacity-35">
        <Image
          src={IMG.whyBg}
          alt=""
          fill
          className="object-cover"
          sizes="100vw"
        />
      </div>
      <div className="relative z-[1] mx-auto grid w-full max-w-[1200px] items-center gap-9 lg:grid-cols-2 lg:gap-16">
        <div className="relative min-h-[360px] overflow-hidden rounded-[24px] lg:min-h-[480px]">
          <Image
            src={images[active] ?? images[0]}
            alt=""
            fill
            className="object-cover transition-opacity duration-500"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
        </div>

        <div>
          <SectionTag tone="light">Lý do chọn LocaTrip</SectionTag>
          <h2 className="mt-4 font-['Manrope','Manrope_Placeholder',sans-serif] text-[32px] font-bold leading-[1.2] tracking-[-0.01em] capitalize">
            Lên kế hoạch với một nút bấm, Du lịch với tâm trí thư thái
          </h2>
          <ul className="mt-8 space-y-5">
            {whyUs.map((item, index) => {
              const on = active === index;
              return (
                <li key={item.title}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onClick={() => setActive(index)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                      on
                        ? "border-white/20 bg-white/10"
                        : "border-transparent hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#3DDC97] text-[12px] font-bold text-[#0b0b0b]">
                        ✓
                      </span>
                      <div>
                        <h3 className="font-body text-[18px] md:text-[20px]">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-[14px] leading-relaxed text-white/65">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
