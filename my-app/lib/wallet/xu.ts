import { ApiError } from "@/lib/api/http";

export const WALLET_REFRESH_EVENT = "locatrip:wallet-refresh";
export const INSUFFICIENT_XU_EVENT = "locatrip:insufficient-xu";

export type InsufficientXuDetail = {
  required: number;
  balance: number;
  message?: string;
};

export function isInsufficientXu(err: unknown): err is ApiError {
  return err instanceof ApiError && err.status === 402;
}

export function readInsufficientXu(err: unknown): InsufficientXuDetail | null {
  if (!isInsufficientXu(err)) return null;
  const required =
    typeof err.details?.required === "number" ? err.details.required : 0;
  const balance =
    typeof err.details?.balance === "number" ? err.details.balance : 0;
  return {
    required,
    balance,
    message: err.message || "Insufficient xu",
  };
}

export function requestWalletRefresh() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(WALLET_REFRESH_EVENT));
}

export function openInsufficientXuModal(detail: InsufficientXuDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(INSUFFICIENT_XU_EVENT, { detail }),
  );
}

/** Handle 402: open modal and return true so callers skip generic error UX. */
export function handleInsufficientXu(err: unknown): boolean {
  const detail = readInsufficientXu(err);
  if (!detail) return false;
  openInsufficientXuModal(detail);
  return true;
}
