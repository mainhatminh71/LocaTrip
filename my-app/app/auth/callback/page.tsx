"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";
import { LtBrandLoader } from "@/components/book-a-trip/LtBrandLoader";
import { clearOidcStaleState, getUserManager } from "@/lib/auth/user-manager";

function returnToFromUserState(raw: unknown): string {
  try {
    if (typeof raw === "string") {
      const parsed = JSON.parse(raw) as { returnTo?: string };
      if (parsed.returnTo?.startsWith("/")) return parsed.returnTo;
    }
  } catch {
    /* ignore */
  }
  return "/";
}

/**
 * Completes PKCE code exchange (AuthProvider runs signinCallback here),
 * then redirects home or to `state.returnTo`.
 */
export default function AuthCallbackPage() {
  const auth = useAuth();
  const router = useRouter();
  const handledError = useRef(false);
  const manualTried = useRef(false);

  useEffect(() => {
    if (auth.isLoading) return;

    if (auth.error) {
      if (handledError.current) return;
      handledError.current = true;
      console.error("OIDC callback error", auth.error);
      void (async () => {
        try {
          await clearOidcStaleState();
          await getUserManager().removeUser();
        } catch {
          /* ignore */
        }
        router.replace("/login?error=callback&next=/book-a-trip/");
      })();
      return;
    }

    if (auth.isAuthenticated) {
      router.replace(returnToFromUserState(auth.user?.state));
      return;
    }

    // Provider finished loading but session missing — complete PKCE manually once,
    // or bail out so we never spin forever.
    const params = new URLSearchParams(window.location.search);
    const hasCode = params.has("code") && params.has("state");

    if (hasCode && !manualTried.current) {
      manualTried.current = true;
      void getUserManager()
        .signinCallback()
        .then((user) => {
          const next = returnToFromUserState(user && "state" in user ? user.state : undefined);
          window.history.replaceState({}, document.title, window.location.pathname);
          router.replace(next);
        })
        .catch(async (err) => {
          console.error("OIDC manual callback error", err);
          try {
            await clearOidcStaleState();
            await getUserManager().removeUser();
          } catch {
            /* ignore */
          }
          router.replace("/login?error=callback&next=/book-a-trip/");
        });
      return;
    }

    const timeout = window.setTimeout(() => {
      router.replace("/login?error=callback&next=/book-a-trip/");
    }, 6000);
    return () => window.clearTimeout(timeout);
  }, [auth.isLoading, auth.isAuthenticated, auth.error, auth.user, router]);

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        background: "#eef3f1",
      }}
    >
      <LtBrandLoader size="lg" tone="onLight" label="Đang đăng nhập…" />
    </div>
  );
}
