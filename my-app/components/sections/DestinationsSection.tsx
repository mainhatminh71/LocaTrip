"use client";

import Image from "next/image";
import { LT_IMAGE_QUALITY } from "@/lib/image-quality";
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

/** Destinations — card grid + name marquee (no multi-viewport sticky scroll). */
export function DestinationsSection() {
  return (
    <section className={styles.section} data-framer-name="Destinations">
      <div className={styles.intro}>
        <SectionTag tone="light">Địa điểm được yêu thích nhất</SectionTag>
        <h2 className={styles.heading}>
          Khám phá những địa điểm được nhiều người lựa chọn
        </h2>
      </div>

      <div className={styles.grid}>
        {destinations.map((d, i) => (
          <article key={d.title} className={styles.card}>
            <div className={styles.cardMedia}>
              <Image
                src={d.image}
                alt={d.title}
                fill
                className={styles.cardImg}
                sizes="(max-width: 809px) 100vw, 50vw"
                priority={i === 0}
                    quality={LT_IMAGE_QUALITY}
                  />
              <div className={styles.cardShade} />
            </div>
            <div className={styles.cardCopy}>
              <p className={styles.cardIndex}>
                {String(i + 1).padStart(2, "0")} /{" "}
                {String(destinations.length).padStart(2, "0")}
              </p>
              <h3>{d.title}</h3>
              <p>{d.subtitle}</p>
            </div>
          </article>
        ))}
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
