import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import { getOidcConfig } from "@/lib/auth/oidc-config";

let singleton: UserManager | null = null;

/** One browser UserManager — shared by AuthProvider, sign-in/up, and apiFetch. */
export function getUserManager(): UserManager {
  if (typeof window === "undefined") {
    throw new Error("UserManager is browser-only");
  }
  if (!singleton) {
    const base = getOidcConfig();
    const store = window.localStorage;
    const origin = base.redirect_uri.replace(/\/auth\/callback\/?$/, "");
    singleton = new UserManager({
      ...base,
      // Keep PKCE state across Keycloak round-trips (sessionStorage is fragile).
      userStore: new WebStorageStateStore({ store }),
      stateStore: new WebStorageStateStore({ store }),
      // Dedicated silent callback — never reuse /auth/callback (avoids request_type clashes).
      silent_redirect_uri: `${origin}/auth/silent`,
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
