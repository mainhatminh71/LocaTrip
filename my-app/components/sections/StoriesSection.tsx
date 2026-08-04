"use client";

import Image from "next/image";
import { IMG } from "@/lib/content";
import { SectionTag } from "@/components/ui/SectionTag";
import styles from "./stories.module.css";

const STORIES = [
  { src: IMG.story1, label: "Sunrise" },
  { src: IMG.story2, label: "Lake" },
  { src: IMG.story3, label: "Cafe" },
  { src: IMG.dest1, label: "City" },
  { src: IMG.dest2, label: "Forest" },
  { src: IMG.dest3, label: "Hill" },
  { src: IMG.exp1, label: "Culture" },
  { src: IMG.exp2, label: "Nature" },
] as const;

/** Framer Travel Stories + Testimonials ticker — horizontal story cards. */
export function StoriesSection() {
  return (
    <section className={styles.section} data-framer-name="Travel Stories">
      <div className={styles.intro}>
        <SectionTag>Vibe với LocalTrip</SectionTag>
        <h2 className={styles.heading}>
          Stories của khách hàng sau khi được LocaTrip lên kế hoạch
        </h2>
        <p className={styles.sub}>Tag #VibeWithLocalTrip để được đề xuất</p>
      </div>

      <div className={styles.ticker} data-framer-name="Testimonials ticker">
        <div className={styles.track}>
          {[0, 1].map((copy) => (
            <div key={copy} className={styles.row}>
              {STORIES.map((story) => (
                <article key={`${copy}-${story.label}`} className={styles.card}>
                  <div className={styles.progress}>
                    <span />
                    <span />
                    <span />
                  </div>
                  <Image
                    src={story.src}
                    alt=""
                    fill
                    className={styles.img}
                    sizes="220px"
                  />
                  <p className={styles.cardLabel}>{story.label}</p>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
