"use client";

import { useEffect, type ReactNode } from "react";
import { useAuth } from "react-oidc-context";
import { roleFromUser, type AppRole } from "@/lib/auth/roles";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import { LtBrandLoader } from "@/components/book-a-trip/LtBrandLoader";

export function RequireAuth({
  children,
  nextPath,
}: {
  children: ReactNode;
  nextPath?: string;
}) {
  const auth = useAuth();
  const { openAuth } = useAuthModal();

  useEffect(() => {
    if (auth.isLoading) return;
    if (!auth.isAuthenticated) {
      openAuth({ next: nextPath });
    }
  }, [auth.isLoading, auth.isAuthenticated, nextPath, openAuth]);

  if (auth.isLoading) {
    return (
      <div
        style={{
          minHeight: "40vh",
          display: "grid",
          placeItems: "center",
          padding: 24,
        }}
      >
        <LtBrandLoader size="lg" tone="onLight" label="Đang kiểm tra đăng nhập…" />
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div
        style={{
          minHeight: "40vh",
          display: "grid",
          placeItems: "center",
          padding: 24,
          gap: 16,
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, color: "var(--lt-muted)", fontSize: 14 }}>
          Cần đăng nhập để xem trang này.
        </p>
        <button
          type="button"
          onClick={() => openAuth({ next: nextPath })}
          style={{
            appearance: "none",
            minHeight: 44,
            padding: "0 20px",
            borderRadius: 999,
            border: "1px solid #191919",
            background: "#191919",
            color: "#fff",
            font: "inherit",
            fontWeight: 650,
            cursor: "pointer",
          }}
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

export function RequireRole({
  role,
  children,
  fallback,
}: {
  role: AppRole | AppRole[];
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const auth = useAuth();
  const allowed = Array.isArray(role) ? role : [role];
  const current = roleFromUser(auth.user);

  if (auth.isLoading) {
    return (
      <div
        style={{
          minHeight: "40vh",
          display: "grid",
          placeItems: "center",
          padding: 24,
        }}
      >
        <LtBrandLoader size="lg" tone="onLight" label="Đang tải…" />
      </div>
    );
  }

  if (!auth.isAuthenticated || !current || !allowed.includes(current)) {
    return (
      <>
        {fallback ?? (
          <div
            style={{
              maxWidth: 420,
              margin: "48px auto",
              padding: 24,
              textAlign: "center",
              fontFamily: "var(--lt-font-body)",
              color: "var(--lt-deep)",
            }}
          >
            <h1 style={{ fontSize: 22, marginBottom: 8 }}>Không đủ quyền</h1>
            <p style={{ color: "var(--lt-muted)", fontSize: 14 }}>
              Tài khoản của bạn không thể truy cập trang này.
            </p>
          </div>
        )}
      </>
    );
  }

  return <>{children}</>;
}
