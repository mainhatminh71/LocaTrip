"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { LtBrandLoader } from "@/components/book-a-trip/LtBrandLoader";
import { SharedTripCard } from "@/components/shared-trips/SharedTripCard";
import {
  listSharedTrips,
  type SharedTripDoc,
} from "@/lib/api/shared-trips";
import { ApiError } from "@/lib/api/http";
import {
  FORM_ATMOSPHERE_OPTIONS,
  FORM_TRIP_TYPE_OPTIONS,
  FORM_TARGET_CUSTOMER_OPTIONS,
} from "@/lib/auto-trip-form";
import listStyles from "../my-trips/my-trips.module.css";
import styles from "./shared-trips.module.css";

const FILTER_GROUPS = [
  { title: "Loại chuyến", options: FORM_TRIP_TYPE_OPTIONS },
  { title: "Đối tượng đi", options: FORM_TARGET_CUSTOMER_OPTIONS },
  {
    title: "Không khí",
    options: FORM_ATMOSPHERE_OPTIONS.slice(0, 6),
  },
] as const;

function SharedTripsInner() {
  const [items, setItems] = useState<SharedTripDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [sharer, setSharer] = useState("");
  const [sharedFrom, setSharedFrom] = useState("");
  const [sharedTo, setSharedTo] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const query = useMemo(
    () => ({
      title: title.trim() || undefined,
      sharer: sharer.trim() || undefined,
      sharedFrom: sharedFrom || undefined,
      sharedTo: sharedTo || undefined,
      tags: tags.length ? tags : undefined,
    }),
    [title, sharer, sharedFrom, sharedTo, tags],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rows = await listSharedTrips(query);
      setItems(rows);
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
  }, [query]);

  useEffect(() => {
    const t = window.setTimeout(() => {
      void load();
    }, 250);
    return () => window.clearTimeout(t);
  }, [load]);

  function toggleTag(value: string) {
    setTags((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value],
    );
  }

  return (
    <main className={listStyles.page}>
      <div className={listStyles.wrap}>
        <header className={listStyles.head}>
          <div>
            <p className={listStyles.eyebrow}>Cộng đồng</p>
            <h1 className={listStyles.title}>Chuyến được chia sẻ</h1>
            <p className={listStyles.sub}>
              Xem lịch trình cộng đồng đăng — tái sử dụng về chuyến của bạn.
              Bài càng được tái sử dụng nhiều càng lên đầu.
            </p>
          </div>
          <Link href="/my-trips/" className={listStyles.btnGhost}>
            Chuyến của tôi
          </Link>
        </header>

        <section className={styles.filters} aria-label="Bộ lọc">
          <div className={styles.filterRow}>
            <div className={styles.filterField}>
              <label htmlFor="st-title">Lọc theo tên chuyến đi</label>
              <input
                id="st-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Đà Lạt 3 ngày"
              />
            </div>
            <div className={styles.filterField}>
              <label htmlFor="st-sharer">Lọc theo người chia sẻ</label>
              <input
                id="st-sharer"
                value={sharer}
                onChange={(e) => setSharer(e.target.value)}
                placeholder="Tên hoặc email người đăng"
              />
            </div>
          </div>
          <div className={styles.filterRow}>
            <div className={styles.filterField}>
              <label htmlFor="st-from">Ngày chia sẻ — từ ngày</label>
              <input
                id="st-from"
                type="date"
                value={sharedFrom}
                onChange={(e) => setSharedFrom(e.target.value)}
              />
            </div>
            <div className={styles.filterField}>
              <label htmlFor="st-to">Ngày chia sẻ — đến ngày</label>
              <input
                id="st-to"
                type="date"
                value={sharedTo}
                onChange={(e) => setSharedTo(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.filterField}>
            <label>Lọc theo phong cách</label>
            {FILTER_GROUPS.map((group) => (
              <div key={group.title}>
                <p className={styles.filterGroupTitle}>{group.title}</p>
                <div className={styles.tagWrap}>
                  {group.options.map((opt) => {
                    const on = tags.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        className={
                          on
                            ? `${styles.tagChip} ${styles.tagChipOn}`
                            : styles.tagChip
                        }
                        aria-pressed={on}
                        title={`${group.title}: ${opt.label}`}
                        onClick={() => toggleTag(opt.value)}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {loading ? (
          <div className={listStyles.center}>
            <LtBrandLoader size="lg" tone="onLight" label="Đang tải…" />
          </div>
        ) : null}

        {error ? <p className={listStyles.error}>{error}</p> : null}

        {!loading && !error && items.length === 0 ? (
          <div className={listStyles.empty}>
            <p>Chưa có chuyến nào được chia sẻ.</p>
            <p>Mở chuyến của bạn và bấm “Chia sẻ chuyến đi”.</p>
            <Link href="/my-trips/" className={listStyles.btnPrimary}>
              Tới chuyến của tôi
            </Link>
          </div>
        ) : null}

        <div style={{ display: "grid", gap: "1rem" }}>
          {items.map((trip) => (
            <SharedTripCard
              key={trip.id}
              trip={trip}
              onRemoved={(id) =>
                setItems((prev) => prev.filter((p) => p.id !== id))
              }
            />
          ))}
        </div>
      </div>
    </main>
  );
}

export default function SharedTripsPage() {
  return (
    <MarketingChrome>
      <RequireAuth>
        <SharedTripsInner />
      </RequireAuth>
    </MarketingChrome>
  );
}
