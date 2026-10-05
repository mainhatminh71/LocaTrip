"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useWallet } from "./WalletProvider";
import {
  BALANCE_VISIBLE_EVENT,
  readBalanceVisible,
  writeBalanceVisible,
} from "@/lib/ui/view-prefs";
import styles from "./wallet-badge.module.css";

type WalletBalanceBadgeProps = {
  className?: string;
  /** Compact pill for dark nav / focus bar */
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  /** Show “Số dư” caption before the amount */
  showLabel?: boolean;
  /** Show eye toggle to hide/show the balance pill (default true). */
  showToggle?: boolean;
};

export function WalletBalanceBadge({
  className = "",
  tone = "light",
  size = "md",
  showLabel = true,
  showToggle = true,
}: WalletBalanceBadgeProps) {
  const { balance, loading } = useWallet();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(readBalanceVisible());
    const sync = (e: Event) => {
      if (e instanceof CustomEvent && typeof e.detail === "boolean") {
        setVisible(e.detail);
        return;
      }
      setVisible(readBalanceVisible());
    };
    window.addEventListener(BALANCE_VISIBLE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(BALANCE_VISIBLE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (balance == null && !loading) return null;

  const amount =
    balance == null ? "…" : balance.toLocaleString("vi-VN");

  function toggleVisible() {
    setVisible((prev) => {
      const next = !prev;
      writeBalanceVisible(next);
      return next;
    });
  }

  return (
    <div
      className={`${styles.wrap} ${tone === "dark" ? styles.wrapDark : ""} ${className}`.trim()}
    >
      {visible ? (
        <Link
          href="/wallet"
          className={`${styles.badge} ${tone === "dark" ? styles.badgeDark : ""} ${
            size === "lg" ? styles.badgeLg : size === "sm" ? styles.badgeSm : ""
          }`}
          title="Mở ví xu LocaTrip"
          aria-label={`Số dư ví: ${amount} xu`}
        >
          <span className={styles.coin} aria-hidden="true">
            ✦
          </span>
          <span className={styles.textCol}>
            {showLabel ? <span className={styles.caption}>Số dư</span> : null}
            <span className={styles.value}>
              {amount}
              <span className={styles.unit}> xu</span>
            </span>
          </span>
        </Link>
      ) : null}
      {showToggle ? (
        <button
          type="button"
          className={`${styles.toggle} ${
            tone === "dark" ? styles.toggleDark : ""
          }`}
          onClick={toggleVisible}
          aria-pressed={visible}
          aria-label={visible ? "Ẩn số dư xu" : "Hiện số dư xu"}
          title={visible ? "Ẩn số dư" : "Hiện số dư"}
        >
          {visible ? (
            <EyeOff size={15} strokeWidth={2.2} />
          ) : (
            <Eye size={15} strokeWidth={2.2} />
          )}
        </button>
      ) : null}
    </div>
  );
}
