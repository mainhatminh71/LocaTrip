"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { LtBrandLoader } from "@/components/book-a-trip/LtBrandLoader";
import {
  clearOidcStaleState,
  completeSigninCallback,
  getUserManager,
} from "@/lib/auth/user-manager";

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

function stripAuthParamsFromUrl() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("code") && !url.searchParams.has("state")) return;
  window.history.replaceState({}, document.title, url.pathname);
}

/**
 * Completes PKCE code exchange once, then redirects home or to `state.returnTo`.
 * AuthProvider skips auto-callback so Strict Mode cannot double-consume state.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    void (async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const hasCode = params.has("code") && params.has("state");

        let user = await getUserManager().getUser();

        if (hasCode) {
          // Stores user + fires userLoaded for react-oidc-context.
          user = (await completeSigninCallback()) ?? user;
          stripAuthParamsFromUrl();
        }

        if (user) {
          router.replace(returnToFromUserState(user.state));
          return;
        }

        router.replace("/login?error=callback&next=/book-a-trip/");
      } catch {
        try {
          await clearOidcStaleState();
          await getUserManager().removeUser();
        } catch {
          /* ignore */
        }
        router.replace("/login?error=callback&next=/book-a-trip/");
      }
    })();
  }, [router]);

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
