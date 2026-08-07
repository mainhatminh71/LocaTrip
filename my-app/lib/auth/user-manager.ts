import { UserManager, WebStorageStateStore, type User } from "oidc-client-ts";
import { getOidcConfig } from "@/lib/auth/oidc-config";

let singleton: UserManager | null = null;

/** One in-flight callback per page load — Strict Mode remounts must not re-run PKCE. */
let signinCallbackPromise: Promise<User | null> | null = null;

/** One browser UserManager — shared by AuthProvider, sign-in/up, and apiFetch. */
export function getUserManager(): UserManager {
  if (typeof window === "undefined") {
    throw new Error("UserManager is browser-only");
  }
  if (!singleton) {
    const base = getOidcConfig();
    const store = window.localStorage;
    singleton = new UserManager({
      ...base,
      // Keep PKCE state across Keycloak round-trips (sessionStorage is fragile).
      userStore: new WebStorageStateStore({ store }),
      stateStore: new WebStorageStateStore({ store }),
      automaticSilentRenew: true,
    });
  }
  return singleton;
}

export function clearOidcStaleState(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  try {
    return getUserManager().clearStaleState();
  } catch {
    return Promise.resolve();
  }
}

function isMissingStateError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err ?? "");
  return /no matching state found in storage/i.test(msg);
}

/**
 * Completes the Keycloak redirect exactly once. Safe under React Strict Mode
 * and if AuthProvider + callback page both try to finish the flow.
 */
export function completeSigninCallback(
  url: string = typeof window !== "undefined" ? window.location.href : "",
): Promise<User | null> {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }
  if (!signinCallbackPromise) {
    signinCallbackPromise = (async () => {
      const mgr = getUserManager();
      try {
        const user = await mgr.signinCallback(url);
        return user ?? (await mgr.getUser());
      } catch (err) {
        // First attempt already consumed state (Strict Mode / double invoke).
        const existing = await mgr.getUser().catch(() => null);
        if (existing && isMissingStateError(err)) {
          return existing;
        }
        throw err;
      }
    })();
  }
  return signinCallbackPromise;
}
