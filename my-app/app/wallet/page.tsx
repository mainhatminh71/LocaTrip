"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import NumberFlow from "@number-flow/react";
import * as Tabs from "@radix-ui/react-tabs";
import { Minus, Plus, RefreshCw } from "lucide-react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { LtBrandLoader } from "@/components/book-a-trip/LtBrandLoader";
import { useWallet } from "@/components/wallet/WalletProvider";
import { ApiError } from "@/lib/api/http";
import {
  COSTS,
  TOPUP_PACKAGES,
  getWalletTransactions,
  topupPackageForAmount,
  walletReasonLabel,
  type WalletTx,
} from "@/lib/api/wallet";
import {
  createPayment,
  formatVnd,
  listPayments,
  paymentDetailPath,
  paymentStatusLabel,
  type Payment,
  type PaymentStatus,
} from "@/lib/api/payments";
import {
  BOOK_A_TRIP_RESUME_PATH,
  hasPendingGenerateResume,
} from "@/lib/auto-trip-pending";
import { useToast } from "@/components/ui/ToastProvider";
import { requestWalletRefresh } from "@/lib/wallet/xu";
import styles from "./wallet.module.css";

type HistoryTab = "ledger" | "payments";

const HISTORY_PAGE_SIZE = 5;

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

function WalletInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnToRaw = searchParams.get("returnTo")?.trim() || "";
  const returnToAfterPay =
    returnToRaw.startsWith("/") && !returnToRaw.startsWith("//")
      ? returnToRaw
      : hasPendingGenerateResume()
        ? BOOK_A_TRIP_RESUME_PATH
        : undefined;
  const { toastSuccess, toastError } = useToast();
  const { balance, loading: walletLoading, refresh } = useWallet();

  const [selectedAmount, setSelectedAmount] = useState(
    TOPUP_PACKAGES[1]?.amount ?? TOPUP_PACKAGES[0]!.amount,
  );
  const [submitting, setSubmitting] = useState(false);
  const [topupError, setTopupError] = useState<string | null>(null);

  const [tab, setTab] = useState<HistoryTab>("ledger");
  const [page, setPage] = useState(1);
  const [txs, setTxs] = useState<WalletTx[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [histLoading, setHistLoading] = useState(true);
  const [histError, setHistError] = useState<string | null>(null);

  const selectedPkg =
    topupPackageForAmount(selectedAmount) ?? TOPUP_PACKAGES[0]!;
  const previewXu = selectedPkg.xu;
  const tripBudget =
    balance != null && COSTS.tripGenerate > 0
      ? Math.floor(balance / COSTS.tripGenerate)
      : 0;

  const historyItems = tab === "ledger" ? txs : payments;
  const totalPages = Math.max(
    1,
    Math.ceil(historyItems.length / HISTORY_PAGE_SIZE),
  );
  const safePage = Math.min(Math.max(1, page), totalPages);
  const rangeStart =
    historyItems.length === 0 ? 0 : (safePage - 1) * HISTORY_PAGE_SIZE + 1;
  const rangeEnd = Math.min(
    safePage * HISTORY_PAGE_SIZE,
    historyItems.length,
  );
  const pageTxs = useMemo(
    () =>
      txs.slice(
        (safePage - 1) * HISTORY_PAGE_SIZE,
        safePage * HISTORY_PAGE_SIZE,
      ),
    [txs, safePage],
  );
  const pagePayments = useMemo(
    () =>
      payments.slice(
        (safePage - 1) * HISTORY_PAGE_SIZE,
        safePage * HISTORY_PAGE_SIZE,
      ),
    [payments, safePage],
  );

  useEffect(() => {
    setPage(1);
  }, [tab]);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const loadHistory = useCallback(async () => {
    setHistLoading(true);
    setHistError(null);
    try {
      const [ledger, pays] = await Promise.all([
        getWalletTransactions(100),
        listPayments(),
      ]);
      setTxs(ledger.transactions);
      setPayments(pays.payments);
    } catch (err) {
      setHistError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Không tải được lịch sử",
      );
    } finally {
      setHistLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  async function onTopup(e: FormEvent) {
    e.preventDefault();
    setTopupError(null);
    const pkg = topupPackageForAmount(selectedAmount);
    if (!pkg) {
      setTopupError("Chọn một gói nạp");
      return;
    }
    setSubmitting(true);
    try {
      const { payment } = await createPayment({
        amount: pkg.amount,
        note: `Nap xu ${pkg.title} (${pkg.xu} xu)`,
      });
      toastSuccess("Đã tạo mã QR nạp xu");
      router.push(
        paymentDetailPath(payment.paymentId, {
          fromWallet: true,
          returnTo: returnToAfterPay,
        }),
      );
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Tạo thanh toán thất bại";
      setTopupError(msg);
      toastError(msg);
      setSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <div className={styles.wrap}>
        <header>
          <p className={styles.eyebrow}>Ví xu</p>
          <h1 className={styles.title}>Ví LocaTrip</h1>
          <p className={styles.sub}>
            Nạp xu qua chuyển khoản QR, dùng xu để tạo lịch trình và lưu chuyến.
          </p>
        </header>

        <section className={styles.balanceCard} aria-live="polite">
          <p className={styles.balanceLabel}>Số dư</p>
          <p className={styles.balanceValue}>
            {walletLoading && balance == null ? (
              "…"
            ) : (
              <>
                <NumberFlow
                  value={balance ?? 0}
                  locales="vi-VN"
                  suffix=" xu"
                />
              </>
            )}
          </p>
          <p className={styles.balanceSub}>
            {balance == null
              ? "…"
              : tripBudget > 0
                ? `Đủ ~${tripBudget.toLocaleString("vi-VN")} lần tạo chuyến`
                : "Chưa đủ xu để tạo chuyến — nạp thêm bên dưới"}
          </p>
          <p className={styles.balanceRate}>
            Nạp theo gói · chuẩn 20.000₫ = 10 xu
          </p>
        </section>

        <p className={styles.costsHint}>
          Chi phí: tạo chuyến <strong>{COSTS.tripGenerate} xu</strong> · tạo lại
          từ tiêu chí <strong>{COSTS.tripRegenerate} xu</strong> · gợi ý thay
          chỗ <strong>{COSTS.tripSuggest} xu</strong> · lưu chuyến{" "}
          <strong>miễn phí</strong>
        </p>

        <section className={styles.panel}>
          <h2 className={styles.panelTitle}>Nạp xu</h2>
          <p className={styles.panelSub}>
            Không thuê bao năm — chọn gói nạp theo nhu cầu.
          </p>
          <div className={styles.packages} role="group" aria-label="Gói nạp">
            {TOPUP_PACKAGES.map((pkg) => {
              const selected = selectedAmount === pkg.amount;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  className={
                    selected ? styles.packageBtnOn : styles.packageBtn
                  }
                  onClick={() => setSelectedAmount(pkg.amount)}
                >
                  {pkg.badge ? (
                    <span className={styles.packageBadge}>{pkg.badge}</span>
                  ) : null}
                  <span className={styles.packageTitle}>{pkg.title}</span>
                  <span className={styles.packageXuHero}>
                    {pkg.xu.toLocaleString("vi-VN")} xu
                  </span>
                  <span className={styles.packageAmount}>{pkg.label}</span>
                  <span className={styles.packageHint}>{pkg.hint}</span>
                </button>
              );
            })}
          </div>

          <form className={styles.form} onSubmit={onTopup}>
            <p className={styles.previewXu}>
              Gói <strong>{selectedPkg.title}</strong> — nhận{" "}
              <strong>{previewXu.toLocaleString("vi-VN")} xu</strong> từ{" "}
              {formatVnd(selectedPkg.amount)}
            </p>
            {topupError ? <p className={styles.error}>{topupError}</p> : null}
            <div className={styles.actions}>
              <button
                type="submit"
                className={styles.btnPrimary}
                disabled={submitting}
              >
                {submitting ? "Đang tạo QR…" : "Nạp xu bằng QR"}
              </button>
              <button
                type="button"
                className={styles.btnGhost}
                onClick={() => {
                  void refresh();
                  requestWalletRefresh();
                  void loadHistory();
                }}
              >
                <RefreshCw size={15} />
                Làm mới
              </button>
            </div>
          </form>
        </section>

        <section className={styles.panel}>
          <Tabs.Root
            value={tab}
            onValueChange={(v) => {
              setTab(v as HistoryTab);
              setPage(1);
            }}
          >
            <Tabs.List className={styles.tabs} aria-label="Lịch sử ví">
              <Tabs.Trigger
                value="ledger"
                className={tab === "ledger" ? styles.tabOn : styles.tab}
              >
                Lịch sử xu
              </Tabs.Trigger>
              <Tabs.Trigger
                value="payments"
                className={tab === "payments" ? styles.tabOn : styles.tab}
              >
                Lịch sử nạp
              </Tabs.Trigger>
            </Tabs.List>

            {histLoading ? (
              <div className={styles.center}>
                <LtBrandLoader size="md" tone="onLight" label="Đang tải…" />
              </div>
            ) : histError ? (
              <p className={styles.error}>{histError}</p>
            ) : (
              <>
                <Tabs.Content value="ledger">
                  {txs.length === 0 ? (
                    <div className={styles.empty}>Chưa có giao dịch xu.</div>
                  ) : (
                    <>
                      <div className={styles.listScroll}>
                        <ul className={styles.list}>
                          {pageTxs.map((tx) => (
                            <li key={tx.id} className={styles.txRow}>
                              <span
                                className={
                                  tx.delta >= 0
                                    ? styles.txIconPos
                                    : styles.txIconNeg
                                }
                                aria-hidden="true"
                              >
                                {tx.delta >= 0 ? (
                                  <Plus size={14} strokeWidth={2.6} />
                                ) : (
                                  <Minus size={14} strokeWidth={2.6} />
                                )}
                              </span>
                              <div className={styles.txMain}>
                                <p className={styles.txReason}>
                                  {walletReasonLabel(tx.reason)}
                                </p>
                                <p className={styles.txMeta}>
                                  {formatWhen(tx.createdAt)}
                                  {tx.paymentId
                                    ? ` · ${tx.paymentId.slice(0, 8)}…`
                                    : ""}
                                </p>
                              </div>
                              <span
                                className={
                                  tx.delta >= 0
                                    ? styles.txDeltaPos
                                    : styles.txDeltaNeg
                                }
                              >
                                {tx.delta >= 0 ? "+" : ""}
                                {tx.delta} xu
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <nav
                        className={styles.pagination}
                        aria-label="Phân trang lịch sử xu"
                      >
                        <p className={styles.pageInfo}>
                          {rangeStart}–{rangeEnd} / {txs.length}
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
                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1,
                            ).map((n) => (
                              <li key={n}>
                                <button
                                  type="button"
                                  className={
                                    n === safePage
                                      ? `${styles.pageNum} ${styles.pageNumActive}`
                                      : styles.pageNum
                                  }
                                  aria-current={
                                    n === safePage ? "page" : undefined
                                  }
                                  onClick={() => setPage(n)}
                                >
                                  {n}
                                </button>
                              </li>
                            ))}
                          </ul>
                          <button
                            type="button"
                            className={styles.pageBtn}
                            disabled={safePage >= totalPages}
                            onClick={() =>
                              setPage((p) => Math.min(totalPages, p + 1))
                            }
                          >
                            Sau
                          </button>
                        </div>
                      </nav>
                    </>
                  )}
                </Tabs.Content>

                <Tabs.Content value="payments">
                  {payments.length === 0 ? (
                    <div className={styles.empty}>Chưa có lần nạp nào.</div>
                  ) : (
                    <>
                      <div className={styles.listScroll}>
                        <ul className={styles.list}>
                          {pagePayments.map((p) => (
                            <li key={p.paymentId}>
                              <Link
                                href={paymentDetailPath(p.paymentId, {
                                  fromWallet: true,
                                })}
                                className={styles.payCard}
                              >
                                <div className={styles.txMain}>
                                  <p className={styles.txReason}>
                                    {formatVnd(p.amount)}
                                  </p>
                                  <p className={styles.txMeta}>
                                    {formatWhen(p.createdAt)} · {p.code}
                                  </p>
                                </div>
                                <span className={badgeClass(p.status)}>
                                  {paymentStatusLabel(p.status)}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <nav
                        className={styles.pagination}
                        aria-label="Phân trang lịch sử nạp"
                      >
                        <p className={styles.pageInfo}>
                          {rangeStart}–{rangeEnd} / {payments.length}
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
                            {Array.from(
                              { length: totalPages },
                              (_, i) => i + 1,
                            ).map((n) => (
                              <li key={n}>
                                <button
                                  type="button"
                                  className={
                                    n === safePage
                                      ? `${styles.pageNum} ${styles.pageNumActive}`
                                      : styles.pageNum
                                  }
                                  aria-current={
                                    n === safePage ? "page" : undefined
                                  }
                                  onClick={() => setPage(n)}
                                >
                                  {n}
                                </button>
                              </li>
                            ))}
                          </ul>
                          <button
                            type="button"
                            className={styles.pageBtn}
                            disabled={safePage >= totalPages}
                            onClick={() =>
                              setPage((p) => Math.min(totalPages, p + 1))
                            }
                          >
                            Sau
                          </button>
                        </div>
                      </nav>
                    </>
                  )}
                </Tabs.Content>
              </>
            )}
          </Tabs.Root>
        </section>
      </div>
    </main>
  );
}

export default function WalletPage() {
  return (
    <MarketingChrome>
      <RequireAuth>
        <Suspense
          fallback={
            <main className={styles.page}>
              <div className={styles.center}>
                <LtBrandLoader size="lg" tone="onLight" label="Đang tải…" />
              </div>
            </main>
          }
        >
          <WalletInner />
        </Suspense>
      </RequireAuth>
    </MarketingChrome>
  );
}
