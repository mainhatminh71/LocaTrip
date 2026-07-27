import Image from "next/image";
import { IMG } from "@/lib/content";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTag } from "@/components/ui/SectionTag";

export function AboutSection() {
  return (
    <section className="section-pad bg-lt-cream">
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl md:aspect-[5/4] lg:aspect-[4/5]">
          <Image
            src={IMG.cliff}
            alt="Du khách nhìn ra biển"
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
        </div>
        <div>
          <SectionTag>Về chúng tôi</SectionTag>
          <h2 className="font-display mt-4 text-[32px] font-bold leading-[1.2] text-lt-teal-deep md:text-4xl">
            Nhanh chóng và tiện nghi
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-lt-body">
            Chúng tôi là những cá nhân yêu thích du lịch, tạo ra những hành trình
            nhanh chóng và dễ dàng để người dùng chỉ việc xách vali mà đi. Chúng
            tôi thay đổi sự phiền muộn của mỗi hành trình bằng sự thoải mái và
            tiện nghi.
          </p>
          <div className="mt-8">
            <PrimaryButton href="/about" variant="dark">
              Biết thêm
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}
