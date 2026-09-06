"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { LtBrandLoader } from "@/components/book-a-trip/LtBrandLoader";
import { TripWeatherAdvisoryWidget } from "@/components/weather/TripWeatherAdvisoryWidget";
import {
  getSavedTrip,
  resolveTripDate,
  TRIP_PROGRESS_OPTIONS,
  type SavedTrip,
} from "@/lib/api/trips";
import { ApiError } from "@/lib/api/http";
import { labelForValue } from "@/lib/auto-trip-form";
import { pickSavedTripPrefs } from "@/lib/saved-trip-draft";
import { BUDGET_OPTIONS, PACE_OPTIONS } from "@/lib/trip";
import styles from "../my-trips.module.css";

function formatTripDay(ymd?: string) {
  if (!ymd || !/^\d{4}-\d{2}-\d{2}/.test(ymd)) return null;
  try {
    const [y, m, d] = ymd.slice(0, 10).split("-").map(Number);
    return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium" }).format(
      new Date(y!, (m ?? 1) - 1, d),
    );
  } catch {
    return ymd.slice(0, 10);
  }
}

function PrefsSummary({ trip }: { trip: SavedTrip }) {
  const prefs = useMemo(() => pickSavedTripPrefs(trip), [trip]);
  const chips: string[] = [];

  if (prefs.tripType) chips.push(labelForValue(prefs.tripType));
  if (prefs.targetCustomer) chips.push(labelForValue(prefs.targetCustomer));
  if (prefs.pace) {
    chips.push(
      `Nhịp: ${PACE_OPTIONS.find((o) => o.value === prefs.pace)?.label || prefs.pace}`,
    );
  }
  if (prefs.budgetLevel) {
    chips.push(
      `Ngân sách: ${BUDGET_OPTIONS.find((o) => o.value === prefs.budgetLevel)?.hint || prefs.budgetLevel}`,
    );
  }
  if (prefs.isRoundTrip != null) {
    chips.push(prefs.isRoundTrip ? "Khứ hồi" : "Một chiều");
  }
  if (prefs.startTimePerDay && prefs.endTimePerDay) {
    chips.push(`${prefs.startTimePerDay}–${prefs.endTimePerDay}`);
  }
  if (prefs.radiusKm != null) chips.push(`Bán kính ${prefs.radiusKm} km`);
  if (prefs.maxDistance != null) {
    chips.push(`Khoảng cách điểm ≤ ${prefs.maxDistance} km`);
  }
  const soft = (prefs.preferences || [])
    .slice(0, 8)
    .map((p) => labelForValue(p));

  if (!chips.length && !soft.length) return null;

  return (
    <div className={styles.prefsBlock}>
      <h2 className={styles.prefsTitle}>Tiêu chí đã lưu</h2>
      {chips.length ? (
        <ul className={styles.prefsChips}>
          {chips.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      ) : null}
      {soft.length ? (
        <p className={styles.prefsSoft}>{soft.join(" · ")}</p>
      ) : null}
    </div>
  );
}

function resolveWeatherCoords(trip: SavedTrip): {
  latitude: number;
  longitude: number;
} | null {
  const prefs = pickSavedTripPrefs(trip);
  const candidates = [
    prefs.startCoords,
    trip.startCoords,
    trip.startLatitude != null && trip.startLongitude != null
      ? { latitude: trip.startLatitude, longitude: trip.startLongitude }
      : null,
  ];
  for (const c of candidates) {
    if (
      c &&
      Number.isFinite(Number(c.latitude)) &&
      Number.isFinite(Number(c.longitude))
    ) {
      return { latitude: Number(c.latitude), longitude: Number(c.longitude) };
    }
  }
  // First place with coords on day 1
  for (const day of trip.itinerary || []) {
    for (const item of day.schedule || []) {
      if (item.type === "visit" && item.place) {
        const lat = Number(item.place.latitude);
        const lng = Number(item.place.longitude);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          return { latitude: lat, longitude: lng };
        }
      }
    }
  }
  return null;
}

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

  const weatherCoords = trip ? resolveWeatherCoords(trip) : null;
  const weatherDays = Math.min(
    16,
    Math.max(1, trip?.durationDays || trip?.itinerary?.length || 1),
  );

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
              {[
                TRIP_PROGRESS_OPTIONS.find((o) => o.value === trip.tripStatus)
                  ?.label || null,
                formatTripDay(resolveTripDate(trip)),
                trip.durationDays
                  ? `${trip.durationDays} ngày`
                  : `${trip.itinerary?.length || 0} ngày`,
                trip.pace || null,
                trip.source || null,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>

            <PrefsSummary trip={trip} />

            {weatherCoords ? (
              <TripWeatherAdvisoryWidget
                latitude={weatherCoords.latitude}
                longitude={weatherCoords.longitude}
                date={resolveTripDate(trip) || null}
                days={weatherDays}
              />
            ) : null}

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
              <Link
                href={`/book-a-trip/?edit=${encodeURIComponent(trip.id)}`}
                className={styles.btnPrimary}
              >
                Xem và chỉnh sửa
              </Link>
              <Link href="/my-trips/" className={styles.btnGhost}>
                Quay lại
              </Link>
            </div>
          </article>
        ) : null}
      </div>
    </main>
  );
}

export default function TripDetailPage() {
  return (
    <MarketingChrome>
      <RequireAuth>
        <TripDetailInner />
      </RequireAuth>
    </MarketingChrome>
  );
}
