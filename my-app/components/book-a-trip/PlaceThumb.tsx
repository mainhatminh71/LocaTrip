"use client";

import { useEffect, useMemo, useState } from "react";
import { proxiedMediaUrl } from "@/lib/media-url";
import styles from "./book-a-trip.module.css";

type PlaceThumbProps = {
  /** Raw place thumbnail URL (Google lh3.* / R2 / etc.), or ordered candidates. */
  src?: string | null | Array<string | null | undefined>;
  alt?: string;
  /** `detail` = large modal hero; `tile` = list / replace thumbs */
  variant?: "detail" | "tile";
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
  className,
}: PlaceThumbProps) {
  const urls = useMemo(() => candidateUrls(src), [src]);
  const urlsKey = urls.join("\0");
  const [urlIndex, setUrlIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const raw = urls[urlIndex] || "";

  useEffect(() => {
    setUrlIndex(0);
    setLoaded(false);
    setFailed(false);
  }, [urlsKey]);

  useEffect(() => {
    setLoaded(false);
    if (!raw) {
      setFailed(urls.length === 0);
      return;
    }
    setFailed(false);

    let cancelled = false;
    const probe = new window.Image();
    // Same-origin R2 proxy does not need referrer stripping; keep for Google.
    if (!raw.startsWith("/api/r2-media")) {
      probe.referrerPolicy = "no-referrer";
    }

    const fail = () => {
      if (cancelled) return;
      if (urlIndex + 1 < urls.length) {
        setUrlIndex((i) => i + 1);
        return;
      }
      setFailed(true);
      setLoaded(false);
    };
    const ok = () => {
      if (cancelled) return;
      setLoaded(true);
      setFailed(false);
    };

    const timer = window.setTimeout(fail, 10_000);
    probe.onload = () => {
      window.clearTimeout(timer);
      ok();
    };
    probe.onerror = () => {
      window.clearTimeout(timer);
      fail();
    };
    probe.src = raw;

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      probe.onload = null;
      probe.onerror = null;
    };
  }, [raw, urlIndex, urls.length]);

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
      {loaded ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={raw}
          alt={alt}
          className={styles.placeThumbImg}
          decoding="async"
          referrerPolicy={
            raw.startsWith("/api/r2-media") ? undefined : "no-referrer"
          }
          draggable={false}
        />
      ) : null}
    </div>
  );
}
