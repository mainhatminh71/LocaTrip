"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navLinks } from "@/lib/content";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-lt-teal-deep/90 py-3 shadow-lg backdrop-blur-md"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 md:px-10">
        <Link
          href="/"
          className="font-display text-[22px] font-bold tracking-[0.08em] text-white"
        >
          LOCATRIP
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-cal text-[15px] text-white/85 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <PrimaryButton href="/book-a-trip">Tạo lịch trình ngay</PrimaryButton>
        </div>

        <button
          type="button"
          aria-label="Menu"
          className="flex size-10 items-center justify-center rounded-full border border-white/25 text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Toggle menu</span>
          <div className="flex w-4 flex-col gap-1">
            <span className="h-0.5 w-full bg-white" />
            <span className="h-0.5 w-full bg-white" />
            <span className="h-0.5 w-full bg-white" />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-lt-teal-deep px-4 py-6 lg:hidden">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-cal text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <PrimaryButton href="/book-a-trip">Tạo lịch trình ngay</PrimaryButton>
          </div>
        </div>
      )}
    </header>
  );
}
