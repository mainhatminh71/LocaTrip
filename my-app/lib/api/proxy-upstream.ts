import { NextResponse } from "next/server";

/**
 * Default local upstream = Nginx API gateway (docker compose).
 * Do NOT point FE proxies at service ports (:5000 / :5003) except for debug.
 *
 * Note: gateway redirects `GET|POST /trips` → `/trips/` (301). Proxies must
 * call `/trips/` or POST bodies can be dropped when following the redirect.
 */
export const LOCALTRIP_LOCAL_API_DEFAULT = "http://localhost";

/**
 * Legacy single-gateway Railway URL (currently undeployed / 404).
 * Only used when `LOCALTRIP_PUBLIC_API_URL` is set to a *different* host
 * (custom gateway). Otherwise public mode routes per service below.
 */
export const LOCALTRIP_PUBLIC_API_DEFAULT =
  "https://localtrip-production.up.railway.app";

/** Railway trip-service (trips, weather, discovery, admin). */
export const LOCALTRIP_TRIP_SERVICE_DEFAULT =
  "https://localtrip-tripservice-production.up.railway.app";

/** Railway payment-service (payments + wallet). */
export const LOCALTRIP_PAYMENT_SERVICE_DEFAULT =
  "https://localtrip-paymentservice-production.up.railway.app";

export type UpstreamKind = "trip" | "payment";

function truthy(value: string | undefined): boolean {
  if (!value) return false;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

/**
 * Resolve LocalTrip upstream base from env.
 *
 * Priority:
 * 1. `LOCALTRIP_USE_PUBLIC_API` truthy:
 *    - If `LOCALTRIP_PUBLIC_API_URL` is set and ≠ dead gateway default → single gateway
 *    - Else per-service: payment (payments + wallet) → PAYMENT URL;
 *      trip (default) → TRIP URL
 * 2. `LOCALTRIP_API_URL` / `API_BASE_URL` / `NEXT_PUBLIC_API_BASE_URL` (gateway)
 * 3. `http://localhost` (Nginx gateway)
 */
export function resolveUpstreamBase(
  env: NodeJS.ProcessEnv = process.env,
  kind: UpstreamKind = "trip",
): string {
  if (truthy(env.LOCALTRIP_USE_PUBLIC_API)) {
    const pub = env.LOCALTRIP_PUBLIC_API_URL?.trim();
    if (
      pub &&
      stripTrailingSlash(pub) !==
        stripTrailingSlash(LOCALTRIP_PUBLIC_API_DEFAULT)
    ) {
      return stripTrailingSlash(pub);
    }

    if (kind === "payment") {
      return stripTrailingSlash(
        env.LOCALTRIP_PAYMENT_SERVICE_URL?.trim() ||
          LOCALTRIP_PAYMENT_SERVICE_DEFAULT,
      );
    }

    return stripTrailingSlash(
      env.LOCALTRIP_TRIP_SERVICE_URL?.trim() || LOCALTRIP_TRIP_SERVICE_DEFAULT,
    );
  }

  const explicit =
    env.LOCALTRIP_API_URL?.trim() ||
    env.API_BASE_URL?.trim() ||
    env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (explicit) return stripTrailingSlash(explicit);

  return LOCALTRIP_LOCAL_API_DEFAULT;
}

export function getUpstreamBase(kind: UpstreamKind = "trip"): string {
  return resolveUpstreamBase(process.env, kind);
}

/** Forward Authorization (and content-type when present) to LocalTrip gateway. */
export function upstreamHeaders(
  request: Request,
  extra?: HeadersInit,
): Headers {
  const headers = new Headers(extra);
  if (!headers.has("Accept")) headers.set("Accept", "application/json");
  const auth = request.headers.get("authorization");
  if (auth) headers.set("Authorization", auth);
  return headers;
}

function looksLikeHtml(text: string): boolean {
  const t = text.trimStart().slice(0, 64).toLowerCase();
  return t.startsWith("<!doctype") || t.startsWith("<html") || t.includes("<head");
}

function friendlyUpstreamError(status: number, text: string): string {
  const trimmed = text.trim();
  if (!trimmed || looksLikeHtml(trimmed)) {
    if (status === 502 || status === 503 || status === 504) {
      return "Dịch vụ tạm thời không phản hồi (502/503). Kiểm tra docker / Nginx gateway rồi thử lại.";
    }
    if (status === 401) return "Phiên đăng nhập hết hạn hoặc chưa đăng nhập.";
    if (status === 403) return "Không đủ quyền thực hiện thao tác này.";
    if (status === 404) return "Không tìm thấy tài nguyên trên máy chủ.";
    return `Máy chủ trả lỗi ${status}. Vui lòng thử lại sau.`;
  }
  // Cap long plain-text upstream bodies
  if (trimmed.length > 280) return `${trimmed.slice(0, 277)}…`;
  return trimmed;
}

export async function proxyJsonResponse(
  upstream: Response,
): Promise<NextResponse> {
  const text = await upstream.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = {
      error: friendlyUpstreamError(upstream.status, text || ""),
    };
  }

  // JSON body that accidentally embeds HTML as `error`
  if (
    data &&
    typeof data === "object" &&
    "error" in data &&
    typeof (data as { error: unknown }).error === "string" &&
    looksLikeHtml((data as { error: string }).error)
  ) {
    data = {
      ...(data as Record<string, unknown>),
      error: friendlyUpstreamError(
        upstream.status,
        (data as { error: string }).error,
      ),
    };
  }

  return NextResponse.json(data ?? {}, { status: upstream.status });
}

export function upstreamUnreachable(base: string, err: unknown): NextResponse {
  const message =
    err instanceof Error ? err.message : "Cannot reach upstream API";
  return NextResponse.json(
    {
      error: `Không kết nối được upstream API (${base}). Kiểm tra LOCALTRIP_USE_PUBLIC_API / service URL hoặc docker gateway. Chi tiết: ${message}`,
    },
    { status: 502 },
  );
}
