"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { LtBrandLoader } from "@/components/book-a-trip/LtBrandLoader";
import {
  getSharedTrip,
  reuseSharedTrip,
  unshareSharedTrip,
  type SharedTripDoc,
} from "@/lib/api/shared-trips";
import { ApiError } from "@/lib/api/http";
import {
  sharedStyleChips,
  sharedStyleChipText,
} from "@/lib/shared-trip-labels";
import { useToast } from "@/components/ui/ToastProvider";
import listStyles from "../../my-trips/my-trips.module.css";
import styles from "../shared-trips.module.css";

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

function SharedTripDetailInner() {
  const params = useParams();
  const sharedId = String(params.id || "");
  const router = useRouter();
  const { toastSuccess, toastError } = useToast();
  const [trip, setTrip] = useState<SharedTripDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reuseBusy, setReuseBusy] = useState(false);
  const [unshareBusy, setUnshareBusy] = useState(false);

  useEffect(() => {
    if (!sharedId) return;
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSharedTrip(sharedId);
        if (!cancelled) setTrip(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : err instanceof Error
                ? err.message
                : "Không tải được chuyến đi",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sharedId]);

  const styleTags = useMemo(() => {
    if (!trip) return [];
    return sharedStyleChips({
      tripType: trip.tripType,
      targetCustomer: trip.targetCustomer,
      preferences: trip.preferences,
      limit: 12,
    });
  }, [trip]);

  async function onReuse() {
    if (!trip || reuseBusy) return;
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
    if (!trip || unshareBusy) return;
    const ok = window.confirm(
      "Thu hồi chuyến này khỏi trang cộng đồng? Người khác sẽ không còn thấy.",
    );
    if (!ok) return;
    setUnshareBusy(true);
    try {
      await unshareSharedTrip(trip.id);
      toastSuccess("Đã thu hồi chuyến khỏi cộng đồng");
      router.push("/shared-trips/");
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
    <main className={listStyles.page}>
      <div className={listStyles.wrap}>
        <Link href="/shared-trips/" className={listStyles.btnGhost}>
          ← Danh sách cộng đồng
        </Link>

        {loading ? (
          <div className={listStyles.center}>
            <LtBrandLoader size="lg" tone="onLight" label="Đang tải…" />
          </div>
        ) : null}
        {error ? <p className={listStyles.error}>{error}</p> : null}

        {trip ? (
          <article className={listStyles.detailCard}>
            <p className={listStyles.eyebrow}>Chuyến được chia sẻ</p>
            <h1 className={listStyles.title}>{trip.title}</h1>
            {trip.summary ? (
              <p className={listStyles.sub}>{trip.summary}</p>
            ) : null}
            <p className={listStyles.meta}>
              {[
                `Người chia sẻ: ${trip.sharerDisplayName}`,
                `Ngày share: ${formatSharedAt(trip.sharedAt)}`,
                trip.durationDays
                  ? `Thời lượng: ${trip.durationDays} ngày`
                  : `Thời lượng: ${trip.itinerary?.length || 0} ngày`,
                trip.pace ? `Nhịp độ: ${trip.pace}` : null,
              ]
                .filter(Boolean)
                .join(" · ")}
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

            {(trip.itinerary || []).map((day) => (
              <section key={day.day} className={listStyles.dayBlock}>
                <h2>Ngày {day.day}</h2>
                <ul>
                  {(day.schedule || []).map((item, i) => (
                    <li key={`${day.day}-${i}`}>
                      <span className={listStyles.time}>{item.time}</span>
                      {item.type === "travel" ? (
                        <span className={listStyles.travel}>
                          Di chuyển
                          {item.durationMin != null
                            ? ` · ${item.durationMin} phút`
                            : ""}
                          {item.instruction ? ` — ${item.instruction}` : ""}
                        </span>
                      ) : (
                        <span>
                          <strong>{item.place?.title || "Địa điểm"}</strong>
                          {item.place?.address
                            ? ` — ${item.place.address}`
                            : ""}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <div className={listStyles.actionsRow}>
              {trip.isOwner ? (
                <button
                  type="button"
                  className={listStyles.btnDanger}
                  disabled={unshareBusy}
                  onClick={() => void onUnshare()}
                >
                  {unshareBusy ? "Đang thu hồi…" : "Thu hồi chuyến"}
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
              <Link href="/shared-trips/" className={listStyles.btnGhost}>
                Quay lại
              </Link>
            </div>
          </article>
        ) : null}
      </div>
    </main>
  );
}

export default function SharedTripDetailPage() {
  return (
    <MarketingChrome>
      <RequireAuth>
        <SharedTripDetailInner />
      </RequireAuth>
    </MarketingChrome>
  );
}
