"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { LtBrandLoader } from "@/components/book-a-trip/LtBrandLoader";
import { getSavedTrip, type SavedTrip } from "@/lib/api/trips";
import { ApiError } from "@/lib/api/http";
import styles from "../my-trips.module.css";

function TripDetailInner() {
  const params = useParams();
  const tripId = String(params.tripId || "");
  const [trip, setTrip] = useState<SavedTrip | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tripId) return;
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSavedTrip(tripId);
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
  }, [tripId]);

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <Link href="/my-trips/" className={styles.btnGhost}>
          ← Danh sách
        </Link>

        {loading ? (
          <div className={styles.center}>
            <LtBrandLoader size="lg" tone="onLight" label="Đang tải…" />
          </div>
        ) : null}

        {error ? <p className={styles.error}>{error}</p> : null}

        {trip ? (
          <article className={styles.detailCard}>
            <p className={styles.eyebrow}>Đã lưu</p>
            <h1 className={styles.title}>{trip.title}</h1>
            {trip.summary ? <p className={styles.sub}>{trip.summary}</p> : null}
            <p className={styles.meta}>
              {trip.durationDays
                ? `${trip.durationDays} ngày`
                : `${trip.itinerary?.length || 0} ngày`}
              {trip.pace ? ` · ${trip.pace}` : ""}
              {trip.source ? ` · ${trip.source}` : ""}
            </p>

            {(trip.itinerary || []).map((day) => (
              <section key={day.day} className={styles.dayBlock}>
                <h2>Ngày {day.day}</h2>
                <ul>
                  {(day.schedule || []).map((item, i) => (
                    <li key={`${day.day}-${i}`}>
                      <span className={styles.time}>{item.time}</span>
                      {item.type === "travel" ? (
                        <span className={styles.travel}>
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

            <div className={styles.actionsRow}>
              <Link href="/book-a-trip/" className={styles.btnPrimary}>
                Tạo chuyến mới
              </Link>
              <Link href="/my-trips/" className={styles.btnGhost}>
                Về danh sách
              </Link>
            </div>
          </article>
        ) : null}
      </div>
    </main>
  );
}

export default function MyTripDetailPage() {
  const params = useParams();
  const tripId = String(params.tripId || "");
  return (
    <MarketingChrome hideConversion>
      <RequireAuth nextPath={`/my-trips/${tripId}/`}>
        <TripDetailInner />
      </RequireAuth>
    </MarketingChrome>
  );
}
