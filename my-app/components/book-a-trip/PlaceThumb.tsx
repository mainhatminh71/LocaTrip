"use client";

import { useEffect, useState } from "react";
import { proxiedMediaUrl } from "@/lib/media-url";
import {
  getCachedThumbBlob,
  setCachedThumbBlob,
} from "@/lib/place-detail-cache";
import styles from "./book-a-trip.module.css";

type PlaceThumbProps = {
  /** Raw place thumbnail URL (will be proxied when needed). */
  src?: string | null;
  alt?: string;
  /** `detail` = large modal hero; `tile` = replace/search thumbs */
  variant?: "detail" | "tile";
  className?: string;
};

async function resolveDisplayUrl(raw: string): Promise<string> {
  const cached = getCachedThumbBlob(raw);
  if (cached) return cached;

  const candidates = [
    proxiedMediaUrl(raw),
    raw !== proxiedMediaUrl(raw) ? raw : null,
  ].filter(Boolean) as string[];

  let lastErr: unknown = null;
  for (const candidate of candidates) {
    try {
      const res = await fetch(candidate, { cache: "force-cache" });
      if (!res.ok) {
        lastErr = new Error(`HTTP ${res.status}`);
        continue;
      }
      const type = res.headers.get("content-type") || "";
      if (type && !type.toLowerCase().startsWith("image/")) {
        lastErr = new Error(`not image: ${type}`);
        continue;
      }
      const blob = await res.blob();
      if (!blob.size) {
        lastErr = new Error("empty");
        continue;
      }
      const objectUrl = URL.createObjectURL(blob);
      setCachedThumbBlob(raw, objectUrl);
      return objectUrl;
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("thumb failed");
}

/**
 * Place image with polished skeleton when missing or broken.
 * Fetches via media-proxy into a blob URL and caches by raw src so
 * reopening the modal does not re-hit Google / flash “Chưa có ảnh”.
 */
export function PlaceThumb({
  src,
  alt = "",
  variant = "detail",
  className,
}: PlaceThumbProps) {
  const raw = src?.trim() || "";
  const [displayUrl, setDisplayUrl] = useState<string | null>(() =>
    raw ? getCachedThumbBlob(raw) : null,
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!raw) {
      setDisplayUrl(null);
      setFailed(false);
      return;
    }

    const cached = getCachedThumbBlob(raw);
    if (cached) {
      setDisplayUrl(cached);
      setFailed(false);
      return;
    }

    let cancelled = false;
    setDisplayUrl(null);
    setFailed(false);

    void (async () => {
      try {
        const url = await resolveDisplayUrl(raw);
        if (!cancelled) {
          setDisplayUrl(url);
          setFailed(false);
        }
      } catch {
        if (!cancelled) {
          setDisplayUrl(null);
          setFailed(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [raw]);

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
          <span className={styles.placeThumbSkeletonLabel}>
            {failed ? "Chưa có ảnh" : "Đang tải ảnh…"}
          </span>
        ) : null}
      </div>
    </div>
  );

  if (!raw || failed || !displayUrl) {
    return (
      <div className={merged} style={{ minHeight: minH }}>
        {skeleton}
      </div>
    );
  }

  return (
    <div className={merged} style={{ minHeight: minH }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={displayUrl}
        alt={alt}
        className={styles.placeThumbImg}
        loading="eager"
        decoding="async"
        style={{ opacity: 1 }}
        onError={() => {
          /* Blob URLs should not fail; mark failed so UI recovers cleanly. */
          setFailed(true);
          setDisplayUrl(null);
        }}
      />
    </div>
  );
}
