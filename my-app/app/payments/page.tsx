"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { LtBrandLoader } from "@/components/book-a-trip/LtBrandLoader";
import {
  formatVnd,
  listPayments,
  PAYMENT_STATUS_OPTIONS,
  paymentStatusLabel,
  type Payment,
  type PaymentStatus,
} from "@/lib/api/payments";
import { ApiError } from "@/lib/api/http";
import styles from "./payments.module.css";

type StatusFilter = "all" | PaymentStatus;

function formatWhen(iso: string) {
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function badgeClass(status: PaymentStatus): string {
  if (status === "paid") return styles.badgePaid;
  if (status === "awaiting_transfer") return styles.badgeWait;
  return styles.badgeMuted;
}

function PaymentsInner() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (filter: StatusFilter) => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPayments(
        filter === "all" ? undefined : filter,
      );
      setPayments(data.payments);
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Không tải được lịch sử";
      setError(msg);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(statusFilter);
  }, [load, statusFilter]);

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <header className={styles.head}>
          <div>
            <p className={styles.eyebrow}>Thanh toán</p>
            <h1 className={styles.title}>Lịch sử giao dịch</h1>
            <p className={styles.sub}>
              Các lần thanh toán của bạn trên LocaTrip — không phải sao kê tài
              khoản ngân hàng.
            </p>
          </div>
          <Link href="/payments/new" className={styles.btnPrimary}>
            Tạo thanh toán
          </Link>
        </header>

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
              statusFilter === "all" ? styles.statusTabOn : styles.statusTab
            }
            onClick={() => setStatusFilter("all")}
          >
            Tất cả
          </button>
          {PAYMENT_STATUS_OPTIONS.map((opt) => (
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

        {loading ? (
          <div className={styles.center}>
            <LtBrandLoader size="lg" tone="onLight" label="Đang tải…" />
          </div>
        ) : null}

        {error ? (
          <div className={styles.errorBox}>
            <p className={styles.error}>{error}</p>
            <button
              type="button"
              className={styles.btnGhost}
              onClick={() => void load(statusFilter)}
            >
              Thử lại
            </button>
          </div>
        ) : null}

        {!loading && !error && payments.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>
              {statusFilter === "all"
                ? "Chưa có giao dịch"
                : "Không có giao dịch ở mục này"}
            </p>
            <p>
              {statusFilter === "all"
                ? "Tạo thanh toán đầu tiên để nhận mã QR / link chuyển khoản."
                : "Thử tab khác hoặc tạo thanh toán mới."}
            </p>
            <Link href="/payments/new" className={styles.btnPrimary}>
              Tạo thanh toán
            </Link>
          </div>
        ) : null}

        {!loading && !error && payments.length > 0 ? (
          <ul className={styles.list}>
            {payments.map((p) => (
              <li key={p.paymentId}>
                <Link
                  href={`/payments/${p.paymentId}`}
                  className={styles.card}
                >
                  <div className={styles.cardTop}>
                    <p className={styles.amount}>{formatVnd(p.amount)}</p>
                    <span className={badgeClass(p.status)}>
                      {paymentStatusLabel(p.status)}
                    </span>
                  </div>
                  <p className={styles.meta}>
                    Mã <span className={styles.code}>{p.code}</span>
                    {" · "}
                    {formatWhen(p.createdAt)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </main>
  );
}

export default function PaymentsPage() {
  return (
    <MarketingChrome hideConversion>
      <RequireAuth nextPath="/payments/">
        <PaymentsInner />
      </RequireAuth>
    </MarketingChrome>
  );
}
