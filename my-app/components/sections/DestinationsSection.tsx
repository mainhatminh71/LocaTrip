"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { destinations } from "@/lib/content";
import { SectionTag } from "@/components/ui/SectionTag";
import styles from "./destinations.module.css";

const MARQUEE_NAMES = [
  "Hồ Tuyền Lâm",
  "Đồi Chè Cầu Đất",
  "LangBiang",
  "Trung tâm Đà Lạt",
  "Hồ Xuân Hương",
  "Đà Lạt",
];

/**
 * Framer Destinations: black sticky viewport stages + Lined Up name marquee.
 */
export function DestinationsSection() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = Math.max(1, el.offsetHeight - window.innerHeight);
      const progressed = Math.min(total, Math.max(0, -rect.top));
      const idx = Math.min(
        destinations.length - 1,
        Math.floor((progressed / total) * destinations.length),
      );
      setActive(idx);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const current = destinations[active] ?? destinations[0];

  return (
    <section className={styles.section} data-framer-name="Destinations">
      <div className={styles.intro}>
        <SectionTag tone="light">Địa điểm được yêu thích nhất</SectionTag>
        <h2 className={styles.heading}>
          Khám phá những địa điểm được nhiều người lựa chọn
        </h2>
      </div>

      <div
        ref={trackRef}
        className={styles.scrollTrack}
        style={{ height: `${destinations.length * 100}vh` }}
      >
        <div className={styles.sticky} data-framer-name="Sticky">
          <div className={styles.stage}>
            <Image
              key={current.title}
              src={current.image}
              alt={current.title}
              fill
              className={styles.stageImg}
              sizes="100vw"
              priority={active === 0}
            />
            <div className={styles.stageShade} />
            <div className={styles.stageCopy}>
              <p className={styles.stageIndex}>
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(destinations.length).padStart(2, "0")}
              </p>
              <h3>{current.title}</h3>
              <p>{current.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.stripe} data-framer-name="Text Stripe">
        <div className={styles.stripeTrack} data-framer-name="Lined Up">
          {[0, 1].map((copy) => (
            <div key={copy} className={styles.stripeRow}>
              {MARQUEE_NAMES.map((name) => (
                <span key={`${copy}-${name}`}>
                  {name}
                  <em>•</em>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
