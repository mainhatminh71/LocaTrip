"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { LtBrandLoader } from "@/components/book-a-trip/LtBrandLoader";
import {
  cancelPayment,
  formatVnd,
  getPayment,
  isPaymentQrImage,
  paymentStatusLabel,
  readCachedPayment,
  type Payment,
  type PaymentStatus,
} from "@/lib/api/payments";
import { ApiError } from "@/lib/api/http";
import { useToast } from "@/components/ui/ToastProvider";
import { requestWalletRefresh } from "@/lib/wallet/xu";
import styles from "../payments.module.css";

/** Poll while awaiting — BE SePay webhook flips status to paid; FE discovers via GET. */
const POLL_MS = 3000;

function resolvePaymentId(params: ReturnType<typeof useParams>): string {
  const raw = params.paymentId;
  if (typeof raw === "string" && raw && raw !== "undefined") return raw;
  if (Array.isArray(raw) && raw[0] && raw[0] !== "undefined") return raw[0];
  if (typeof window !== "undefined") {
    const m = window.location.pathname.match(/\/payments\/([^/?#]+)/);
    const id = m?.[1];
    if (id && id !== "new" && id !== "undefined") return decodeURIComponent(id);
  }
  return "";
}

function useCountdown(expiresAt?: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!expiresAt) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [expiresAt]);
  return useMemo(() => {
    if (!expiresAt) return { label: null as string | null, expired: false };
    const ms = new Date(expiresAt).getTime() - now;
    if (ms <= 0) return { label: "Đã hết hạn", expired: true };
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return {
      label: `${m}:${r.toString().padStart(2, "0")}`,
      expired: false,
    };
  }, [expiresAt, now]);
}

function badgeClass(status: PaymentStatus): string {
  if (status === "paid") return styles.badgePaid;
  if (status === "awaiting_transfer") return styles.badgeWait;
  return styles.badgeMuted;
}

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

function PaymentDetailInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const fromWallet = searchParams.get("from") === "wallet";
  const paymentId = resolvePaymentId(params);
  const { toastSuccess, toastError } = useToast();
  const [payment, setPayment] = useState<Payment | null>(() =>
    paymentId ? readCachedPayment(paymentId) : null,
  );
  const [loading, setLoading] = useState(!payment);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [imgBroken, setImgBroken] = useState(false);
  const waiting = payment?.status === "awaiting_transfer";
  const isPaid = payment?.status === "paid";
  const countdown = useCountdown(waiting ? payment?.expiresAt : undefined);
  const expiredRefreshDone = useRef(false);
  const celebratedPaid = useRef(false);
  const prevStatus = useRef<PaymentStatus | null>(null);

  const load = useCallback(async () => {
    if (!paymentId) {
      setError("Thiếu mã thanh toán trên URL");
      setLoading(false);
      return;
    }
    try {
      const data = await getPayment(paymentId);
      setPayment(data.payment);
      setError(null);
      setImgBroken(false);
    } catch (err) {
      const cached = readCachedPayment(paymentId);
      if (cached) {
        setPayment(cached);
        setError(null);
        return;
      }
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

  useEffect(() => {
    if (!payment || payment.status !== "awaiting_transfer") return;
    const t = setInterval(() => {
      void load();
    }, POLL_MS);
    return () => clearInterval(t);
  }, [payment, load]);

  useEffect(() => {
    if (!waiting || !countdown.expired || expiredRefreshDone.current) return;
    expiredRefreshDone.current = true;
    void load();
  }, [waiting, countdown.expired, load]);

  useEffect(() => {
    if (payment?.status === "awaiting_transfer") {
      expiredRefreshDone.current = false;
    }
  }, [payment?.status, payment?.paymentId]);

  useEffect(() => {
    if (!payment) return;
    const prev = prevStatus.current;
    prevStatus.current = payment.status;
    if (payment.status !== "paid" || celebratedPaid.current) return;
    const fromWaiting = prev === "awaiting_transfer" || prev === null;
    if (!fromWaiting && prev !== null) return;
    celebratedPaid.current = true;
    requestWalletRefresh();
    if (prev === "awaiting_transfer") {
      toastSuccess(
        fromWallet
          ? "Nạp xu thành công — số dư đã cập nhật"
          : "Thanh toán thành công — đã ghi nhận chuyển khoản",
      );
    }
  }, [payment, toastSuccess, fromWallet]);

  async function onCancel() {
    if (!payment || busy || payment.status !== "awaiting_transfer") return;
    setBusy(true);
    try {
      const { payment: next } = await cancelPayment(payment.paymentId);
      setPayment(next);
      toastSuccess("Đã hủy thanh toán");
    } catch (err) {
      toastError(err instanceof Error ? err.message : "Hủy thất bại");
    } finally {
      setBusy(false);
    }
  }

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
          <p className={styles.error}>{error || "Không tìm thấy thanh toán"}</p>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => {
                setLoading(true);
                setError(null);
                void load();
              }}
            >
              Thử lại
            </button>
            <Link
              href={fromWallet ? "/wallet" : "/payments"}
              className={styles.btnGhost}
            >
              {fromWallet ? "Về ví" : "Về lịch sử"}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const showImg =
    Boolean(payment.checkoutUrl) &&
    isPaymentQrImage(payment.checkoutUrl) &&
    !imgBroken;

  if (isPaid) {
    return (
      <main className={styles.page}>
        <div className={styles.wrap}>
          <div className={`${styles.panel} ${styles.successPanel}`}>
            <div className={styles.successIcon} aria-hidden="true">
              ✓
            </div>
            <p className={styles.eyebrow}>Thanh toán</p>
            <h1 className={styles.title}>Thanh toán thành công</h1>
            <p className={styles.sub}>
              Đã ghi nhận chuyển khoản. Cảm ơn bạn đã thanh toán trên LocaTrip.
            </p>
            <span className={badgeClass("paid")}>
              {paymentStatusLabel("paid")}
            </span>

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
              {formatWhen(payment.paidAt) ? (
                <div>
                  <dt>Thanh toán lúc</dt>
                  <dd>{formatWhen(payment.paidAt)}</dd>
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
              {fromWallet ? (
                <Link href="/wallet" className={styles.btnPrimary}>
                  Về ví xu
                </Link>
              ) : (
                <Link href="/payments" className={styles.btnPrimary}>
                  Về lịch sử giao dịch
                </Link>
              )}
              <Link href="/my-trips" className={styles.btnGhost}>
                Chuyến đi của tôi
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <header className={styles.detailHead}>
          <div>
            <p className={styles.eyebrow}>Thanh toán</p>
            <h1 className={styles.title}>{formatVnd(payment.amount)}</h1>
            <p className={styles.sub}>
              {waiting && countdown.label && !countdown.expired
                ? `Còn ${countdown.label} trước khi hết hạn`
                : paymentStatusLabel(payment.status)}
            </p>
          </div>
          <span className={badgeClass(payment.status)}>
            {paymentStatusLabel(payment.status)}
          </span>
        </header>

        <div className={styles.panel}>
          {waiting ? (
            <div className={styles.qrWrap}>
              {showImg ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={payment.checkoutUrl}
                  alt={`Mã QR thanh toán ${payment.code}`}
                  className={styles.qrImg}
                  onError={() => setImgBroken(true)}
                />
              ) : payment.checkoutUrl ? (
                <a
                  href={payment.checkoutUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.btnPrimary}
                >
                  Mở trang / ảnh QR thanh toán
                </a>
              ) : (
                <p className={styles.error}>
                  Đơn đã tạo nhưng thiếu link QR. Dùng thông tin chuyển khoản bên
                  dưới.
                </p>
              )}
              {countdown.label ? (
                <p className={styles.countdown}>
                  {countdown.expired
                    ? "Đã hết hạn — đang cập nhật trạng thái…"
                    : `Hết hạn sau ${countdown.label}`}
                </p>
              ) : null}
              <p className={styles.pollHint}>
                Đang chờ xác nhận chuyển khoản (SePay)… màn hình sẽ tự cập nhật
                khi thanh toán thành công.
              </p>
            </div>
          ) : null}

          <dl className={styles.dl}>
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
            {payment.note ? (
              <div>
                <dt>Ghi chú</dt>
                <dd>{payment.note}</dd>
              </div>
            ) : null}
            {payment.bankName ? (
              <div>
                <dt>Ngân hàng</dt>
                <dd>{payment.bankName}</dd>
              </div>
            ) : null}
            {payment.accountNo ? (
              <div>
                <dt>TK nhận</dt>
                <dd>
                  {payment.accountNo}
                  {payment.accountName ? ` · ${payment.accountName}` : ""}
                </dd>
              </div>
            ) : null}
          </dl>

          <div className={styles.actions}>
            {waiting ? (
              <button
                type="button"
                className={styles.btnDanger}
                disabled={busy}
                onClick={() => void onCancel()}
              >
                {busy ? "Đang hủy…" : "Hủy"}
              </button>
            ) : null}
            <Link
              href={fromWallet ? "/wallet" : "/payments"}
              className={styles.btnGhost}
            >
              {fromWallet ? "Về ví" : "Lịch sử"}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PaymentDetailPage() {
  const params = useParams();
  const paymentId = resolvePaymentId(params);
  return (
    <MarketingChrome hideConversion>
      <RequireAuth nextPath={paymentId ? `/payments/${paymentId}` : "/payments"}>
        <Suspense
          fallback={
            <main className={styles.page}>
              <div className={styles.center}>
                <LtBrandLoader size="lg" tone="onLight" label="Đang tải…" />
              </div>
            </main>
          }
        >
          <PaymentDetailInner />
        </Suspense>
      </RequireAuth>
    </MarketingChrome>
  );
}
