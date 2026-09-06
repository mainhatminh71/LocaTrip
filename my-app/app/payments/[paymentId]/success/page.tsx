"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { LtBrandLoader } from "@/components/book-a-trip/LtBrandLoader";
import {
  formatVnd,
  getPayment,
  paymentStatusLabel,
  type Payment,
} from "@/lib/api/payments";
import { ApiError } from "@/lib/api/http";
import styles from "../../payments.module.css";

function formatWhen(iso?: string) {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function PaymentSuccessInner() {
  const params = useParams();
  const paymentId = String(params.paymentId || "");
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!paymentId) return;
    try {
      const data = await getPayment(paymentId);
      setPayment(data.payment);
      setError(null);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Không tải được thanh toán",
      );
    } finally {
      setLoading(false);
    }
  }, [paymentId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <main className={styles.page}>
        <div className={styles.center}>
          <LtBrandLoader size="lg" tone="onLight" label="Đang tải…" />
        </div>
      </main>
    );
  }

  if (error || !payment) {
    return (
      <main className={styles.page}>
        <div className={styles.wrap}>
          <p className={styles.error}>{error || "Không tìm thấy"}</p>
          <Link href="/payments/" className={styles.btnGhost}>
            Về lịch sử
          </Link>
        </div>
      </main>
    );
  }

  const isPaid = payment.status === "paid";
  const paidAt = formatWhen(payment.paidAt);

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <div className={`${styles.panel} ${styles.successPanel}`}>
          <div
            className={isPaid ? styles.successIcon : styles.successIconMuted}
            aria-hidden="true"
          >
            {isPaid ? "✓" : "!"}
          </div>
          <p className={styles.eyebrow}>Thanh toán</p>
          <h1 className={styles.title}>
            {isPaid ? "Thanh toán thành công" : "Trạng thái thanh toán"}
          </h1>
          <p className={styles.sub}>
            {isPaid
              ? "Đã ghi nhận chuyển khoản. Cảm ơn bạn đã thanh toán trên LocaTrip."
              : `Đơn hiện đang: ${paymentStatusLabel(payment.status)}.`}
          </p>

          <dl className={styles.dl}>
            <div>
              <dt>Số tiền</dt>
              <dd>{formatVnd(payment.amount)}</dd>
            </div>
            <div>
              <dt>Mã CK</dt>
              <dd className={styles.code}>{payment.code}</dd>
            </div>
            <div>
              <dt>Mã đơn</dt>
              <dd>{payment.orderCode}</dd>
            </div>
            <div>
              <dt>Trạng thái</dt>
              <dd>{paymentStatusLabel(payment.status)}</dd>
            </div>
            {paidAt ? (
              <div>
                <dt>Thanh toán lúc</dt>
                <dd>{paidAt}</dd>
              </div>
            ) : null}
            {payment.note ? (
              <div>
                <dt>Ghi chú</dt>
                <dd>{payment.note}</dd>
              </div>
            ) : null}
          </dl>

          <div className={styles.actions}>
            <Link href="/payments/" className={styles.btnPrimary}>
              Về lịch sử giao dịch
            </Link>
            {!isPaid ? (
              <Link
                href={`/payments/${payment.paymentId}/`}
                className={styles.btnGhost}
              >
                Xem chi tiết đơn
              </Link>
            ) : null}
            <Link href="/my-trips/" className={styles.btnGhost}>
              Chuyến đi của tôi
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  const params = useParams();
  const paymentId = String(params.paymentId || "");
  return (
    <MarketingChrome hideConversion>
      <RequireAuth nextPath={`/payments/${paymentId}/success/`}>
        <PaymentSuccessInner />
      </RequireAuth>
    </MarketingChrome>
  );
}
