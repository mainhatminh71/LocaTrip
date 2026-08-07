"use client";

import { useRef, type ReactNode } from "react";
import { AuthProvider as OidcAuthProvider } from "react-oidc-context";
import type { UserManager } from "oidc-client-ts";
import { getOidcConfig } from "@/lib/auth/oidc-config";
import { getUserManager } from "@/lib/auth/user-manager";

/**
 * PKCE completion is owned by /auth/callback/ (see completeSigninCallback).
 * Always skip here so Strict Mode remounts cannot double-consume state.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
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

  return (
    <OidcAuthProvider userManager={userManager} skipSigninCallback>
      {children}
    </OidcAuthProvider>
  );
}
