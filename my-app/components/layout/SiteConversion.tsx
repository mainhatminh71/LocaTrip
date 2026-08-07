"use client";

import Image from "next/image";
import { LT_IMAGE_QUALITY } from "@/lib/image-quality";
import Link from "next/link";
import { BOOK_TRIP_ASSETS, BOOK_TRIP_COPY, MARQUEE_ITEMS } from "@/lib/book-a-trip-assets";
import styles from "./site-conversion.module.css";

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path
        d="M2 12L12 2M12 2H4M12 2V10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type SiteConversionProps = {
  /** Framer Desktop CTA — homepage links to book-a-trip; book page scrolls up. */
  ctaHref?: string;
};

/**
 * Framer `Conversion` section: masked overlay image + titles + pill CTA + emoji ticker.
 * Shared by homepage and book-a-trip (site-footer is a sibling after this).
 */
export function SiteConversion({ ctaHref = "/book-a-trip/" }: SiteConversionProps) {
  const isHashTop = ctaHref === "#top";

  return (
    <section className={styles.conversion} data-framer-name="Conversion">
      <div className={styles.ctaOverlay} data-framer-name="Overlay">
        <Image
          src={BOOK_TRIP_ASSETS.ctaBanner}
          alt=""
          fill
          className={styles.ctaBg}
          sizes="100vw"
                    quality={LT_IMAGE_QUALITY}
                  />
      </div>

      <div className={styles.ctaBanner} data-framer-name="Container">
        <div className={styles.ctaInner} data-framer-name="Titles">
          <h2 data-framer-name="Title">{BOOK_TRIP_COPY.ctaTitle}</h2>
          <p data-framer-name="Title">{BOOK_TRIP_COPY.ctaSub}</p>
        </div>
        {isHashTop ? (
          <a
            href="#top"
            className={styles.ctaBtn}
            data-framer-name="Desktop"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span>{BOOK_TRIP_COPY.ctaBtn}</span>
            <i>
              <ArrowIcon />
            </i>
          </a>
        ) : (
          <Link href={ctaHref} className={styles.ctaBtn} data-framer-name="Desktop">
            <span>{BOOK_TRIP_COPY.ctaBtn}</span>
            <i>
              <ArrowIcon />
            </i>
          </Link>
        )}
      </div>

      <div className={styles.marquee}>
        <div className={styles.marqueeTrack}>
          {[0, 1].map((copy) => (
            <div key={copy} className={styles.marqueeRow}>
              {MARQUEE_ITEMS.map((item) => (
                <span key={`${copy}-${item}`}>
                  {item}
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
