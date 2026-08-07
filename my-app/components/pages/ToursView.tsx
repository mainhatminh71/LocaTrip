"use client";

import Image from "next/image";
import { LT_IMAGE_QUALITY } from "@/lib/image-quality";
import Link from "next/link";
import { useMemo, useState } from "react";
import { TOUR_CARDS, TOURS_PAGE } from "@/lib/pages-content";
import { PageHero } from "@/components/pages/PageHero";
import styles from "./listing.module.css";

export function ToursView() {
  const [filter, setFilter] = useState<(typeof TOURS_PAGE.filters)[number]>(
    "Tất cả",
  );

  const cards = useMemo(() => {
    if (filter === "Tất cả") return TOUR_CARDS;
    return TOUR_CARDS.filter((t) => t.filter === filter);
  }, [filter]);

  return (
    <main>
      <PageHero
        title={TOURS_PAGE.heroTitle}
        sub={TOURS_PAGE.heroSub}
        bgSrc={TOURS_PAGE.heroBg}
      />
      <div className={styles.wrap} data-framer-name="Tours">
        <div className={styles.filters}>
          {TOURS_PAGE.filters.map((f) => (
            <button
              key={f}
              type="button"
              className={
                filter === f
                  ? `${styles.filter} ${styles.filterOn}`
                  : styles.filter
              }
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <div className={styles.grid}>
          {cards.map((tour) => (
            <Link
              key={tour.slug}
              href={`/tours/${tour.slug}/`}
              className={styles.card}
            >
              <div className={styles.thumb}>
                <Image
                  src={tour.image}
                  alt=""
                  fill
                  className={styles.thumbImg}
                  sizes="(max-width:809px) 100vw, 360px"
                    quality={LT_IMAGE_QUALITY}
                  />
              </div>
              <p className={styles.meta}>{tour.days}</p>
              <h3 className={styles.title}>{tour.title}</h3>
              <p className={styles.price}>{tour.price}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
