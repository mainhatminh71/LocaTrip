import { apiFetch, apiErrorFromBody, ApiError } from "@/lib/api/http";

export type WalletLedgerReason =
  | "topup"
  | "trip_create"
  | "trip_generate"
  | "trip_suggest"
  | "refund";

export type WalletInfo = {
  balance: number;
  currency: "XU";
  rate: { vnd: number; coins: number; example: string };
};

export type WalletTx = {
  id: string;
  userId: string;
  delta: number;
  balanceAfter: number;
  reason: WalletLedgerReason;
  refType?: string;
  refId?: string;
  paymentId?: string;
  createdAt: string;
};

/** FE UX costs — BE 402 vẫn là source of truth khi trừ xu. */
export const COSTS = {
  /** Lưu chuyến `POST /trips` — miễn phí */
  tripCreate: 0,
  /** Tạo lịch trình lần đầu `POST /trips/generate/auto` */
  tripGenerate: 1,
  /** Tạo lại từ tiêu chí (sửa prefs rồi generate lại) */
  tripRegenerate: 2,
  /** Gợi ý địa điểm thay thế `POST /trips/:id/suggest-replace` */
  tripSuggest: 2,
} as const;

/** e.g. `Tạo lịch trình (−1 xu)` */
export function withXuCost(label: string, cost: number): string {
  return `${label} (−${cost} xu)`;
}

export type TopupPackage = {
  id: "basic" | "save" | "optimal";
  amount: number;
  xu: number;
  label: string;
  title: string;
  hint: string;
  badge?: string;
};

/** 3 gói nạp coin — cố định xu theo gói (không quy đổi tuyến tính). */
export const TOPUP_PACKAGES: readonly TopupPackage[] = [
  {
    id: "basic",
    amount: 10000,
    xu: 50,
    label: "10.000₫",
    title: "Trải nghiệm",
    hint: "200đ/xu · Giá chuẩn",
  },
  {
    id: "save",
    amount: 20000,
    xu: 65,
    label: "20.000₫",
    title: "Tiết kiệm",
    hint: "≈308đ/xu · Gói phổ biến",
    badge: "Hay chọn",
  },
  {
    id: "optimal",
    amount: 85000,
    xu: 100,
    label: "85.000₫",
    title: "Tối ưu",
    hint: "850đ/xu · Nhiều xu nhất",
  },
] as const;

const PACKAGE_BY_AMOUNT = new Map(
  TOPUP_PACKAGES.map((p) => [p.amount, p] as const),
);

export function topupPackageForAmount(
  amountVnd: number,
): TopupPackage | undefined {
  return PACKAGE_BY_AMOUNT.get(Math.round(Number(amountVnd)) || 0);
}

/**
 * Xu nhận được khi nạp `amountVnd`.
 * Gói cố định (10k/20k/85k) dùng bảng gói; số khác fallback tỷ lệ chuẩn 10.000₫ = 50 xu.
 */
export function xuFromVnd(amountVnd: number): number {
  const amount = Math.round(Number(amountVnd));
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  const pkg = PACKAGE_BY_AMOUNT.get(amount);
  if (pkg) return pkg.xu;
  return Math.floor((amount * 50) / 10000);
}

export function walletReasonLabel(reason: WalletLedgerReason | string): string {
  switch (reason) {
    case "topup":
      return "Nạp xu";
    case "trip_create":
      return "Lưu chuyến";
    case "trip_generate":
      return "Tạo lịch trình";
    case "trip_suggest":
      return "Đề xuất thay chỗ";
    case "refund":
      return "Hoàn xu";
    default:
      return reason;
  }
}

export async function getWallet(): Promise<WalletInfo> {
  const res = await apiFetch("/api/wallet", {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as WalletInfo & {
    error?: string;
    required?: number;
    balance?: number;
  };
  if (!res.ok) {
    throw apiErrorFromBody(data, res.status, "Không tải được ví xu");
  }
  return {
    balance: Number(data.balance) || 0,
    currency: "XU",
    rate: data.rate || {
      vnd: 10000,
      coins: 50,
      example: "Gói từ 10.000₫ = 50 xu",
    },
  };
}

export async function getWalletTransactions(limit = 50): Promise<{
  balance: number;
  transactions: WalletTx[];
}> {
  const qs = `?limit=${encodeURIComponent(String(limit))}`;
  const res = await apiFetch(`/api/wallet/transactions${qs}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = (await res.json().catch(() => ({}))) as {
    balance?: number;
    transactions?: WalletTx[];
    error?: string;
    required?: number;
  };
  if (!res.ok) {
    throw apiErrorFromBody(data, res.status, "Không tải được lịch sử xu");
  }
  return {
    balance: Number(data.balance) || 0,
    transactions: Array.isArray(data.transactions) ? data.transactions : [],
  };
}

export { ApiError };
