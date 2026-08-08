"use client";

import { useState } from "react";
import styles from "./book-a-trip.module.css";

type PlaceThumbProps = {
  src?: string | null;
  alt?: string;
  /** `detail` = large modal hero; `tile` = replace/search thumbs */
  variant?: "detail" | "tile";
  className?: string;
};

/**
 * Place image with polished skeleton when missing or broken.
 */
export function PlaceThumb({
  src,
  alt = "",
  variant = "detail",
  className,
}: PlaceThumbProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const url = src?.trim() || "";
  const showImg = Boolean(url) && !failed;

  const shellClass =
    variant === "tile" ? styles.placeThumbTile : styles.placeThumbDetail;
  const merged = [shellClass, styles.placeThumbFrame, className]
    .filter(Boolean)
    .join(" ");

  const skeleton = (
    <div className={styles.placeThumbSkeleton} aria-hidden="true">
      <div className={styles.placeThumbSkeletonShimmer} />
      <div className={styles.placeThumbSkeletonArt}>
        <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">
          <rect
            x="6"
            y="10"
            width="36"
            height="28"
            rx="4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
          />
          <circle cx="16" cy="20" r="3.5" fill="currentColor" opacity="0.45" />
          <path
            d="M8 34l10-9 7 6 5-4 10 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.7"
          />
        </svg>
        {variant === "detail" ? (
          <span className={styles.placeThumbSkeletonLabel}>Chưa có ảnh</span>
        ) : null}
      </div>
    </div>
  );

  if (!showImg) {
    return <div className={merged}>{skeleton}</div>;
  }

  return (
    <div className={merged}>
      {!loaded ? skeleton : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        className={styles.placeThumbImg}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setFailed(true);
          setLoaded(false);
        }}
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
}
