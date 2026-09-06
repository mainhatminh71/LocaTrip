"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { createPayment, paymentDetailPath } from "@/lib/api/payments";
import { ApiError } from "@/lib/api/http";
import { useToast } from "@/components/ui/ToastProvider";
import styles from "../payments.module.css";

const NOTE_MAX = 200;

function NewPaymentInner() {
  const router = useRouter();
  const { toastSuccess, toastError } = useToast();
  const [amount, setAmount] = useState("10000");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const n = Math.round(Number(String(amount).replace(/\D/g, "") || amount));
    if (!Number.isFinite(n) || n < 1000) {
      setError("Số tiền tối thiểu 1.000 VND");
      return;
    }
    if (note.trim().length > NOTE_MAX) {
      setError(`Ghi chú tối đa ${NOTE_MAX} ký tự`);
      return;
    }
    setSubmitting(true);
    try {
      const { payment } = await createPayment({
        amount: n,
        note: note.trim() || undefined,
      });
      toastSuccess("Đã tạo thanh toán");
      router.push(paymentDetailPath(payment.paymentId));
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Tạo thanh toán thất bại";
      setError(msg);
      toastError(msg);
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <header>
          <p className={styles.eyebrow}>Thanh toán</p>
          <h1 className={styles.title}>Tạo thanh toán</h1>
          <p className={styles.sub}>
            Nhập số tiền (tối thiểu 1.000 VND). Hệ thống tạo mã chuyển khoản và
            QR / link thanh toán.
          </p>
        </header>

        <form className={`${styles.panel} ${styles.form}`} onSubmit={onSubmit}>
          <label>
            Số tiền (VND)
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="10000"
              required
              autoComplete="off"
              aria-describedby="amount-hint"
            />
          </label>
          <p id="amount-hint" className={styles.fieldHint}>
            Chỉ nhập số nguyên, tối thiểu 1.000.
          </p>
          <label>
            Ghi chú (tuỳ chọn)
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, NOTE_MAX))}
              maxLength={NOTE_MAX}
              placeholder="Ví dụ: test thanh toán"
            />
          </label>
          <p className={styles.fieldHint}>
            {note.length}/{NOTE_MAX} ký tự
          </p>
          {error ? <p className={styles.error}>{error}</p> : null}
          <div className={styles.actions}>
            <button
              type="submit"
              className={styles.btnPrimary}
              disabled={submitting}
            >
              {submitting ? "Đang tạo…" : "Tạo & hiện QR"}
            </button>
            <Link href="/payments" className={styles.btnGhost}>
              Hủy
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function NewPaymentPage() {
  return (
    <MarketingChrome hideConversion>
      <RequireAuth nextPath="/payments/new">
        <NewPaymentInner />
      </RequireAuth>
    </MarketingChrome>
  );
}
