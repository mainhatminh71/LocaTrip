"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { LtBrandLoader } from "@/components/book-a-trip/LtBrandLoader";
import { StarRatingInput } from "@/components/shared-trips/StarRatingInput";
import {
  getSharedTrip,
  rateSharedTrip,
  reuseSharedTrip,
  type SharedTripDoc,
} from "@/lib/api/shared-trips";
import { ApiError } from "@/lib/api/http";
import { labelForValue } from "@/lib/auto-trip-form";
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
  const [ratingBusy, setRatingBusy] = useState(false);
  const [reuseBusy, setReuseBusy] = useState(false);

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
    return [
      trip.tripType,
      trip.targetCustomer,
      ...(trip.preferences || []).slice(0, 10),
    ]
      .filter(Boolean)
      .map((v) => labelForValue(String(v)));
  }, [trip]);

  async function onRate(rating: number) {
    if (!trip || trip.isOwner || ratingBusy) return;
    setRatingBusy(true);
    try {
      const next = await rateSharedTrip(trip.id, rating);
      setTrip(next);
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
                trip.sharerDisplayName,
                formatSharedAt(trip.sharedAt),
                trip.durationDays
                  ? `${trip.durationDays} ngày`
                  : `${trip.itinerary?.length || 0} ngày`,
                trip.pace || null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>

            {styleTags.length ? (
              <ul className={listStyles.prefsChips}>
                {styleTags.map((label) => (
                  <li key={label}>{label}</li>
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

            <div className={listStyles.actionsRow}>
              <button
                type="button"
                className={listStyles.btnPrimary}
                disabled={reuseBusy}
                onClick={() => void onReuse()}
              >
                {reuseBusy ? "Đang tạo…" : "Tái sử dụng"}
              </button>
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
