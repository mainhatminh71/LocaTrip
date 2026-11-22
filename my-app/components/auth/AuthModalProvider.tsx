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
  const { isAuthenticated, isLoading, signIn, signInWithGoogle, signUp } =
    useAuthActions();
  const [open, setOpen] = useState(false);
  const [next, setNext] = useState("/book-a-trip/");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"in" | "up" | "google" | null>(null);
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

  async function onSignInWithGoogle() {
    setBusy("google");
    try {
      await signInWithGoogle(next);
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
                      : busy === "google"
                        ? "Đang chuyển tới Google…"
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
                    className={styles.btnGoogle}
                    onClick={() => void onSignInWithGoogle()}
                  >
                    <svg
                      className={styles.btnGoogleIcon}
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        fill="#FFC107"
                        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"
                      />
                      <path
                        fill="#FF3D00"
                        d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.2 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                      />
                      <path
                        fill="#4CAF50"
                        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.3 26.7 36 24 36c-5.3 0-9.7-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"
                      />
                      <path
                        fill="#1976D2"
                        d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.2-3.5 5.7-6.6 7.1l.1.1 6.3 5.2C36.5 41.8 44 36 44 24c0-1.3-.1-2.5-.4-3.5z"
                      />
                    </svg>
                    Tiếp tục với Google
                  </button>
                  <div className={styles.divider} role="separator">
                    <span>hoặc</span>
                  </div>
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
