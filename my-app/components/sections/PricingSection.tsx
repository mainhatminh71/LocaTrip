"use client";

import { useState } from "react";
import Link from "next/link";
import { pricingPlans } from "@/lib/content";
import { SectionTag } from "@/components/ui/SectionTag";

/** Ported from Framer pricing (Tháng / Năm). */
export function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="w-full bg-[#E8F8EF] px-4 py-20 md:px-10 md:py-28">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-10 flex flex-col items-center text-center">
          <SectionTag>Gói dịch vụ</SectionTag>
          <h2 className="mt-4 font-display text-[32px] font-bold tracking-[-0.02em] text-[var(--lt-near-black)] md:text-[42px]">
            phù hợp với nhu cầu
          </h2>
          <div className="mt-6 inline-flex rounded-full bg-white/80 p-1 shadow-sm">
            <button
              type="button"
              className={`rounded-full px-5 py-2 text-sm ${
                !yearly
                  ? "bg-[var(--lt-black)] text-white"
                  : "text-[var(--lt-muted)]"
              }`}
              onClick={() => setYearly(false)}
            >
              Tháng
            </button>
            <button
              type="button"
              className={`rounded-full px-5 py-2 text-sm ${
                yearly
                  ? "bg-[var(--lt-black)] text-white"
                  : "text-[var(--lt-muted)]"
              }`}
              onClick={() => setYearly(true)}
            >
              Năm
            </button>
          </div>
          {yearly && (
            <p className="mt-3 text-sm text-[#1a7a4c]">
              Giảm hơn 20% với gói dịch vụ năm
            </p>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={`flex flex-col rounded-[22px] border p-7 ${
                plan.highlight
                  ? "border-transparent bg-[var(--lt-black)] text-white shadow-xl"
                  : "border-white/60 bg-white text-[var(--lt-near-black)]"
              }`}
            >
              <p className="text-sm opacity-70">{plan.name}</p>
              <p className="mt-3 text-[44px] font-bold leading-none tracking-[-0.04em] md:text-[52px]">
                {yearly ? plan.yearly : plan.monthly}
              </p>
              <p className="mt-2 text-sm opacity-55">per month</p>
              <ul className="mt-8 flex-1 space-y-3 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span
                      className={`inline-flex size-5 items-center justify-center rounded-full text-[11px] ${
                        plan.highlight
                          ? "bg-[var(--lt-mint)] text-[var(--lt-black)]"
                          : "bg-[var(--lt-near-black)] text-white"
                      }`}
                    >
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/book-a-trip/"
                className={`mt-8 inline-flex h-11 items-center justify-center rounded-full text-sm font-medium transition ${
                  plan.highlight
                    ? "bg-[var(--lt-mint)] text-[var(--lt-black)] hover:bg-[#58e8ab]"
                    : "border border-[var(--lt-near-black)] text-[var(--lt-near-black)] hover:bg-[var(--lt-near-black)] hover:text-white"
                }`}
              >
                {plan.cta}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
