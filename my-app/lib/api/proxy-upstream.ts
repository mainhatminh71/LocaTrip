import { NextResponse } from "next/server";

/** Default when developing against a local LocalTrip process. */
export const LOCALTRIP_LOCAL_API_DEFAULT = "http://localhost:5000";

/**
 * Public Railway production API (CORS `*`).
 * Toggle with `LOCALTRIP_USE_PUBLIC_API=true`.
 */
export const LOCALTRIP_PUBLIC_API_DEFAULT =
  "https://localtrip-production.up.railway.app";

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
 * 1. `LOCALTRIP_USE_PUBLIC_API` truthy → `LOCALTRIP_PUBLIC_API_URL` or Railway default
 * 2. `LOCALTRIP_API_URL` (explicit override for local/custom hosts)
 * 3. `http://localhost:5000`
 */
export function resolveUpstreamBase(
  env: NodeJS.ProcessEnv = process.env,
): string {
  if (truthy(env.LOCALTRIP_USE_PUBLIC_API)) {
    const pub =
      env.LOCALTRIP_PUBLIC_API_URL?.trim() || LOCALTRIP_PUBLIC_API_DEFAULT;
    return stripTrailingSlash(pub);
  }

  const explicit = env.LOCALTRIP_API_URL?.trim();
  if (explicit) return stripTrailingSlash(explicit);

  return LOCALTRIP_LOCAL_API_DEFAULT;
}

export function getUpstreamBase(): string {
  return resolveUpstreamBase(process.env);
}

/** Forward Authorization (and content-type when present) to LocalTrip. */
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

export async function proxyJsonResponse(
  upstream: Response,
): Promise<NextResponse> {
  const text = await upstream.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: text || "Upstream returned non-JSON" };
  }
  return NextResponse.json(data, { status: upstream.status });
}

export function upstreamUnreachable(base: string, err: unknown): NextResponse {
  const message = err instanceof Error ? err.message : "Cannot reach LocalTrip API";
  return NextResponse.json(
    {
      error: `Không kết nối được backend (${base}). Chạy server LocalTrip rồi thử lại. Chi tiết: ${message}`,
    },
    { status: 502 },
  );
}
