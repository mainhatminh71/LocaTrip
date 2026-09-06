"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  INSUFFICIENT_XU_EVENT,
  type InsufficientXuDetail,
} from "@/lib/wallet/xu";
import styles from "./insufficient-xu.module.css";

export function InsufficientXuModal() {
  const [detail, setDetail] = useState<InsufficientXuDetail | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const ce = e as CustomEvent<InsufficientXuDetail>;
      if (ce.detail) setDetail(ce.detail);
    };
    window.addEventListener(INSUFFICIENT_XU_EVENT, onOpen);
    return () => window.removeEventListener(INSUFFICIENT_XU_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!detail) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetail(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detail]);

  if (!detail) return null;

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onClick={() => setDetail(null)}
    >
      <div
        className={styles.card}
        role="dialog"
        aria-modal="true"
        aria-labelledby="xu-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className={styles.eyebrow}>Thiếu xu</p>
        <h2 id="xu-modal-title" className={styles.title}>
          Không đủ xu để tiếp tục
        </h2>
        <p className={styles.body}>
          Cần <strong>{detail.required}</strong> xu, bạn còn{" "}
          <strong>{detail.balance}</strong>.
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnGhost}
            onClick={() => setDetail(null)}
          >
            Đóng
          </button>
          <Link
            href="/wallet"
            className={styles.btnPrimary}
            onClick={() => setDetail(null)}
          >
            Nạp xu
          </Link>
        </div>
      </div>
    </div>
  );
}
