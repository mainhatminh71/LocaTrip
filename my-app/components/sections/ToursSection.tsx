"use client";

import Image from "next/image";
import Link from "next/link";
import { tours } from "@/lib/content";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTag } from "@/components/ui/SectionTag";

/** Ported from Framer “Lịch trình thiết kế sẵn”. */
export function ToursSection() {
  return (
    <section className="w-full bg-white px-4 py-16 md:px-10 md:py-24">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-10 max-w-2xl">
          <SectionTag>Lịch trình thiết kế sẵn</SectionTag>
          <h2 className="mt-4 font-display text-[28px] font-bold tracking-[-0.02em] text-[#111] md:text-[36px]">
            Lịch trình đã được thiết kế sẵn phù hợp với nhu cầu
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {tours.map((tour) => (
            <Link
              key={tour.title}
              href="/tours"
              className="group flex flex-col gap-2.5"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[16px]">
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="220px"
                />
              </div>
              <p className="text-[12px] uppercase tracking-[0.06em] text-[#888]">
                {tour.days}
              </p>
              <h3 className="font-body line-clamp-2 text-[15px] text-[#111]">
                {tour.title}
              </h3>
              <p className="text-[14px] text-[#6b6b6b]">
                Từ <span className="font-semibold text-[#111]">{tour.price}</span>{" "}
                / mỗi người
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-14 overflow-hidden rounded-[24px] bg-[#0b0b0b] px-6 py-12 text-center text-white md:px-12">
          <h3 className="mx-auto max-w-[22ch] font-display text-[28px] font-bold leading-tight md:text-[36px]">
            Khám phá thêm nhiều hành trình chờ bạn khám phá
          </h3>
          <div className="mt-8 flex justify-center">
            <PrimaryButton href="/tours">Khám phá</PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
