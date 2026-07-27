"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { IMG } from "@/lib/content";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

const collage = [
  { src: IMG.hero1, className: "left-[8%] top-[8%] h-[42%] w-[28%] rotate-[-6deg]" },
  { src: IMG.hero2, className: "right-[6%] top-[4%] h-[38%] w-[30%] rotate-[5deg]" },
  { src: IMG.hero3, className: "bottom-[10%] left-[18%] h-[36%] w-[26%] rotate-[3deg]" },
  { src: IMG.hero4, className: "bottom-[6%] right-[12%] h-[40%] w-[28%] rotate-[-4deg]" },
];

export function HeroSection() {
  return (
    <section className="hero-grid-bg relative min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-20 top-24 size-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-10 right-10 size-96 rounded-full bg-teal-300/10 blur-3xl" />
      </div>

      <div className="relative mx-auto grid min-h-screen max-w-[1280px] items-center gap-10 px-4 pb-16 pt-28 md:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:pt-24">
        <div className="animate-fade-up z-10 max-w-2xl">
          <p className="font-cal mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90">
            Khu vực: Đà Lạt
          </p>
          <h1 className="font-display text-[40px] font-bold leading-[1.15] tracking-tight md:text-[64px] lg:text-[72px]">
            Khám phá bản sắc nơi bạn đang đặt chân
          </h1>
          <p className="mt-5 max-w-md text-lg text-white/75">
            Du lịch là để tận hưởng, không phải vội vã
          </p>
          <div className="mt-8">
            <PrimaryButton href="/book-a-trip">Tạo lịch trình ngay</PrimaryButton>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[IMG.avatar1, IMG.avatar2, IMG.avatar3].map((src) => (
                  <Image
                    key={src}
                    src={src}
                    alt=""
                    width={36}
                    height={36}
                    className="size-9 rounded-full border-2 border-lt-teal-deep object-cover"
                  />
                ))}
              </div>
              <div>
                <p className="font-cal text-white">4.9 sao (124k Reviews)</p>
                <p className="text-white/60">50k travellers · 15k followers</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto hidden h-[560px] w-full max-w-[540px] lg:block">
          {collage.map((item, i) => (
            <motion.div
              key={item.src}
              className={`absolute overflow-hidden rounded-3xl shadow-2xl ${item.className}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * i, duration: 0.7 }}
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              <div className={`relative h-full w-full animate-float`}>
                <Image
                  src={item.src}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="280px"
                  priority={i < 2}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3 lg:hidden">
          {collage.map((item) => (
            <div
              key={item.src}
              className="relative aspect-[4/5] overflow-hidden rounded-3xl"
            >
              <Image src={item.src} alt="" fill className="object-cover" sizes="50vw" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
