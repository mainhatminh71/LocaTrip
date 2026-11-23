"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { SharedTripDoc } from "@/lib/api/shared-trips";
import { reuseSharedTrip, unshareSharedTrip } from "@/lib/api/shared-trips";
import { ApiError } from "@/lib/api/http";
import {
  sharedStyleChips,
  sharedStyleChipText,
} from "@/lib/shared-trip-labels";
import { useToast } from "@/components/ui/ToastProvider";
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
  onRemoved?: (id: string) => void;
};

export function SharedTripCard({ trip, onRemoved }: Props) {
  const router = useRouter();
  const { toastSuccess, toastError } = useToast();
  const [reuseBusy, setReuseBusy] = useState(false);
  const [unshareBusy, setUnshareBusy] = useState(false);

  const styleTags = useMemo(
    () =>
      sharedStyleChips({
        tripType: trip.tripType,
        targetCustomer: trip.targetCustomer,
        preferences: trip.preferences,
        limit: 8,
      }),
    [trip],
  );

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

  async function onUnshare() {
    if (unshareBusy) return;
    const ok = window.confirm(
      "Thu hồi chuyến này khỏi trang cộng đồng? Người khác sẽ không còn thấy.",
    );
    if (!ok) return;
    setUnshareBusy(true);
    try {
      await unshareSharedTrip(trip.id);
      toastSuccess("Đã thu hồi chuyến khỏi cộng đồng");
      onRemoved?.(trip.id);
    } catch (err) {
      toastError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Không thu hồi được",
      );
    } finally {
      setUnshareBusy(false);
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
          `Người chia sẻ: ${trip.sharerDisplayName}`,
          `Ngày share: ${formatSharedAt(trip.sharedAt)}`,
          trip.durationDays
            ? `Thời lượng: ${trip.durationDays} ngày`
            : `Thời lượng: ${trip.itinerary?.length || 0} ngày`,
        ].join(" · ")}
      </p>

      {styleTags.length ? (
        <div className={styles.tagBlock}>
          <p className={styles.tagBlockLabel}>Phong cách chuyến đi</p>
          <ul className={listStyles.prefsChips}>
            {styleTags.map((t) => (
              <li key={t.key} title={sharedStyleChipText(t)}>
                <span className={styles.tagGroup}>{t.group}</span>
                <span className={styles.tagValue}>{t.label}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className={styles.stats}>
        <span className={styles.statPill}>
          Đã tái sử dụng: {trip.reuseCount}
        </span>
        {trip.isOwner ? (
          <span className={styles.statPill}>Bài của bạn</span>
        ) : null}
      </div>

      <div className={styles.cardActions}>
        <Link
          href={`/shared-trips/${encodeURIComponent(trip.id)}`}
          className={listStyles.btnGhost}
        >
          Xem chi tiết
        </Link>
        {trip.isOwner ? (
          <button
            type="button"
            className={listStyles.btnDanger}
            disabled={unshareBusy}
            onClick={() => void onUnshare()}
          >
            {unshareBusy ? "Đang thu hồi…" : "Thu hồi"}
          </button>
        ) : (
          <button
            type="button"
            className={listStyles.btnPrimary}
            disabled={reuseBusy}
            onClick={() => void onReuse()}
          >
            {reuseBusy ? "Đang tạo…" : "Tái sử dụng"}
          </button>
        )}
      </div>
    </article>
  );
}
