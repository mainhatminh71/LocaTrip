"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { useAuthActions } from "@/components/auth/useAuthActions";
import { LtBrandLoader } from "@/components/book-a-trip/LtBrandLoader";
import { resolvePostLoginPath } from "@/lib/auth/admin-scope";

/**
 * Deep-link / fallback route: open the global auth popup on the intended page.
 */
function LoginRedirectInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { openAuth } = useAuthModal();
  const { isAuthenticated, isLoading, role } = useAuthActions();

  useEffect(() => {
    if (isLoading) return;

    const nextRaw = params.get("next") || "/book-a-trip/";
    const next = nextRaw.startsWith("/") ? nextRaw : "/book-a-trip/";
    const error = params.get("error");
    const mode = params.get("mode") === "signup" ? "signup" : null;

    if (isAuthenticated && mode !== "signup") {
      router.replace(resolvePostLoginPath(role, next));
      return;
    }

    openAuth({
      next,
      mode,
      error: error ? "callback" : null,
    });
    router.replace(next);
  }, [isLoading, isAuthenticated, role, params, openAuth, router]);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "grid",
        placeItems: "center",
        background: "#eef3f1",
      }}
    >
      <LtBrandLoader size="lg" tone="onLight" label="Đang mở đăng nhập…" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "60vh",
            display: "grid",
            placeItems: "center",
            background: "#eef3f1",
          }}
        >
          <LtBrandLoader size="lg" tone="onLight" label="Đang tải…" />
        </div>
      }
    >
      <LoginRedirectInner />
    </Suspense>
  );
}
