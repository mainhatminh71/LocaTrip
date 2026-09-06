import { apiFetch, ApiError } from "@/lib/api/http";

export type PaymentStatus =
  | "awaiting_transfer"
  | "paid"
  | "expired"
  | "cancelled";

export type Payment = {
  paymentId: string;
  ownerId: string;
  amount: number;
  currency: "VND";
  orderCode: number;
  code: string;
  status: PaymentStatus;
  /** SePay QR image URL */
  checkoutUrl: string;
  sepayTransactionId?: string;
  accountNo?: string;
  bankName?: string;
  accountName?: string;
  expiresAt: string;
  refType?: string;
  refId?: string;
  note?: string;
  paidAt?: string;
  mockCheckout?: boolean;
  createdAt: string;
  updatedAt: string;
};

export const PAYMENT_STATUS_OPTIONS: {
  value: PaymentStatus;
  label: string;
}[] = [
  { value: "awaiting_transfer", label: "Chờ chuyển khoản" },
  { value: "paid", label: "Đã thanh toán" },
  { value: "expired", label: "Hết hạn" },
  { value: "cancelled", label: "Đã hủy" },
];

export function paymentStatusLabel(status: PaymentStatus): string {
  return (
    PAYMENT_STATUS_OPTIONS.find((o) => o.value === status)?.label || status
  );
}

const PAYMENT_CACHE_PREFIX = "locatrip.payment.";

export function cachePayment(payment: Payment) {
  if (typeof window === "undefined" || !payment?.paymentId) return;
  try {
    sessionStorage.setItem(
      `${PAYMENT_CACHE_PREFIX}${payment.paymentId}`,
      JSON.stringify(payment),
    );
  } catch {
    /* ignore quota */
  }
}

export function readCachedPayment(paymentId: string): Payment | null {
  if (typeof window === "undefined" || !paymentId) return null;
  try {
    const raw = sessionStorage.getItem(`${PAYMENT_CACHE_PREFIX}${paymentId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Payment;
    return parsed?.paymentId ? parsed : null;
  } catch {
    return null;
  }
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object"
    ? (value as Record<string, unknown>)
    : null;
}

/** Accept `{ payment }` wrapper or a bare payment object. */
export function normalizePayment(data: unknown): Payment | null {
  const root = asRecord(data);
  if (!root) return null;
  const candidate = asRecord(root.payment) ?? root;
  const paymentId = String(
    candidate.paymentId || candidate.id || candidate._id || "",
  ).trim();
  if (!paymentId || paymentId === "undefined") return null;
  const status = String(candidate.status || "") as PaymentStatus;
  if (
    status !== "awaiting_transfer" &&
    status !== "paid" &&
    status !== "expired" &&
    status !== "cancelled"
  ) {
    return null;
  }
  return {
    paymentId,
    ownerId: String(candidate.ownerId || ""),
    amount: Number(candidate.amount) || 0,
    currency: "VND",
    orderCode: Number(candidate.orderCode) || 0,
    code: String(candidate.code || ""),
    status,
    checkoutUrl: String(candidate.checkoutUrl || ""),
    sepayTransactionId:
      candidate.sepayTransactionId != null
        ? String(candidate.sepayTransactionId)
        : undefined,
    accountNo:
      candidate.accountNo != null ? String(candidate.accountNo) : undefined,
    bankName:
      candidate.bankName != null ? String(candidate.bankName) : undefined,
    accountName:
      candidate.accountName != null ? String(candidate.accountName) : undefined,
    expiresAt: String(candidate.expiresAt || ""),
    refType: candidate.refType != null ? String(candidate.refType) : undefined,
    refId: candidate.refId != null ? String(candidate.refId) : undefined,
    note: candidate.note != null ? String(candidate.note) : undefined,
    paidAt: candidate.paidAt != null ? String(candidate.paidAt) : undefined,
    mockCheckout: Boolean(candidate.mockCheckout),
    createdAt: String(candidate.createdAt || ""),
    updatedAt: String(candidate.updatedAt || ""),
  };
}

async function parseJson(res: Response): Promise<unknown> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const raw =
      typeof (data as { error?: unknown })?.error === "string"
        ? (data as { error: string }).error
        : `Request failed (${res.status})`;
    throw new ApiError(raw, res.status);
  }
  return data;
}

export async function listPayments(status?: PaymentStatus): Promise<{
  payments: Payment[];
  paymentDevMode: boolean;
}> {
  const qs = status ? `?status=${encodeURIComponent(status)}` : "";
  const res = await apiFetch(`/api/payments${qs}`);
  const data = asRecord(await parseJson(res)) || {};
  const list = Array.isArray(data.payments) ? data.payments : [];
  return {
    payments: list
      .map((row) => normalizePayment({ payment: row }) || normalizePayment(row))
      .filter((p): p is Payment => Boolean(p)),
    paymentDevMode: Boolean(data.paymentDevMode),
  };
}

export async function getPayment(paymentId: string): Promise<{
  payment: Payment;
  paymentDevMode: boolean;
}> {
  const res = await apiFetch(
    `/api/payments/${encodeURIComponent(paymentId)}`,
  );
  const data = await parseJson(res);
  const payment = normalizePayment(data);
  if (!payment) {
    throw new ApiError("Không tìm thấy thanh toán", 404);
  }
  cachePayment(payment);
  return {
    payment,
    paymentDevMode: Boolean(asRecord(data)?.paymentDevMode),
  };
}

export async function createPayment(body: {
  amount: number;
  note?: string;
  refType?: string;
  refId?: string;
}): Promise<{ payment: Payment; paymentDevMode: boolean }> {
  const res = await apiFetch("/api/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await parseJson(res);
  const payment = normalizePayment(data);
  if (!payment?.paymentId) {
    throw new ApiError(
      "Máy chủ tạo thanh toán nhưng thiếu paymentId / checkoutUrl",
      502,
    );
  }
  cachePayment(payment);
  return {
    payment,
    paymentDevMode: Boolean(asRecord(data)?.paymentDevMode),
  };
}

export async function cancelPayment(
  paymentId: string,
): Promise<{ payment: Payment }> {
  const res = await apiFetch(
    `/api/payments/${encodeURIComponent(paymentId)}/cancel`,
    { method: "POST" },
  );
  const data = await parseJson(res);
  const payment = normalizePayment(data);
  if (!payment) {
    throw new ApiError("Hủy thanh toán thất bại", res.status || 502);
  }
  cachePayment(payment);
  return { payment };
}

export function formatVnd(amount: number): string {
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount} VND`;
  }
}

/** SePay / vietqr.app QR image URLs */
export function isPaymentQrImage(url: string): boolean {
  if (!url) return false;
  return (
    /\.(png|jpe?g|webp|gif)(\?|$)/i.test(url) ||
    url.includes("qr.sepay.vn") ||
    url.includes("vietqr.app") ||
    url.includes("img.vietqr.io")
  );
}

/** Prefer showing as <img>; otherwise open link. */
export function paymentDetailPath(
  paymentId: string,
  opts?: { fromWallet?: boolean },
): string {
  const base = `/payments/${encodeURIComponent(paymentId)}`;
  return opts?.fromWallet ? `${base}?from=wallet` : base;
}
