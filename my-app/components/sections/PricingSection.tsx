"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SectionTag } from "@/components/ui/SectionTag";

const plans = [
  {
    name: "Bình thường",
    monthly: "FREE",
    yearly: "FREE",
    usd: "$250",
    features: ["1 projects", "Analytics", "Insights Panel", "Share Features"],
    cta: false,
  },
  {
    name: "Pro",
    monthly: "đ59.000",
    yearly: "đ470.000",
    usd: "$500",
    features: ["2 projects", "Analytics", "Insights Panel", "Share Features"],
    cta: true,
    highlight: true,
  },
  {
    name: "Doanh nghiệp",
    monthly: "đ209.000",
    yearly: "đ2.990K",
    usd: "$1000",
    features: [
      "Unlimited Projects",
      "Analytics",
      "Insights Panel",
      "Share Features",
    ],
    cta: true,
  },
] as const;

export function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section className="section-pad relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute -left-40 top-20 size-[320px] rounded-full bg-lt-cream" />
      <div className="pointer-events-none absolute -right-32 bottom-10 size-[280px] rounded-full bg-lt-soft" />

      <div className="relative mx-auto max-w-[1280px]">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <SectionTag>Gói dịch vụ</SectionTag>
            <h2 className="font-display mt-4 text-[32px] font-bold leading-[1.2] text-lt-teal-deep md:text-4xl">
              Gói dịch vụ phù hợp với nhu cầu
            </h2>
          </div>

          <div className="flex flex-col items-start gap-2">
            <div className="inline-flex rounded-full bg-lt-soft p-1">
              <button
                type="button"
                className={`font-cal rounded-full px-5 py-2 text-sm ${
                  !yearly ? "bg-white text-lt-ink shadow-sm" : "text-lt-muted"
                }`}
                onClick={() => setYearly(false)}
              >
                Tháng
              </button>
              <button
                type="button"
                className={`font-cal rounded-full px-5 py-2 text-sm ${
                  yearly ? "bg-white text-lt-ink shadow-sm" : "text-lt-muted"
                }`}
                onClick={() => setYearly(true)}
              >
                Năm
              </button>
            </div>
            <p className="text-sm text-[#009456]">
              Giảm hơn 20% với gói dịch vụ năm
            </p>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-[20px] border p-7 ${
                "highlight" in plan && plan.highlight
                  ? "border-lt-teal bg-lt-teal text-white"
                  : "border-black/8 bg-lt-soft"
              }`}
            >
              <p
                className={`font-cal text-sm ${
                  "highlight" in plan && plan.highlight
                    ? "text-white/70"
                    : "text-lt-muted"
                }`}
              >
                {plan.name}
              </p>
              <p className="font-jakarta mt-3 text-[48px] font-bold tracking-[-0.04em] leading-none md:text-[54px]">
                {yearly ? plan.yearly : plan.monthly}
              </p>
              <p
                className={`mt-2 text-sm ${
                  "highlight" in plan && plan.highlight
                    ? "text-white/60"
                    : "text-lt-gray"
                }`}
              >
                {plan.usd} <span>per month</span>
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span
                      className={`inline-block size-1.5 rounded-full ${
                        "highlight" in plan && plan.highlight
                          ? "bg-[#00E685]"
                          : "bg-lt-teal"
                      }`}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              {plan.cta ? (
                <div className="mt-8">
                  <PrimaryButton
                    href="/"
                    variant={"highlight" in plan && plan.highlight ? "light" : "dark"}
                  >
                    Sign up
                  </PrimaryButton>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
