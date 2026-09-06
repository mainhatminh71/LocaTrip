"use client";

import Link from "next/link";
import { useWallet } from "./WalletProvider";
import styles from "./wallet-badge.module.css";

type WalletBalanceBadgeProps = {
  className?: string;
  /** Compact pill for dark nav / focus bar */
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  /** Show “Số dư” caption before the amount */
  showLabel?: boolean;
};

export function WalletBalanceBadge({
  className = "",
  tone = "light",
  size = "md",
  showLabel = true,
}: WalletBalanceBadgeProps) {
  const { balance, loading } = useWallet();

  if (balance == null && !loading) return null;

  const amount =
    balance == null ? "…" : balance.toLocaleString("vi-VN");

  return (
    <Link
      href="/wallet"
      className={`${styles.badge} ${tone === "dark" ? styles.badgeDark : ""} ${
        size === "lg" ? styles.badgeLg : size === "sm" ? styles.badgeSm : ""
      } ${className}`.trim()}
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
  );
}
