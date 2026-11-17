"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { proxiedMediaUrl } from "@/lib/media-url";
import { prefetchPlaceThumb } from "@/lib/prefetch-place-thumb";
import styles from "./book-a-trip.module.css";

type PlaceThumbProps = {
  /** Raw place thumbnail URL (Google lh3.* / R2 / etc.), or ordered candidates. */
  src?: string | null | Array<string | null | undefined>;
  alt?: string;
  /** `detail` = large modal hero; `tile` = list / replace thumbs */
  variant?: "detail" | "tile";
  /** Eager + high priority (itinerary stop tiles that open the modal). */
  priority?: boolean;
  className?: string;
};

function normalizeThumbUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("http://")) return `https://${trimmed.slice(7)}`;
  return trimmed;
}

function candidateUrls(
  src?: string | null | Array<string | null | undefined>,
): string[] {
  const list = Array.isArray(src) ? src : [src];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of list) {
    const n = normalizeThumbUrl(item || "");
    if (!n) continue;
    const display = proxiedMediaUrl(n) || n;
    if (!display || seen.has(display)) continue;
    seen.add(display);
    out.push(display);
  }
  return out;
}

/**
 * Place image with skeleton when missing or broken.
 *
 * Google `lh3.googleusercontent.com` blocks server/Worker fetches (403), so
 * we load those in the browser with `referrerPolicy="no-referrer"`.
 * Cloudflare R2 public `*.r2.dev` URLs are rewritten to `/api/r2-media`
 * (same-origin stream) because they often fail TLS from some networks.
 */
export function PlaceThumb({
  src,
  alt = "",
  variant = "detail",
  priority = false,
  className,
}: PlaceThumbProps) {
  const urls = useMemo(() => candidateUrls(src), [src]);
  const firstUrl = urls[0] || "";
  const [urlIndex, setUrlIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const raw = urls[urlIndex] || "";
  const prevRawRef = useRef(raw);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const eager = variant === "detail" || priority;

  // Warm cache as soon as we know a URL (list tile → modal reuse).
  useEffect(() => {
    if (firstUrl) prefetchPlaceThumb(firstUrl);
  }, [firstUrl]);

  useEffect(() => {
    setUrlIndex(0);
    setFailed(urls.length === 0);
    // Keep `loaded` if the primary URL is unchanged (detail refresh adds fallbacks).
    if (!firstUrl || prevRawRef.current !== firstUrl) {
      setLoaded(false);
      prevRawRef.current = firstUrl;
    }
  }, [firstUrl, urls.length]);

  useEffect(() => {
    if (prevRawRef.current === raw) return;
    prevRawRef.current = raw;
    setLoaded(false);
    setFailed(!raw && urls.length === 0);
  }, [raw, urls.length]);

  // Cached images may finish before onLoad attaches — skip skeleton then.
  useEffect(() => {
    const el = imgRef.current;
    if (!el || !raw) return;
    if (el.complete && el.naturalWidth > 0) {
      setLoaded(true);
      setFailed(false);
    }
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
            {failed || urls.length === 0 ? "Chưa có ảnh" : "Đang tải ảnh…"}
          </span>
        ) : null}
      </div>
    </div>
  );

  if (urls.length === 0 || failed) {
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
        ref={imgRef}
        src={raw}
        alt={alt}
        className={styles.placeThumbImg}
        style={loaded ? undefined : { position: "absolute", opacity: 0 }}
        decoding="async"
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        referrerPolicy={
          raw.startsWith("/api/r2-media") ? undefined : "no-referrer"
        }
        draggable={false}
        onLoad={() => {
          setLoaded(true);
          setFailed(false);
        }}
        onError={() => {
          if (urlIndex + 1 < urls.length) {
            setUrlIndex((i) => i + 1);
            return;
          }
          setFailed(true);
          setLoaded(false);
        }}
      />
    </div>
  );
}
