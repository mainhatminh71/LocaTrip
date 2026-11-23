"use client";

import { useState } from "react";
import Link from "next/link";
import type { PlaceDetail } from "@/lib/api/trips";
import { proxiedMediaUrl } from "@/lib/media-url";
import { absoluteUrl } from "@/lib/seo";
import { placeSharePath, shareOrCopy } from "@/lib/ui/share";
import { useToast } from "@/components/ui/ToastProvider";
import styles from "./public-place.module.css";

function mapsUrl(place: PlaceDetail): string | null {
  const lat = Number(place.latitude);
  const lng = Number(place.longitude);
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  }
  const q = [place.title, place.address]
    .map((s) => (typeof s === "string" ? s.trim() : ""))
    .filter(Boolean)
    .join(", ");
  if (!q) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;
}

type Props = {
  place: PlaceDetail;
  placeId: string;
};

export function PublicPlaceView({ place, placeId }: Props) {
  const { toastSuccess, toastError } = useToast();
  const [sharing, setSharing] = useState(false);
  const [thumbBroken, setThumbBroken] = useState(false);

  const title = place.title?.trim() || "Địa điểm";
  const address = place.address?.trim() || "";
  const thumb = proxiedMediaUrl(place.thumbnail) || "";
  const directions = mapsUrl(place);
  const rating =
    typeof place.reviewRating === "number" && Number.isFinite(place.reviewRating)
      ? place.reviewRating
      : null;
  const category = place.category?.trim() || "";

  const metaParts = [
    category,
    rating != null ? `${rating.toFixed(1)}★` : null,
    address,
  ].filter(Boolean);

  async function onShare() {
    if (sharing) return;
    setSharing(true);
    try {
      const path = placeSharePath(placeId);
      const url =
        typeof window !== "undefined"
          ? `${window.location.origin}${path}`
          : absoluteUrl(path);
      const result = await shareOrCopy({
        title: `${title} · LocaTrip`,
        text: address ? `${title} — ${address}` : title,
        url,
      });
      if (result.ok && result.method === "clipboard") {
        toastSuccess("Đã sao chép liên kết địa điểm");
      } else if (!result.ok && !result.cancelled) {
        toastError("Không chia sẻ được. Thử lại sau.");
      }
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className={styles.page}>
      <Link className={styles.back} href="/book-a-trip/">
        ← Lên lịch trình
      </Link>

      <article className={styles.card}>
        <div className={styles.thumbWrap}>
          {thumb && !thumbBroken ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              className={styles.thumb}
              src={thumb}
              alt={title}
              referrerPolicy="no-referrer"
              onError={() => setThumbBroken(true)}
            />
          ) : (
            <div className={styles.thumbFallback}>Không có ảnh</div>
          )}
        </div>

        <p className={styles.eyebrow}>Địa điểm trên LocaTrip</p>
        <h1 className={styles.title}>{title}</h1>
        {metaParts.length ? (
          <p className={styles.meta}>{metaParts.join(" · ")}</p>
        ) : null}

        <div className={styles.actions}>
          {directions ? (
            <a
              className={styles.btnPrimary}
              href={directions}
              target="_blank"
              rel="noreferrer"
            >
              Chỉ đường trên Google Maps
            </a>
          ) : null}
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={() => void onShare()}
            disabled={sharing}
          >
            {sharing ? "Đang chia sẻ…" : "Chia sẻ địa điểm"}
          </button>
          <Link className={styles.btnSecondary} href="/book-a-trip/">
            Tạo lịch trình với LocaTrip
          </Link>
        </div>
      </article>
    </div>
  );
}
