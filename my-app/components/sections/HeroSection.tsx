"use client";

import Image from "next/image";
import { LT_IMAGE_QUALITY } from "@/lib/image-quality";
import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import { IMG, heroStats } from "@/lib/content";

type HeroProps = {
  locationLabel?: string;
  heading?: string;
  supportingText?: string;
  ctaLabel?: string;
  ctaHref?: string;
  showTrustRow?: boolean;
};

/**
 * Port of Framer `LocaTripHeroExport` → Next.
 * SiteNav comes from MarketingChrome (fixed overlay).
 */
export function HeroSection({
  locationLabel = "Khu vực: Đà Lạt",
  heading = "Khám phá bản sắc nơi bạn đang đặt chân",
  supportingText = "Du lịch là để tận hưởng, không phải vội vã",
  ctaLabel = "Tạo lịch trình ngay",
  ctaHref = "/book-a-trip/",
  showTrustRow = true,
}: HeroProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const inView = useInView(heroRef, { amount: 0.2, once: false });

  const thumbs = [
    {
      src: IMG.hero2,
      alt: "Da Lat misty hills",
      style: {
        left: "clamp(12px, 4vw, 40px)",
        top: "clamp(88px, 18vh, 150px)",
        transform: "rotate(-8deg)",
      } as CSSProperties,
    },
    {
      src: IMG.hero3,
      alt: "Foggy valley",
      style: {
        right: "clamp(12px, 4vw, 40px)",
        top: "clamp(112px, 22vh, 220px)",
        transform: "rotate(9deg)",
      } as CSSProperties,
    },
    {
      src: IMG.hero1,
      alt: "Lake and park",
      style: {
        left: "clamp(16px, 5vw, 68px)",
        bottom: showTrustRow
          ? "clamp(80px, 14vh, 128px)"
          : "clamp(18px, 8vh, 64px)",
        transform: "rotate(7deg)",
      } as CSSProperties,
    },
    {
      src: IMG.hero4,
      alt: "City street Da Lat",
      style: {
        right: "clamp(16px, 5vw, 68px)",
        bottom: showTrustRow
          ? "clamp(86px, 15vh, 132px)"
          : "clamp(22px, 8vh, 66px)",
        transform: "rotate(-7deg)",
      } as CSSProperties,
    },
  ];

  return (
    <section
      ref={heroRef}
      className="relative isolate flex h-[100svh] min-h-[680px] w-full max-w-full items-stretch justify-center overflow-hidden bg-[var(--lt-near-black)] text-white"
    >
      <Image
        src={IMG.homeHero}
        alt="Đà Lạt — hồ và rừng"
        fill
        priority
        sizes="100vw"
        quality={LT_IMAGE_QUALITY}
        className={`object-cover object-center transition-transform duration-[1200ms] ease-out ${
          inView ? "scale-[1.02]" : "scale-100"
        }`}
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(10,19,18,0.38) 42%, rgba(8,14,16,0.58) 100%)",
        }}
      />

      {thumbs.map((t) => (
        <div
          key={t.src}
          className="pointer-events-none absolute z-[1] hidden overflow-hidden rounded-2xl border border-white/25 bg-white/10 shadow-[0_10px_28px_rgba(0,0,0,0.25)] sm:block"
          style={{
            ...t.style,
            width: "clamp(70px, 12vw, 122px)",
            aspectRatio: "4 / 5",
          }}
        >
          <Image
            src={t.src}
            alt={t.alt}
            fill
            className="object-cover"
            sizes="130px"
            quality={LT_IMAGE_QUALITY}
          />
        </div>
      ))}

      <motion.div
        initial={inView ? { opacity: 0, y: 18 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-[2] flex w-full max-w-[980px] flex-col justify-end gap-6 p-[clamp(16px,3vw,28px)] pt-[clamp(88px,14vh,120px)]"
      >
        <div className="mx-auto my-auto flex w-[min(100%,760px)] flex-col items-center gap-3.5 px-[clamp(6px,2vw,20px)] py-[clamp(8px,1vw,14px)] text-center">
          <span className="font-body rounded-full border border-white/25 bg-[rgba(12,20,22,0.42)] px-3.5 py-2 text-[15px] font-semibold leading-none tracking-[-0.01em] text-white/92">
            {locationLabel}
          </span>

          <h1 className="m-0 max-w-[15ch] text-balance font-display text-[clamp(36px,6vw,56px)] font-bold leading-[1.03] tracking-[-0.03em] text-white">
            {heading}
          </h1>

          <p className="m-0 max-w-[560px] text-balance font-body text-[clamp(16px,2.2vw,18px)] font-medium leading-[1.35] tracking-[-0.01em] text-white/92">
            {supportingText}
          </p>

          <Link href={ctaHref} className="mt-1.5">
            <motion.span
              role="button"
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -1 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className="font-body inline-flex cursor-pointer items-center gap-2 rounded-full border border-black/10 bg-white px-[18px] py-3 text-[15px] font-semibold leading-none tracking-[-0.01em] text-[var(--lt-near-black)] shadow-[0_8px_22px_rgba(0,0,0,0.2)]"
            >
              <span>{ctaLabel}</span>
              <span aria-hidden>→</span>
            </motion.span>
          </Link>
        </div>

        {showTrustRow ? (
          <div className="mx-auto flex min-h-[42px] w-[min(94%,640px)] flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-full border border-black/5 bg-white/96 px-3.5 py-2.5 text-[var(--lt-near-black)] shadow-[0_6px_20px_rgba(0,0,0,0.1)]">
            {heroStats.map((s) => (
              <span
                key={s.text}
                className="font-body inline-flex items-center gap-1.5 text-[13px] font-semibold tracking-[-0.01em] md:text-[14px]"
              >
                <TrustIcon kind={s.kind} />
                {s.text}
              </span>
            ))}
          </div>
        ) : null}
      </motion.div>
    </section>
  );
}

function TrustIcon({ kind }: { kind: "google" | "people" | "ig" }) {
  if (kind === "google") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M12 17.3 18.2 21l-1.6-7.1L22 9.2l-7.2-.6L12 2 9.2 8.6 2 9.2l5.4 4.7L5.8 21z"
        />
      </svg>
    );
  }
  if (kind === "people") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3ZM8 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3ZM8.2 13C5.4 13 2 14.2 2 16.5V18h8.5v-1.5c0-.9.4-1.7 1.1-2.3A7.4 7.4 0 0 0 8.2 13Zm7.3 0c-.5 0-1 .05-1.4.14A4.2 4.2 0 0 1 16.5 16.5V18H22v-1.5C22 14.2 18.6 13 15.5 13Z"
          fill="currentColor"
        />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}
