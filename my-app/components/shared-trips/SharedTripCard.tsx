"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { SharedTripDoc } from "@/lib/api/shared-trips";
import { rateSharedTrip, reuseSharedTrip } from "@/lib/api/shared-trips";
import { ApiError } from "@/lib/api/http";
import { labelForValue } from "@/lib/auto-trip-form";
import { useToast } from "@/components/ui/ToastProvider";
import { StarRatingInput } from "./StarRatingInput";
import listStyles from "@/app/my-trips/my-trips.module.css";
import styles from "@/app/shared-trips/shared-trips.module.css";

function formatSharedAt(iso: string) {
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

type Props = {
  trip: SharedTripDoc;
  onUpdated?: (next: SharedTripDoc) => void;
};

export function SharedTripCard({ trip, onUpdated }: Props) {
  const router = useRouter();
  const { toastSuccess, toastError } = useToast();
  const [ratingBusy, setRatingBusy] = useState(false);
  const [reuseBusy, setReuseBusy] = useState(false);

  const styleTags = useMemo(() => {
    const values = [
      trip.tripType,
      trip.targetCustomer,
      ...(trip.preferences || []).slice(0, 6),
    ].filter(Boolean) as string[];
    return values.map((v) => ({ value: v, label: labelForValue(v) }));
  }, [trip]);

  async function onRate(rating: number) {
    if (trip.isOwner || ratingBusy) return;
    setRatingBusy(true);
    try {
      const next = await rateSharedTrip(trip.id, rating);
      onUpdated?.(next);
      toastSuccess("Đã lưu đánh giá");
    } catch (err) {
      toastError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Không đánh giá được",
      );
    } finally {
      setRatingBusy(false);
    }
  }

  async function onReuse() {
    if (reuseBusy) return;
    setReuseBusy(true);
    try {
      const { trip: cloned } = await reuseSharedTrip(trip.id);
      toastSuccess("Đã tạo bản sao trong chuyến của bạn");
      router.push(`/book-a-trip/?edit=${encodeURIComponent(cloned.id)}`);
    } catch (err) {
      toastError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Không tái sử dụng được",
      );
    } finally {
      setReuseBusy(false);
    }
  }

  return (
    <article className={listStyles.detailCard}>
      <p className={listStyles.eyebrow}>Chuyến được chia sẻ</p>
      <h2 className={listStyles.title} style={{ fontSize: "1.25rem" }}>
        <Link href={`/shared-trips/${encodeURIComponent(trip.id)}`}>
          {trip.title}
        </Link>
      </h2>
      {trip.summary ? <p className={listStyles.sub}>{trip.summary}</p> : null}
      <p className={listStyles.meta}>
        {[
          trip.sharerDisplayName,
          formatSharedAt(trip.sharedAt),
          trip.durationDays
            ? `${trip.durationDays} ngày`
            : `${trip.itinerary?.length || 0} ngày`,
        ]
          .filter(Boolean)
          .join(" · ")}
      </p>

      {styleTags.length ? (
        <ul className={listStyles.prefsChips}>
          {styleTags.map((t) => (
            <li key={t.value}>{t.label}</li>
          ))}
        </ul>
      ) : null}

      <div className={styles.stats}>
        <span className={styles.statPill}>
          ★ {trip.avgRating.toFixed(1)} ({trip.ratingCount})
        </span>
        <span className={styles.statPill}>
          Tái sử dụng {trip.reuseCount}
        </span>
      </div>

      <div className={styles.cardActions}>
        {!trip.isOwner ? (
          <div>
            <p className={listStyles.eyebrow} style={{ marginBottom: 4 }}>
              Đánh giá của bạn
            </p>
            <StarRatingInput
              value={trip.myRating || 0}
              disabled={ratingBusy}
              onChange={(n) => void onRate(n)}
            />
          </div>
        ) : (
          <p className={listStyles.meta}>Đây là bài bạn đã chia sẻ</p>
        )}
      </div>

      <div className={styles.cardActions}>
        <Link
          href={`/shared-trips/${encodeURIComponent(trip.id)}`}
          className={listStyles.btnGhost}
        >
          Xem chi tiết
        </Link>
        <button
          type="button"
          className={listStyles.btnPrimary}
          disabled={reuseBusy}
          onClick={() => void onReuse()}
        >
          {reuseBusy ? "Đang tạo…" : "Tái sử dụng"}
        </button>
      </div>
    </article>
  );
}
