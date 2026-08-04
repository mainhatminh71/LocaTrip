import Image from "next/image";
import { IMG } from "@/lib/content";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTag } from "@/components/ui/SectionTag";

/** Framer About — copy + image hashes from scrape. */
export function AboutSection() {
  return (
    <section
      className="w-full bg-white px-5 py-[100px] md:px-10"
      data-framer-name="About"
    >
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
        <div>
          <SectionTag>Về chúng tôi</SectionTag>
          <h2 className="mt-4 font-['Manrope','Manrope_Placeholder',sans-serif] text-[32px] font-bold leading-[1.2] tracking-[-0.01em] text-[#012830] capitalize md:text-[32px]">
            Nhanh chóng và tiện nghi
          </h2>
          <p className="mt-5 max-w-[38ch] font-['Inter',system-ui,sans-serif] text-[15px] font-medium leading-[1.7] tracking-[-0.02em] text-[#5c5c5c]">
            Chúng tôi là những cá nhân yêu thích du lịch và muốn mang đến cho bạn
            trải nghiệm thoải mái và tiện nghi.
          </p>
          <div className="mt-8">
            <PrimaryButton href="/about/" variant="dark">
              Biết thêm
            </PrimaryButton>
          </div>
        </div>

        <div className="relative mx-auto h-[460px] w-full max-w-[560px]">
          <div className="absolute left-0 top-6 z-[1] h-[78%] w-[55%] overflow-hidden rounded-[24px]">
            <Image
              src={IMG.aboutSide}
              alt=""
              fill
              className="object-cover"
              sizes="280px"
            />
          </div>
          <div className="absolute bottom-0 right-0 z-[2] h-[82%] w-[60%] overflow-hidden rounded-[24px] shadow-2xl ring-[6px] ring-white">
            <Image
              src={IMG.aboutMain}
              alt=""
              fill
              className="object-cover"
              sizes="300px"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
