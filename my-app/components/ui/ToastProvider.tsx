"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import styles from "./toast.module.css";

export type ToastTone = "success" | "error";

export type ToastInput = {
  title: string;
  tone?: ToastTone;
  /** Auto-dismiss ms. Default 3200. */
  durationMs?: number;
};

type ToastItem = {
  id: string;
  title: string;
  tone: ToastTone;
};

type ToastContextValue = {
  toast: (input: ToastInput | string) => void;
  toastSuccess: (title: string) => void;
  toastError: (title: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

let toastSeq = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
    setItems((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput | string) => {
      const title = typeof input === "string" ? input : input.title;
      const tone =
        typeof input === "string" ? "success" : (input.tone ?? "success");
      const durationMs =
        typeof input === "string" ? 3200 : (input.durationMs ?? 3200);
      const id = `t-${Date.now()}-${++toastSeq}`;
      setItems((prev) => [...prev.slice(-3), { id, title, tone }]);
      if (durationMs > 0) {
        const handle = setTimeout(() => dismiss(id), durationMs);
        timers.current.set(id, handle);
      }
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toast,
      toastSuccess: (title: string) => toast({ title, tone: "success" }),
      toastError: (title: string) => toast({ title, tone: "error" }),
    }),
    [toast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.viewport} aria-live="polite" aria-relevant="additions">
        {items.map((item) => (
          <div
            key={item.id}
            className={
              item.tone === "error"
                ? `${styles.toast} ${styles.toastError}`
                : `${styles.toast} ${styles.toastSuccess}`
            }
            role="status"
          >
            <span className={styles.accent} aria-hidden />
            <div className={styles.body}>
              <p className={styles.title}>{item.title}</p>
            </div>
            <button
              type="button"
              className={styles.close}
              aria-label="Đóng"
              onClick={() => dismiss(item.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
