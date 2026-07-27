"use client";

import Image from "next/image";
import { useState } from "react";
import { IMG } from "@/lib/content";
import { SectionTag } from "@/components/ui/SectionTag";

const reviews = [
  {
    quote:
      "Traveling with this team completely changed how I see group travel. Everything was thoughtfully planned",
    author: "Emily Carter, Solo Traveler",
    image: IMG.testimonial,
    avatar: IMG.avatar1,
  },
  {
    quote:
      "LocaTrip giúp mình tiết kiệm cả tuần nghiên cứu. Lịch trình Đà Lạt rất mượt và đúng gu.",
    author: "Minh Anh, Weekend Explorer",
    image: IMG.nature,
    avatar: IMG.avatar2,
  },
  {
    quote:
      "Từ ngân sách đến điểm check-in đều được cá nhân hóa. Trải nghiệm cực kỳ thư thái.",
    author: "Hoàng Nam, Photographer",
    image: IMG.fog,
    avatar: IMG.avatar3,
  },
];

export function TestimonialsSection() {
  const [index, setIndex] = useState(0);
  const current = reviews[index]!;

  return (
    <section className="section-pad bg-white">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 max-w-2xl">
          <SectionTag>Cảm nhận</SectionTag>
          <h2 className="font-display mt-4 text-[32px] font-bold leading-[1.2] text-lt-teal-deep md:text-4xl">
            Đánh giá từ du khách trải nghiệm locaTrip
          </h2>
        </div>

        <div className="overflow-hidden rounded-3xl bg-lt-soft">
          <div className="grid lg:grid-cols-2">
            <div className="relative min-h-[320px] lg:min-h-[520px]">
              <Image
                src={current.image}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
            <div className="flex flex-col justify-between gap-8 p-8 md:p-10">
              <div>
                <p className="mb-4 text-amber-500">★★★★★</p>
                <blockquote className="font-display text-2xl font-semibold leading-snug text-lt-ink md:text-3xl">
                  {current.quote}
                </blockquote>
                <p className="mt-6 text-lt-muted">— {current.author}</p>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex gap-2">
                  {reviews.map((r, i) => (
                    <button
                      key={r.author}
                      type="button"
                      onClick={() => setIndex(i)}
                      className={`overflow-hidden rounded-full border-2 transition ${
                        i === index
                          ? "border-lt-teal"
                          : "border-transparent opacity-70"
                      }`}
                    >
                      <Image
                        src={r.avatar}
                        alt=""
                        width={44}
                        height={44}
                        className="size-11 object-cover"
                      />
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Previous"
                    className="flex size-10 items-center justify-center rounded-full border border-black/10 bg-white"
                    onClick={() =>
                      setIndex((v) => (v - 1 + reviews.length) % reviews.length)
                    }
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    aria-label="Next"
                    className="flex size-10 items-center justify-center rounded-full border border-black/10 bg-white"
                    onClick={() => setIndex((v) => (v + 1) % reviews.length)}
                  >
                    →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
