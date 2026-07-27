import Image from "next/image";
import Link from "next/link";
import { IMG, navLinks } from "@/lib/content";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-lt-teal-deep text-white">
      <div className="absolute inset-0">
        <Image
          src={IMG.footer}
          alt=""
          fill
          className="object-cover opacity-35"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-lt-teal-deep via-lt-teal-deep/85 to-lt-teal/70" />
      </div>

      <div className="relative mx-auto max-w-[1280px] px-4 pb-10 pt-20 md:px-10">
        <div className="mb-16 max-w-xl">
          <h2 className="font-display text-3xl font-bold leading-tight md:text-4xl">
            Biến chuyến du lịch trở nên dễ dàng
          </h2>
          <p className="mt-3 text-white/75">
            Biến ý tưởng trở thành hiện thực. Thiết kế chuyến du lịch đáng nhớ
          </p>
          <div className="mt-6">
            <PrimaryButton href="/book-a-trip">
              Tạo lịch trình tức thì
            </PrimaryButton>
          </div>
        </div>

        <div className="mb-10 overflow-hidden border-y border-white/15 py-4">
          <div className="marquee-track gap-8 text-sm text-white/80">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex gap-8 whitespace-nowrap">
                <span>✈️ Tours tùy chỉnh</span>
                <span>🌍 Đi đến mọi ngóc ngách</span>
                <span>🏝️ Tối ưu ngân sách</span>
                <span>🧳 Hỗ trợ tức thì</span>
                <span>🏨 Tiện ích vô vàng</span>
                <span>🚗 Di chuyển dễ dàng</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-10 border-b border-white/15 pb-10 md:grid-cols-3">
          <div>
            <p className="font-display text-xl font-bold tracking-[0.08em]">
              LOCATRIP
            </p>
            <p className="mt-3 max-w-xs text-sm text-white/65">
              Lên kế hoạch với một nút bấm, du lịch với tâm trí thư thái.
            </p>
          </div>
          <div>
            <p className="font-cal mb-4 text-sm text-white/50">Pages</p>
            <ul className="space-y-2 text-sm text-white/85">
              <li>
                <Link href="/">Trang chủ</Link>
              </li>
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/policies/privacy-policy">Chính sách bảo mật</Link>
              </li>
              <li>
                <Link href="/policies/terms-conditions">
                  Điều khoản và dịch vụ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-cal mb-4 text-sm text-white/50">Social</p>
            <ul className="space-y-2 text-sm text-white/85">
              <li>Instagram</li>
              <li>Facebook</li>
              <li>TikTok</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <p>All rights reserved for LocalTrip</p>
          <p>
            Designed by{" "}
            <a
              href="https://fremix.design/"
              className="underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              Jitu Raut @fremix.design
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
