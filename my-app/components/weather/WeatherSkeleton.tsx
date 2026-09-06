"use client";

import styles from "./weather.module.css";

/** Compact skeleton for forecast banner — fail-soft loading only. */
export function WeatherSkeleton() {
  return (
    <div
      className={`${styles.weatherMount} ${styles.weatherCard} ${styles.weatherGlass}`}
      aria-busy="true"
      aria-label="Đang tải dự báo thời tiết…"
    >
      <div className={`${styles.skeletonLine} ${styles.skeletonSummary}`} />
      <div className={styles.daysStrip}>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`${styles.dayChip} ${styles.skeletonDayCard}`}
            aria-hidden="true"
          >
            <div className={`${styles.skeletonLine} ${styles.skeletonDayName}`} />
            <div className={`${styles.skeletonLine} ${styles.skeletonTemp}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
