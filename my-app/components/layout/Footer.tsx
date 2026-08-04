import Image from "next/image";
import Link from "next/link";
import {
  IMG,
  footerDocs,
  footerPages,
  marqueeItems,
} from "@/lib/content";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

/** Ported from Framer footer + CTA banner. */
export function Footer() {
  return (
    <footer className="w-full overflow-hidden bg-[#0b0b0b] text-white">
      <div className="border-b border-white/10 py-4">
        <div className="marquee-track gap-10 px-4 text-sm text-white/70">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center gap-8 whitespace-nowrap">
              {marqueeItems.map((item) => (
                <span key={`${copy}-${item}`} className="flex items-center gap-8">
                  <span>{item}</span>
                  <span className="text-white/30">•</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-[1200px] px-4 py-16 md:px-10">
        <div className="relative mb-16 overflow-hidden rounded-[24px]">
          <div className="absolute inset-0">
            <Image
              src={IMG.footer}
              alt=""
              fill
              className="object-cover opacity-55"
              sizes="1200px"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative z-[1] flex flex-col items-center px-6 py-16 text-center">
            <h2 className="max-w-[18ch] font-display text-[28px] font-bold leading-tight md:text-[40px]">
              Biến chuyến du lịch trở lên dễ dàng
            </h2>
            <p className="mt-4 max-w-[36ch] text-sm text-white/75 md:text-base">
              Biến ý tưởng trở thành hiện thực. Thiết kế chuyến du lịch đáng nhớ
            </p>
            <div className="mt-8">
              <PrimaryButton href="/book-a-trip">Tạo lịch trình tức thì</PrimaryButton>
            </div>
          </div>
        </div>

        <div className="grid gap-10 border-t border-white/10 pt-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-xl font-bold tracking-[0.12em]">
              LOCA<span className="font-normal tracking-[0.08em]">TRIP</span>
            </p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
              Lên kế hoạch với một nút bấm, du lịch với tâm trí thư thái.
            </p>
          </div>
          <div>
            <p className="mb-4 text-sm text-white/45">Pages</p>
            <ul className="space-y-2 text-sm text-white/80">
              {footerPages.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm text-white/45">Documentation</p>
            <ul className="space-y-2 text-sm text-white/80">
              {footerDocs.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm text-white/45">Social</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li>Instagram</li>
              <li>Facebook</li>
              <li>TikTok</li>
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-white/10 pt-6 text-xs text-white/40">
          All rights reserved for LocalTrip
        </p>
      </div>
    </footer>
  );
}
