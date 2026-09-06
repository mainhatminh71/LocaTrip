import { User, UserManager } from "oidc-client-ts";
import { getUserManager } from "@/lib/auth/user-manager";

export type ApiErrorDetails = {
  required?: number;
  balance?: number;
  [key: string]: unknown;
};

function looksLikeHtml(text: string): boolean {
  const t = text.trimStart().slice(0, 64).toLowerCase();
  return t.startsWith("<!doctype") || t.startsWith("<html") || t.includes("<head");
}

/** Never surface raw nginx/HTML error pages in the UI. */
export function sanitizeApiErrorMessage(
  message: string,
  status?: number,
): string {
  const msg = (message || "").trim();
  if (!msg || looksLikeHtml(msg)) {
    if (status === 502 || status === 503 || status === 504) {
      return "Dịch vụ tạm thời không phản hồi. Kiểm tra gateway rồi thử lại.";
    }
    return status
      ? `Máy chủ trả lỗi ${status}. Vui lòng thử lại sau.`
      : "Có lỗi xảy ra. Vui lòng thử lại sau.";
  }
  if (msg.length > 280) return `${msg.slice(0, 277)}…`;
  return msg;
}

export class ApiError extends Error {
  status: number;
  details?: ApiErrorDetails;

  constructor(message: string, status: number, details?: ApiErrorDetails) {
    super(sanitizeApiErrorMessage(message, status));
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

/** Build ApiError from a JSON error body; preserves 402 xu fields. */
export function apiErrorFromBody(
  data: {
    error?: string;
    required?: number;
    balance?: number;
    [key: string]: unknown;
  },
  status: number,
  fallbackMessage?: string,
): ApiError {
  const raw =
    (typeof data.error === "string" && data.error) ||
    fallbackMessage ||
    `Lỗi ${status}`;
  const message = sanitizeApiErrorMessage(raw, status);
  if (status === 402) {
    return new ApiError(message, 402, {
      required:
        typeof data.required === "number" ? data.required : undefined,
      balance: typeof data.balance === "number" ? data.balance : undefined,
    });
  }
  return new ApiError(message, status);
}

export type ApiFetchOptions = RequestInit & {
  /**
   * When true, open the auth popup after a failed renew.
   * Default false — callers (book-a-trip, etc.) stay on-page and show errors.
   */
  redirectOn401?: boolean;
};

function mgr(): UserManager | null {
  if (typeof window === "undefined") return null;
  try {
    return getUserManager();
  } catch {
    return null;
  }
}

async function readUser(): Promise<User | null> {
  const userManager = mgr();
  if (!userManager) return null;
  try {
    return await userManager.getUser();
  } catch {
    return null;
  }
}

function goLogin() {
  if (typeof window === "undefined") return;
  const next = `${window.location.pathname}${window.location.search}`;
  // Prefer in-page auth popup; fall back to /login deep-link.
  window.dispatchEvent(
    new CustomEvent("locatrip:open-auth", {
      detail: { next },
    }),
  );
}

/**
 * Same-origin fetch with Bearer token.
 * Renews silently if the access token is expired / 401.
 * Does not navigate away unless `redirectOn401: true`.
 */
export async function apiFetch(
  input: string,
  init: ApiFetchOptions = {},
): Promise<Response> {
  const { redirectOn401 = false, ...requestInit } = init;
  const headers = new Headers(requestInit.headers);
  const userManager = mgr();

  let user = await readUser();

  // Proactively renew before a long generate if the token is already expired.
  if (user?.expired && userManager) {
    try {
      user = await userManager.signinSilent();
    } catch {
      await userManager.removeUser().catch(() => undefined);
      if (redirectOn401) goLogin();
      throw new ApiError("Phiên đăng nhập hết hạn", 401);
    }
  }

  if (user?.access_token) {
    headers.set("Authorization", `Bearer ${user.access_token}`);
  }

  let res = await fetch(input, { ...requestInit, headers });

  if (res.status === 401 && userManager) {
    try {
      user = await userManager.signinSilent();
      if (user?.access_token) {
        headers.set("Authorization", `Bearer ${user.access_token}`);
        res = await fetch(input, { ...requestInit, headers });
      }
    } catch {
      await userManager.removeUser().catch(() => undefined);
      if (redirectOn401) goLogin();
      throw new ApiError("Phiên đăng nhập hết hạn", 401);
    }
  }

  if (res.status === 401) {
    let detail = "Chưa đăng nhập hoặc token không hợp lệ";
    try {
      const data = (await res.clone().json()) as { error?: string };
      if (data.error) detail = data.error;
    } catch {
      /* ignore */
    }
    if (redirectOn401) goLogin();
    throw new ApiError(detail, 401);
  }

  if (res.status === 403) {
    throw new ApiError("Không đủ quyền", 403);
  }

  return res;
}
