"use client";

import { useRef, type ReactNode } from "react";
import { AuthProvider as OidcAuthProvider } from "react-oidc-context";
import type { UserManager } from "oidc-client-ts";
import { getOidcConfig } from "@/lib/auth/oidc-config";
import { getUserManager } from "@/lib/auth/user-manager";

function stripAuthParamsFromUrl() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("code") && !url.searchParams.has("state")) return;
  url.search = "";
  url.hash = "";
  window.history.replaceState({}, document.title, url.pathname);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  // Sync on client render — avoid useEffect delay that remounts provider and
  // leaves /auth/callback spinning an extra round-trip.
  const mgrRef = useRef<UserManager | null>(null);
  if (typeof window !== "undefined" && !mgrRef.current) {
    mgrRef.current = getUserManager();
  }
  const userManager = mgrRef.current;

  if (!userManager) {
    return (
      <OidcAuthProvider {...getOidcConfig()} skipSigninCallback>
        {children}
      </OidcAuthProvider>
    );
  }

  const skipSigninCallback = !window.location.pathname.startsWith(
    "/auth/callback",
  );

  return (
    <OidcAuthProvider
      userManager={userManager}
      skipSigninCallback={skipSigninCallback}
      onSigninCallback={() => {
        stripAuthParamsFromUrl();
      }}
    >
      {children}
    </OidcAuthProvider>
  );
}
