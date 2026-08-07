"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { LtBrandLoader } from "@/components/book-a-trip/LtBrandLoader";
import {
  deleteSavedTrip,
  listSavedTrips,
  resolveTripDate,
  TRIP_PROGRESS_OPTIONS,
  type SavedTrip,
  type TripProgressStatus,
} from "@/lib/api/trips";
import { ApiError } from "@/lib/api/http";
import { labelForValue } from "@/lib/auto-trip-form";
import { visitItems } from "@/lib/itinerary-map";
import { pickSavedTripPrefs } from "@/lib/saved-trip-draft";
import { BUDGET_OPTIONS, PACE_OPTIONS } from "@/lib/trip";
import { useToast } from "@/components/ui/ToastProvider";
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

function paceLabel(pace?: string) {
  return PACE_OPTIONS.find((o) => o.value === pace)?.label || pace || null;
}

function budgetLabel(budget?: string) {
  return BUDGET_OPTIONS.find((o) => o.value === budget)?.hint || budget || null;
}

function displayTitle(title: string) {
  return title.replace(/^Lộ trình\s+\d+:\s*/i, "").trim() || title;
}

function TripListCard({
  trip,
  deleting,
  onDelete,
}: {
  trip: SavedTrip;
  deleting: boolean;
  onDelete: () => void;
}) {
  const prefs = useMemo(() => pickSavedTripPrefs(trip), [trip]);
  const days =
    trip.durationDays ||
    trip.itinerary?.length ||
    0;
  const visits = useMemo(
    () =>
      (trip.itinerary || []).flatMap((day) => visitItems(day.schedule || [])),
    [trip.itinerary],
  );
  const preview = visits
    .map((v) => v.place?.title?.trim())
    .filter(Boolean)
    .slice(0, 3) as string[];
  const more = Math.max(0, visits.length - preview.length);

  const tripDate = resolveTripDate(trip);
  const tripDay = formatTripDay(tripDate);

  const progressLabel =
    TRIP_PROGRESS_OPTIONS.find((o) => o.value === trip.tripStatus)?.label ||
    null;

  const chips = [
    progressLabel,
    days > 0 ? `${days} ngày` : null,
    prefs.tripType ? labelForValue(prefs.tripType) : null,
    prefs.targetCustomer ? labelForValue(prefs.targetCustomer) : null,
    paceLabel(prefs.pace),
    budgetLabel(prefs.budgetLevel),
    prefs.isRoundTrip === true
      ? "Khứ hồi"
      : prefs.isRoundTrip === false
        ? "Một chiều"
        : null,
  ].filter(Boolean) as string[];

  const softPrefs = (prefs.preferences || [])
    .slice(0, 4)
    .map((p) => labelForValue(p));

  return (
    <li className={styles.card}>
      <div className={styles.cardTop}>
        {tripDay && tripDate ? (
          <time className={styles.cardTripDay} dateTime={tripDate}>
            Ngày đi · {tripDay}
          </time>
        ) : (
          <span className={styles.cardTripDayMuted}>Chưa có ngày đi</span>
        )}
        <time
          className={styles.cardDate}
          dateTime={trip.updatedAt || trip.createdAt}
          title="Lần cập nhật gần nhất"
        >
          {formatDate(trip.updatedAt || trip.createdAt)}
        </time>
      </div>

      <Link href={`/my-trips/${trip.id}/`} className={styles.cardTitle}>
        {displayTitle(trip.title)}
      </Link>

      {chips.length > 0 ? (
        <ul className={styles.metaChips}>
          {chips.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      ) : (
        <p className={styles.meta}>
          {days > 0 ? `${days} ngày` : "Lịch trình"}
          {trip.pace ? ` · ${paceLabel(trip.pace) || trip.pace}` : ""}
        </p>
      )}

      {preview.length > 0 ? (
        <ol className={styles.stopPreview}>
          {preview.map((title) => (
            <li key={title}>{title}</li>
          ))}
          {more > 0 ? (
            <li className={styles.stopMore}>+{more} điểm nữa</li>
          ) : null}
        </ol>
      ) : trip.summary ? (
        <p className={styles.summary}>{trip.summary}</p>
      ) : null}

      {softPrefs.length > 0 ? (
        <p className={styles.softLine}>
          Sở thích: {softPrefs.join(" · ")}
          {(prefs.preferences?.length || 0) > softPrefs.length ? "…" : ""}
        </p>
      ) : null}

      {trip.totalEstimatedCost != null && trip.totalEstimatedCost !== "" ? (
        <p className={styles.cost}>{String(trip.totalEstimatedCost)}</p>
      ) : null}

      <div className={styles.cardActions}>
        <Link
          href={`/book-a-trip/?edit=${encodeURIComponent(trip.id)}`}
          className={styles.btnPrimary}
        >
          Bản đồ
        </Link>
        <Link href={`/my-trips/${trip.id}/`} className={styles.btnGhost}>
          Xem
        </Link>
        <button
          type="button"
          className={styles.btnDanger}
          disabled={deleting}
          onClick={onDelete}
        >
          {deleting ? "Đang xóa…" : "Xóa"}
        </button>
      </div>
    </li>
  );
}

type StatusFilter = "all" | TripProgressStatus;

function MyTripsInner() {
  const PAGE_SIZE = 3;
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SavedTrip | null>(null);
  const { toastSuccess, toastError } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listSavedTrips("active");
      setTrips(list);
      setPage(1);
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

  const filteredTrips = useMemo(() => {
    if (statusFilter === "all") return trips;
    return trips.filter((t) => t.tripStatus === statusFilter);
  }, [trips, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredTrips.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageTrips = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredTrips.slice(start, start + PAGE_SIZE);
  }, [filteredTrips, safePage]);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  async function confirmDelete() {
    if (!pendingDelete) return;
    const id = pendingDelete.id;
    setDeletingId(id);
    setError(null);
    try {
      await deleteSavedTrip(id);
      setTrips((prev) => {
        const next = prev.filter((t) => t.id !== id);
        const nextPages = Math.max(1, Math.ceil(next.length / PAGE_SIZE));
        setPage((p) => Math.min(p, nextPages));
        return next;
      });
      setPendingDelete(null);
      toastSuccess("Đã xóa chuyến đi.");
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Không xóa được";
      setError(msg);
      toastError(msg);
    } finally {
      setDeletingId(null);
    }
  }

  const rangeStart =
    filteredTrips.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(safePage * PAGE_SIZE, filteredTrips.length);

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <header className={styles.head}>
          <div>
            <p className={styles.eyebrow}>Chuyến đi</p>
            <h1 className={styles.title}>Chuyến đi của tôi</h1>
            <p className={styles.sub}>
              Lịch trình đã lưu — xem lại tiêu chí, điểm dừng hoặc tạo lại.
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
            <p className={styles.emptyTitle}>Chưa có chuyến đi nào</p>
            <p>
              Tạo lịch trên Book a trip rồi tạo nháp — danh sách sẽ hiện tại đây.
            </p>
            <Link href="/book-a-trip/" className={styles.btnPrimary}>
              Tạo chuyến đi đầu tiên
            </Link>
          </div>
        ) : null}

        {!loading && trips.length > 0 ? (
          <>
            <div
              className={styles.statusTabs}
              role="tablist"
              aria-label="Lọc theo trạng thái"
            >
              <button
                type="button"
                role="tab"
                aria-selected={statusFilter === "all"}
                className={
                  statusFilter === "all"
                    ? styles.statusTabOn
                    : styles.statusTab
                }
                onClick={() => setStatusFilter("all")}
              >
                Tất cả
              </button>
              {TRIP_PROGRESS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="tab"
                  aria-selected={statusFilter === opt.value}
                  className={
                    statusFilter === opt.value
                      ? styles.statusTabOn
                      : styles.statusTab
                  }
                  onClick={() => setStatusFilter(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {filteredTrips.length === 0 ? (
              <div className={styles.empty}>
                <p className={styles.emptyTitle}>Không có chuyến ở mục này</p>
                <p>Thử tab khác hoặc tạo nháp từ Book a trip.</p>
              </div>
            ) : null}

            <ul className={styles.list}>
              {pageTrips.map((trip) => (
                <TripListCard
                  key={trip.id}
                  trip={trip}
                  deleting={deletingId === trip.id}
                  onDelete={() => setPendingDelete(trip)}
                />
              ))}
            </ul>

            <nav className={styles.pagination} aria-label="Phân trang chuyến đi">
              <p className={styles.pageInfo}>
                {rangeStart}–{rangeEnd} / {filteredTrips.length} chuyến
              </p>
              <div className={styles.pageControls}>
                <button
                  type="button"
                  className={styles.pageBtn}
                  disabled={safePage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Trước
                </button>
                <ul className={styles.pageNumbers}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (n) => (
                      <li key={n}>
                        <button
                          type="button"
                          className={
                            n === safePage
                              ? `${styles.pageNum} ${styles.pageNumActive}`
                              : styles.pageNum
                          }
                          aria-current={n === safePage ? "page" : undefined}
                          onClick={() => setPage(n)}
                        >
                          {n}
                        </button>
                      </li>
                    ),
                  )}
                </ul>
                <button
                  type="button"
                  className={styles.pageBtn}
                  disabled={safePage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Sau
                </button>
              </div>
            </nav>
          </>
        ) : null}
      </div>

      {pendingDelete ? (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onClick={() => {
            if (!deletingId) setPendingDelete(null);
          }}
        >
          <div
            className={styles.modalCard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-trip-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="delete-trip-title" className={styles.modalTitle}>
              Xóa chuyến đi?
            </h2>
            <p className={styles.modalBody}>
              Bạn sắp xóa “
              {pendingDelete.title.replace(/^Lộ trình\s+\d+:\s*/i, "").trim() ||
                pendingDelete.title}
              ”. Thao tác này không hoàn tác được.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.btnGhost}
                disabled={Boolean(deletingId)}
                onClick={() => setPendingDelete(null)}
              >
                Hủy
              </button>
              <button
                type="button"
                className={styles.btnDanger}
                disabled={Boolean(deletingId)}
                onClick={() => void confirmDelete()}
              >
                {deletingId ? "Đang xóa…" : "Xóa chuyến đi"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
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
