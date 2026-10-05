"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Map, Wallet } from "lucide-react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { LtBrandLoader } from "@/components/book-a-trip/LtBrandLoader";
import {
  formatVnd,
  getPayment,
  paymentStatusLabel,
  type Payment,
} from "@/lib/api/payments";
import { xuFromVnd } from "@/lib/api/wallet";
import {
  BOOK_A_TRIP_RESUME_PATH,
  hasPendingGenerateResume,
} from "@/lib/auto-trip-pending";
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
  const searchParams = useSearchParams();
  const paymentId = String(params.paymentId || "");
  const returnToRaw = searchParams.get("returnTo")?.trim() || "";
  const returnTo =
    returnToRaw.startsWith("/") && !returnToRaw.startsWith("//")
      ? returnToRaw
      : hasPendingGenerateResume()
        ? BOOK_A_TRIP_RESUME_PATH
        : null;
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
  const creditedXu = xuFromVnd(payment.amount);

  return (
    <main className={styles.page}>
      <div className={styles.wrapNarrow}>
        <div className={`${styles.panel} ${styles.successPanel}`}>
          <motion.div
            className={
              isPaid ? styles.successIconRing : styles.successIconRingMuted
            }
            initial={{ scale: 0.55, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 340, damping: 16 }}
            aria-hidden="true"
          >
            {isPaid ? <Check size={28} strokeWidth={2.6} /> : "!"}
          </motion.div>
          {isPaid ? (
            <motion.p
              className={styles.successXu}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12 }}
            >
              +{creditedXu.toLocaleString("vi-VN")} xu
            </motion.p>
          ) : null}
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
            {paidAt ? (
              <div>
                <dt>Thanh toán lúc</dt>
                <dd>{paidAt}</dd>
              </div>
            ) : null}
          </dl>

          <div className={styles.actions}>
            {returnTo ? (
              <Link href={returnTo} className={styles.btnPrimary}>
                Tiếp tục tạo lịch trình
              </Link>
            ) : (
              <Link href="/book-a-trip/" className={styles.btnPrimary}>
                Tạo chuyến đi
              </Link>
            )}
            <Link href="/wallet/" className={styles.btnGhost}>
              <Wallet size={16} />
              Về ví xu
            </Link>
            <Link href="/my-trips/" className={styles.btnGhost}>
              <Map size={16} />
              Chuyến đi của tôi
            </Link>
            {!isPaid ? (
              <Link
                href={`/payments/${payment.paymentId}/`}
                className={styles.btnGhost}
              >
                Xem chi tiết đơn
              </Link>
            ) : null}
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
        <Suspense
          fallback={
            <main className={styles.page}>
              <div className={styles.center}>
                <LtBrandLoader size="lg" tone="onLight" label="Đang tải…" />
              </div>
            </main>
          }
        >
          <PaymentSuccessInner />
        </Suspense>
      </RequireAuth>
    </MarketingChrome>
  );
}
