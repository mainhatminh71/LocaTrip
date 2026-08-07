"use client";

import Image from "next/image";
import { LT_IMAGE_QUALITY } from "@/lib/image-quality";
import { useState } from "react";
import { IMG } from "@/lib/content";
import { SectionTag } from "@/components/ui/SectionTag";

const SLIDES = [
  {
    quote:
      "“Lên kế hoạch với một nút bấm — chuyến đi Đà Lạt của mình mượt mà hơn rất nhiều.”",
    name: "Emily Carter",
    role: "Solo Traveler",
    avatar: IMG.avatar1,
    image: IMG.tour4,
  },
  {
    quote:
      "“Lịch trình khớp sở thích, không phải ngồi nghiên cứu cả đêm trước khi đi.”",
    name: "Minh Anh",
    role: "Couple Traveler",
    avatar: IMG.avatar2,
    image: IMG.tour1,
  },
  {
    quote:
      "“Từ điểm bắt đầu đến quán ăn đều hợp lý — đúng vibe thư thái mình muốn.”",
    name: "Hoàng Nam",
    role: "Family Trip",
    avatar: IMG.avatar3,
    image: IMG.testimonial,
  },
] as const;

/** Framer Testimonials — Desktop Preview 1/2/3 carousel. */
export function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const slide = SLIDES[index] ?? SLIDES[0];

  return (
    <section
      className="w-full bg-white px-5 py-[100px] md:px-10"
      data-framer-name="Testimonials"
    >
      <div className="mx-auto mb-10 max-w-[1200px]">
        <SectionTag>Cảm nhận</SectionTag>
        <h2 className="mt-4 max-w-[20ch] font-['Manrope','Manrope_Placeholder',sans-serif] text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-[var(--lt-deep)] capitalize">
          Đánh giá từ du khách trải nghiệm locaTrip
        </h2>
      </div>

      <div className="relative mx-auto min-h-[420px] w-full max-w-[1200px] overflow-hidden rounded-[28px] md:min-h-[480px]">
        <Image
          key={slide.image}
          src={slide.image}
          alt=""
          fill
          className="object-cover transition-opacity duration-500"
          sizes="1200px"
                    quality={LT_IMAGE_QUALITY}
                  />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        <div className="relative z-[1] flex h-full min-h-[420px] flex-col justify-end p-8 text-white md:min-h-[480px] md:p-12">
          <p className="text-[18px] tracking-wide">★★★★★</p>
          <p className="mt-4 max-w-[36ch] font-['Inter',system-ui,sans-serif] text-[18px] font-medium leading-relaxed text-white/90 md:text-[20px]">
            {slide.quote}
          </p>
          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Image
                src={slide.avatar}
                alt=""
                width={48}
                height={48}
                className="size-12 rounded-full border-2 border-white object-cover"
                    quality={LT_IMAGE_QUALITY}
                  />
              <div>
                <p className="font-['Inter',system-ui,sans-serif] text-[16px] font-semibold">
                  {slide.name}
                </p>
                <p className="text-sm text-white/70">{slide.role}</p>
              </div>
            </div>
            <div className="flex gap-2" data-framer-name="Mobile Arrows">
              <button
                type="button"
                aria-label="Previous"
                className="flex size-11 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm"
                onClick={() =>
                  setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)
                }
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next"
                className="flex size-11 items-center justify-center rounded-full border border-white/40 bg-white/10 backdrop-blur-sm"
                onClick={() => setIndex((i) => (i + 1) % SLIDES.length)}
              >
                →
              </button>
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Preview ${i + 1}`}
                data-framer-name={`Preview`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-white" : "w-3 bg-white/40"
                }`}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
