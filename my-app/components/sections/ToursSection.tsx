import Image from "next/image";
import Link from "next/link";
import { tours } from "@/lib/content";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTag } from "@/components/ui/SectionTag";

export function ToursSection() {
  return (
    <section className="section-pad bg-lt-cream">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-10 max-w-2xl">
          <SectionTag>Lịch trình thiết kế sẵn</SectionTag>
          <h2 className="font-display mt-4 text-[32px] font-bold leading-[1.2] text-lt-teal-deep md:text-4xl">
            Lịch trình đã được thiết kế sẵn phù hợp với nhu cầu
          </h2>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tours.map((tour) => (
            <Link
              key={tour.title}
              href="/tours"
              className="group flex min-w-[260px] max-w-[300px] flex-col gap-4 sm:min-w-[280px]"
            >
              <div className="relative aspect-[538/780] overflow-hidden rounded-3xl">
                <Image
                  src={tour.image}
                  alt={tour.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="280px"
                />
                <span className="glass-pill absolute left-4 top-4 rounded-full px-3 py-1.5 text-xs text-white">
                  {tour.days}
                </span>
              </div>
              <div className="flex items-end justify-between gap-3">
                <h3 className="font-cal text-lg text-lt-ink">{tour.title}</h3>
                <p className="shrink-0 text-sm text-lt-body">
                  Từ <span className="font-semibold text-lt-ink">{tour.price}</span>
                  <span className="block text-xs">/ mỗi người</span>
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <p className="font-cal text-lt-ink">
            Khám phá thêm nhiều hành trình chờ bạn khám phá
          </p>
          <PrimaryButton href="/tours" variant="dark">
            Khám phá
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}
