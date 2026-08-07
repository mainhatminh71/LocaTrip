"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { LtBrandLoader } from "@/components/book-a-trip/LtBrandLoader";
import {
  deleteSavedTrip,
  listSavedTrips,
  type SavedTrip,
} from "@/lib/api/trips";
import { ApiError } from "@/lib/api/http";
import styles from "./my-trips.module.css";

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function MyTripsInner() {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listSavedTrips("active");
      setTrips(list);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Không tải được danh sách",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function onDelete(id: string) {
    if (!window.confirm("Xóa chuyến đi này?")) return;
    setDeletingId(id);
    try {
      await deleteSavedTrip(id);
      setTrips((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Không xóa được",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <header className={styles.head}>
          <div>
            <p className={styles.eyebrow}>Chuyến đi</p>
            <h1 className={styles.title}>Chuyến đi của tôi</h1>
            <p className={styles.sub}>
              Các lịch trình đã lưu sau khi tạo trên LocaTrip.
            </p>
          </div>
          <Link href="/book-a-trip/" className={styles.btnPrimary}>
            Tạo chuyến đi
          </Link>
        </header>

        {loading ? (
          <div className={styles.center}>
            <LtBrandLoader size="lg" tone="onLight" label="Đang tải…" />
          </div>
        ) : null}

        {error ? <p className={styles.error}>{error}</p> : null}

        {!loading && !error && trips.length === 0 ? (
          <div className={styles.empty}>
            <p>Chưa có chuyến đi nào.</p>
            <Link href="/book-a-trip/" className={styles.btnPrimary}>
              Tạo chuyến đi đầu tiên
            </Link>
          </div>
        ) : null}

        {!loading && trips.length > 0 ? (
          <ul className={styles.list}>
            {trips.map((trip) => (
              <li key={trip.id} className={styles.card}>
                <div className={styles.cardBody}>
                  <Link
                    href={`/my-trips/${trip.id}/`}
                    className={styles.cardTitle}
                  >
                    {trip.title}
                  </Link>
                  <p className={styles.meta}>
                    {trip.durationDays
                      ? `${trip.durationDays} ngày`
                      : `${trip.itinerary?.length || 0} ngày`}
                    {trip.pace ? ` · ${trip.pace}` : ""}
                    {" · "}
                    {formatDate(trip.updatedAt || trip.createdAt)}
                  </p>
                  {trip.summary ? (
                    <p className={styles.summary}>{trip.summary}</p>
                  ) : null}
                </div>
                <div className={styles.cardActions}>
                  <Link
                    href={`/my-trips/${trip.id}/`}
                    className={styles.btnGhost}
                  >
                    Xem
                  </Link>
                  <button
                    type="button"
                    className={styles.btnDanger}
                    disabled={deletingId === trip.id}
                    onClick={() => void onDelete(trip.id)}
                  >
                    {deletingId === trip.id ? "Đang xóa…" : "Xóa"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </main>
  );
}

export default function MyTripsPage() {
  return (
    <MarketingChrome hideConversion>
      <RequireAuth nextPath="/my-trips/">
        <MyTripsInner />
      </RequireAuth>
    </MarketingChrome>
  );
}
