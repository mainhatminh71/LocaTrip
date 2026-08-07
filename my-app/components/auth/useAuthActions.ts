"use client";

import { useAuth } from "react-oidc-context";
import {
  displayNameFromUser,
  roleFromUser,
  type AppRole,
} from "@/lib/auth/roles";
import { getKeycloakAuthority, getOidcConfig } from "@/lib/auth/oidc-config";
import { OidcClient, WebStorageStateStore } from "oidc-client-ts";
import {
  clearOidcStaleState,
  getUserManager,
} from "@/lib/auth/user-manager";

export function useAppRole(): AppRole | null {
  const auth = useAuth();
  if (!auth.isAuthenticated) return null;
  return roleFromUser(auth.user);
}

export function useAccessToken(): string | null {
  const auth = useAuth();
  return auth.user?.access_token ?? null;
}

export function useAuthActions() {
  const auth = useAuth();

  async function signIn(returnTo?: string) {
    await clearOidcStaleState();
    const state = returnTo ? JSON.stringify({ returnTo }) : undefined;
    await auth.signinRedirect({ state });
  }

  /**
   * Keycloak registration endpoint, with the same PKCE state shape UserManager
   * expects on /auth/callback (`request_type: "si:r"`).
   */
  async function signUp(returnTo?: string) {
    await clearOidcStaleState();
    const cfg = getOidcConfig();
    const store = window.localStorage;
    const client = new OidcClient({
      ...cfg,
      stateStore: new WebStorageStateStore({ store }),
    });
    const req = await client.createSigninRequest({
      request_type: "si:r",
      state: returnTo ? JSON.stringify({ returnTo }) : undefined,
      redirect_uri: cfg.redirect_uri,
      response_type: "code",
      scope: cfg.scope,
    });
    const authority = getKeycloakAuthority();
    const registerUrl = req.url.replace(
      `${authority}/protocol/openid-connect/auth`,
      `${authority}/protocol/openid-connect/registrations`,
    );
    window.location.assign(registerUrl);
  }

  async function signOut() {
    await clearOidcStaleState();
    try {
      await getUserManager().removeUser();
    } catch {
      /* ignore */
    }
    await auth.signoutRedirect();
  }

  return {
    auth,
    isLoading: auth.isLoading,
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    displayName: displayNameFromUser(auth.user),
    role: roleFromUser(auth.user),
    signIn,
    signUp,
    signOut,
  };
}
