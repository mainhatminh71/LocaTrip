import Image from "next/image";
import Link from "next/link";
import { experiences } from "@/lib/content";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTag } from "@/components/ui/SectionTag";

export function ExperiencesSection() {
  return (
    <section className="section-pad bg-white">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 max-w-2xl">
          <SectionTag>Khám phá nhanh gọn</SectionTag>
          <h2 className="font-display mt-4 text-[32px] font-bold leading-[1.2] text-lt-teal-deep md:text-4xl">
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
              <div className="relative aspect-[256/411] overflow-hidden rounded-3xl">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width:1280px) 50vw, 25vw"
                />
              </div>
              <h3 className="font-display text-xl font-semibold text-lt-ink">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-lt-body">{item.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-black/5 pt-8 md:flex-row md:items-center">
          <p className="font-cal text-lt-ink">
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
