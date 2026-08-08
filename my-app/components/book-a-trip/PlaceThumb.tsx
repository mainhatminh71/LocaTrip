"use client";

import { useEffect, useMemo, useState } from "react";
import { proxiedMediaUrl } from "@/lib/media-url";
import styles from "./book-a-trip.module.css";

type PlaceThumbProps = {
  /** Raw place thumbnail URL (will be proxied when needed). */
  src?: string | null;
  alt?: string;
  /** `detail` = large modal hero; `tile` = replace/search thumbs */
  variant?: "detail" | "tile";
  className?: string;
};

/**
 * Place image with polished skeleton when missing or broken.
 * Tries same-origin media-proxy first, then the original URL.
 */
export function PlaceThumb({
  src,
  alt = "",
  variant = "detail",
  className,
}: PlaceThumbProps) {
  const candidates = useMemo(() => {
    const raw = src?.trim() || "";
    if (!raw) return [] as string[];
    const proxied = proxiedMediaUrl(raw);
    const list: string[] = [];
    if (proxied) list.push(proxied);
    if (raw && raw !== proxied) list.push(raw);
    return list;
  }, [src]);

  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setIndex(0);
    setLoaded(false);
  }, [src]);

  const url = candidates[index] || "";
  const exhausted = candidates.length === 0 || index >= candidates.length;
  const showImg = Boolean(url) && !exhausted;

  const shellClass =
    variant === "tile" ? styles.placeThumbTile : styles.placeThumbDetail;
  const merged = [shellClass, styles.placeThumbFrame, className]
    .filter(Boolean)
    .join(" ");
  const minH = variant === "tile" ? 44 : 200;

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
    return (
      <div className={merged} style={{ minHeight: minH }}>
        {skeleton}
      </div>
    );
  }

  return (
    <div className={merged} style={{ minHeight: minH }}>
      {!loaded ? skeleton : null}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={url}
        src={url}
        alt={alt}
        className={styles.placeThumbImg}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setLoaded(false);
          setIndex((i) => i + 1);
        }}
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </div>
  );
}
