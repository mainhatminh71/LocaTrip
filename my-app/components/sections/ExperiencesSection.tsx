import Link from "next/link";
import { experiences } from "@/lib/content";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTag } from "@/components/ui/SectionTag";
import { ImageCrossfade } from "@/components/ui/ImageCrossfade";

/** Ported from Framer experiences + destinations CTA strip. */
export function ExperiencesSection() {
  return (
    <section className="w-full bg-white px-4 pb-16 md:px-10 md:pb-20">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-10 max-w-2xl">
          <SectionTag>Khám phá nhanh gọn</SectionTag>
          <h2 className="mt-4 font-display text-[32px] font-bold leading-[1.2] tracking-[-0.02em] text-[#111] md:text-[40px]">
            Trải nghiệm đa cảm xúc tại nơi bạn đang đặt chân
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {experiences.map((item) => (
            <Link
              key={item.title}
              href="/tours"
              className="group flex flex-col gap-3"
            >
              <div className="relative aspect-[256/411] overflow-hidden rounded-[22px]">
                <ImageCrossfade
                  images={item.images}
                  alt={item.title}
                  intervalMs={4000}
                  className="absolute inset-0 h-full w-full"
                  sizes="(max-width:1280px) 50vw, 25vw"
                />
              </div>
              <h3 className="font-display text-xl font-semibold text-[#111]">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#5c5c5c]">{item.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-black/5 pt-8 md:flex-row md:items-center">
          <p className="font-body text-[18px] text-[#111]">
            Khám phá nhiều địa điểm đang chờ bạn
          </p>
          <PrimaryButton href="/tours" variant="dark">
            Xem các gói có sẵn
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}
