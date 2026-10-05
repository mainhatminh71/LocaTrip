"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Check,
  Clock,
  Copy,
  Loader2,
  QrCode,
  Wallet,
} from "lucide-react";
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
import {
  BOOK_A_TRIP_RESUME_PATH,
  hasPendingGenerateResume,
  loadPendingAutoTripForm,
  savePendingAutoTripForm,
} from "@/lib/auto-trip-pending";
import { useToast } from "@/components/ui/ToastProvider";
import { requestWalletRefresh } from "@/lib/wallet/xu";
import { xuFromVnd } from "@/lib/api/wallet";
import { copyText } from "@/lib/ui/clipboard";
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

function CopyField({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div className={styles.copyRow}>
      <div className={styles.copyText}>
        <span className={styles.copyLabel}>{label}</span>
        <span className={mono ? styles.code : styles.copyValue}>{value}</span>
      </div>
      <button
        type="button"
        className={styles.copyBtn}
        aria-label={copied ? "Đã sao chép" : `Sao chép ${label}`}
        onClick={() => {
          void copyText(value).then((ok) => {
            if (ok) setCopied(true);
          });
        }}
      >
        {copied ? <Check size={16} strokeWidth={2.4} /> : <Copy size={16} />}
        <span>{copied ? "Đã chép" : "Chép"}</span>
      </button>
    </div>
  );
}

function PaymentDetailInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromWallet = searchParams.get("from") === "wallet";
  const returnToRaw = searchParams.get("returnTo")?.trim() || "";
  const returnTo =
    returnToRaw.startsWith("/") && !returnToRaw.startsWith("//")
      ? returnToRaw
      : hasPendingGenerateResume()
        ? BOOK_A_TRIP_RESUME_PATH
        : null;
  const paymentId = resolvePaymentId(params);
  const { toastSuccess, toastError } = useToast();
  const [payment, setPayment] = useState<Payment | null>(() =>
    paymentId ? readCachedPayment(paymentId) : null,
  );
  const [loading, setLoading] = useState(!payment);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [imgBroken, setImgBroken] = useState(false);
  const waiting = payment?.status === "awaiting_transfer";
  const isPaid = payment?.status === "paid";
  const countdown = useCountdown(waiting ? payment?.expiresAt : undefined);
  const expiredRefreshDone = useRef(false);
  const celebratedPaid = useRef(false);
  const redirectedAfterPay = useRef(false);
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
    if (returnTo && !redirectedAfterPay.current) {
      redirectedAfterPay.current = true;
      // Ensure generate resumes after top-up even if resume flag was cleared.
      const pending = loadPendingAutoTripForm();
      if (pending?.draft) {
        savePendingAutoTripForm({
          ...pending,
          resumeGenerate: true,
        });
      }
      router.replace(returnTo);
    }
  }, [payment, toastSuccess, fromWallet, returnTo, router]);

  async function onCancel() {
    if (!payment || busy || payment.status !== "awaiting_transfer") return;
    setBusy(true);
    setConfirmCancel(false);
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

  function requestCancel() {
    if (!payment || busy || payment.status !== "awaiting_transfer") return;
    setConfirmCancel(true);
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
  const creditedXu = xuFromVnd(payment.amount);
  const accountLine = [payment.accountNo, payment.accountName]
    .filter(Boolean)
    .join(" · ");

  if (isPaid) {
    return (
      <main className={styles.page}>
        <div className={styles.wrap}>
          <div className={`${styles.panel} ${styles.successPanel}`}>
            <motion.div
              className={styles.successIconRing}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
              aria-hidden="true"
            >
              <Check size={28} strokeWidth={2.6} />
            </motion.div>
            <motion.p
              className={styles.successXu}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              +{creditedXu.toLocaleString("vi-VN")} xu
            </motion.p>
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
              {formatWhen(payment.paidAt) ? (
                <div>
                  <dt>Thanh toán lúc</dt>
                  <dd>{formatWhen(payment.paidAt)}</dd>
                </div>
              ) : null}
            </dl>

            <div className={styles.actions}>
              {returnTo ? (
                <Link href={returnTo} className={styles.btnPrimary}>
                  Tiếp tục tạo lịch trình
                </Link>
              ) : fromWallet ? (
                <Link href="/wallet" className={styles.btnPrimary}>
                  Về ví xu
                </Link>
              ) : (
                <Link href="/payments" className={styles.btnPrimary}>
                  Về lịch sử giao dịch
                </Link>
              )}
              <Link href="/wallet" className={styles.btnGhost}>
                <Wallet size={16} />
                Ví xu
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.wrapNarrow}>
        <div className={styles.trustPanel}>
          <motion.div
            className={styles.statusStrip}
            animate={
              waiting
                ? { boxShadow: ["0 0 0 0 rgba(194,65,12,0)", "0 0 0 8px rgba(194,65,12,0.08)", "0 0 0 0 rgba(194,65,12,0)"] }
                : undefined
            }
            transition={
              waiting
                ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
                : undefined
            }
          >
            {waiting ? (
              <Loader2 className={styles.statusSpin} size={18} />
            ) : (
              <Clock size={18} />
            )}
            <div className={styles.statusStripText}>
              <span className={badgeClass(payment.status)}>
                {paymentStatusLabel(payment.status)}
              </span>
              <p>
                {waiting
                  ? "Đang chờ xác nhận chuyển khoản — trang tự cập nhật"
                  : paymentStatusLabel(payment.status)}
              </p>
            </div>
          </motion.div>

          <header className={styles.amountBlock}>
            <p className={styles.eyebrow}>Số tiền chuyển</p>
            <h1 className={styles.amountHero}>{formatVnd(payment.amount)}</h1>
            {waiting && countdown.label ? (
              <p
                className={
                  countdown.expired ? styles.countdownExpired : styles.countdownHero
                }
              >
                {countdown.expired
                  ? "Đã hết hạn — đang cập nhật trạng thái…"
                  : `Còn ${countdown.label} trước khi hết hạn`}
              </p>
            ) : null}
            {fromWallet ? (
              <p className={styles.xuHint}>
                Nhận khoảng {creditedXu.toLocaleString("vi-VN")} xu
              </p>
            ) : null}
          </header>

          {waiting ? (
            <div className={styles.qrStage}>
              <div className={styles.qrFrame}>
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
                    <QrCode size={16} />
                    Mở trang / ảnh QR
                  </a>
                ) : (
                  <p className={styles.error}>
                    Đơn đã tạo nhưng thiếu link QR. Dùng thông tin chuyển khoản bên
                    dưới.
                  </p>
                )}
              </div>

              <div className={styles.transferMeta}>
                {payment.bankName ? (
                  <CopyField label="Ngân hàng" value={payment.bankName} />
                ) : null}
                {accountLine ? (
                  <CopyField
                    label="STK nhận"
                    value={payment.accountNo || accountLine}
                    mono
                  />
                ) : null}
                <CopyField label="Nội dung CK" value={payment.code} mono />
              </div>

              <ol className={styles.steps}>
                <li>Mở app ngân hàng và quét mã QR</li>
                <li>Kiểm tra đúng số tiền và nội dung CK</li>
                <li>Xác nhận — xu sẽ cộng khi SePay báo thành công</li>
              </ol>

              <p className={styles.paySupportBanner} role="note">
                Nếu chuyển khoản lỗi, liên hệ Zalo hỗ trợ:{" "}
                <a
                  href="https://zalo.me/0973330800"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.paySupportLink}
                >
                  0973330800
                </a>
              </p>
            </div>
          ) : null}

          <details className={styles.techDetails}>
            <summary>Chi tiết kỹ thuật</summary>
            <dl className={styles.dl}>
              <div>
                <dt>Mã đơn</dt>
                <dd>{payment.orderCode}</dd>
              </div>
              <div>
                <dt>Payment ID</dt>
                <dd className={styles.code}>{payment.paymentId}</dd>
              </div>
              {formatWhen(payment.createdAt) ? (
                <div>
                  <dt>Tạo lúc</dt>
                  <dd>{formatWhen(payment.createdAt)}</dd>
                </div>
              ) : null}
              {payment.note ? (
                <div>
                  <dt>Ghi chú</dt>
                  <dd>{payment.note}</dd>
                </div>
              ) : null}
              {payment.accountName && payment.accountNo ? (
                <div>
                  <dt>Chủ TK</dt>
                  <dd>{payment.accountName}</dd>
                </div>
              ) : null}
            </dl>
          </details>

          <div className={styles.actions}>
            {waiting ? (
              <button
                type="button"
                className={styles.btnDanger}
                disabled={busy}
                onClick={requestCancel}
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

      {confirmCancel ? (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onClick={() => {
            if (!busy) setConfirmCancel(false);
          }}
        >
          <div
            className={styles.modalCard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-pay-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="cancel-pay-title" className={styles.modalTitle}>
              Hủy thanh toán?
            </h2>
            <p className={styles.modalBody}>
              Bạn có chắc muốn hủy không? Dữ liệu sẽ mất.
            </p>
            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.btnGhost}
                disabled={busy}
                onClick={() => setConfirmCancel(false)}
              >
                Quay lại
              </button>
              <button
                type="button"
                className={styles.btnDanger}
                disabled={busy}
                onClick={() => void onCancel()}
              >
                {busy ? "Đang hủy…" : "Hủy"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
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
