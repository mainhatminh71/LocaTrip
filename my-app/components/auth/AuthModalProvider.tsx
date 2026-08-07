"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { useAuthActions } from "@/components/auth/useAuthActions";
import { LtBrandLoader } from "@/components/book-a-trip/LtBrandLoader";
import {
  AUTH_MODAL_EVENT,
  type AuthModalOpenDetail,
} from "@/lib/auth/auth-modal";
import styles from "./auth-modal.module.css";

type AuthModalOptions = {
  next?: string;
  mode?: "signin" | "signup" | null;
  error?: string | null;
};

type AuthModalContextValue = {
  open: boolean;
  openAuth: (opts?: AuthModalOptions) => void;
  closeAuth: () => void;
};

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error("useAuthModal must be used within AuthModalProvider");
  }
  return ctx;
}

/** Safe hook when provider may be absent (optional). */
export function useAuthModalOptional() {
  return useContext(AuthModalContext);
}

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, signIn, signUp } = useAuthActions();
  const [open, setOpen] = useState(false);
  const [next, setNext] = useState("/book-a-trip/");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"in" | "up" | null>(null);
  const [signupStarted, setSignupStarted] = useState(false);
  const [pendingSignup, setPendingSignup] = useState(false);

  const openAuth = useCallback((opts: AuthModalOptions = {}) => {
    const target = opts.next?.startsWith("/") ? opts.next : undefined;
    const fallback =
      `${window.location.pathname}${window.location.search}` || "/book-a-trip/";
    setNext(target ?? fallback);
    setError(opts.error ?? null);
    setBusy(null);
    setSignupStarted(false);
    setPendingSignup(opts.mode === "signup");
    setOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    if (busy) return;
    setOpen(false);
    setPendingSignup(false);
    setError(null);
  }, [busy]);

  useEffect(() => {
    const onEvent = (e: Event) => {
      const detail = (e as CustomEvent<AuthModalOpenDetail>).detail ?? {};
      openAuth({
        next: detail.next,
        mode: detail.mode ?? undefined,
        error: detail.error,
      });
    };
    window.addEventListener(AUTH_MODAL_EVENT, onEvent);
    return () => window.removeEventListener(AUTH_MODAL_EVENT, onEvent);
  }, [openAuth]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuth();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closeAuth]);

  // Close when auth succeeds (e.g. silent renew / already logged in).
  useEffect(() => {
    if (open && !isLoading && isAuthenticated && !busy) {
      setOpen(false);
    }
  }, [open, isLoading, isAuthenticated, busy]);

  // Auto-start signup when opened with mode=signup.
  useEffect(() => {
    if (!open || isLoading || isAuthenticated || signupStarted || !pendingSignup) {
      return;
    }
    setSignupStarted(true);
    setBusy("up");
    void signUp(next).catch(() => {
      setBusy(null);
      setPendingSignup(false);
    });
  }, [
    open,
    isLoading,
    isAuthenticated,
    signupStarted,
    pendingSignup,
    next,
    signUp,
  ]);

  async function onSignIn() {
    setBusy("in");
    try {
      await signIn(next);
    } catch {
      setBusy(null);
    }
  }

  async function onSignUp() {
    setBusy("up");
    try {
      await signUp(next);
    } catch {
      setBusy(null);
    }
  }

  const value = useMemo(
    () => ({ open, openAuth, closeAuth }),
    [open, openAuth, closeAuth],
  );

  // Hide on OIDC callback routes.
  const hideUi =
    pathname?.startsWith("/auth/callback") ||
    pathname?.startsWith("/auth/silent");

  return (
    <AuthModalContext.Provider value={value}>
      {children}
      {open && !hideUi ? (
        <div
          className={styles.backdrop}
          role="dialog"
          aria-modal="true"
          aria-labelledby="locatrip-auth-title"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeAuth();
          }}
        >
          <div className={styles.card}>
            {busy ? null : (
              <button
                type="button"
                className={styles.close}
                aria-label="Đóng"
                onClick={closeAuth}
              >
                ×
              </button>
            )}

            {isLoading ? (
              <div className={styles.redirecting}>
                <LtBrandLoader size="lg" tone="onLight" label="Đang tải…" />
              </div>
            ) : busy ? (
              <div className={styles.redirecting}>
                <LtBrandLoader
                  size="lg"
                  tone="onLight"
                  label={
                    busy === "up"
                      ? "Đang chuyển tới trang đăng ký…"
                      : "Đang chuyển tới trang đăng nhập…"
                  }
                />
              </div>
            ) : (
              <>
                <p className={styles.eyebrow}>LocaTrip</p>
                <h1 id="locatrip-auth-title">Đăng nhập để tạo lịch trình</h1>
                {error ? (
                  <p className={styles.error}>
                    Đăng nhập thất bại. Thử lại nhé.
                  </p>
                ) : null}
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={() => void onSignIn()}
                  >
                    Đăng nhập
                  </button>
                  <button
                    type="button"
                    className={styles.btnGhost}
                    onClick={() => void onSignUp()}
                  >
                    Đăng ký
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </AuthModalContext.Provider>
  );
}
