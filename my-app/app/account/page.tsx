"use client";

import Link from "next/link";
import * as Avatar from "@radix-ui/react-avatar";
import { CalendarPlus, Map, Wallet } from "lucide-react";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuthActions } from "@/components/auth/useAuthActions";
import { UserVibeCard } from "@/components/account/UserVibeCard";
import { useWallet } from "@/components/wallet/WalletProvider";
import { initialsFromName } from "@/lib/ui/status-tone";
import styles from "./account.module.css";

function AccountInner() {
  const { displayName, role } = useAuthActions();
  const { balance, loading: walletLoading } = useWallet();
  const initials = initialsFromName(displayName || "LocaTrip");

  return (
    <main className={styles.page}>
      <div className={styles.stack}>
        <div className={styles.card}>
          <p className={styles.eyebrow}>Tài khoản</p>
          <div className={styles.profileHead}>
            <Avatar.Root className={styles.avatarRoot}>
              <Avatar.Fallback className={styles.avatarFallback} delayMs={0}>
                {initials}
              </Avatar.Fallback>
            </Avatar.Root>
            <div className={styles.profileText}>
              <h1 className={styles.title}>{displayName}</h1>
              <p className={styles.sub}>
                Hồ sơ và phong cách đi chơi suy ra từ lịch bạn đã lưu.
              </p>
              <span className={styles.rolePill}>{role ?? "traveller"}</span>
            </div>
          </div>

          <nav className={styles.shortcutGrid} aria-label="Lối tắt tài khoản">
            <Link href="/my-trips/" className={styles.shortcut}>
              <span className={styles.shortcutIcon}>
                <Map size={16} />
              </span>
              <span className={styles.shortcutLabel}>Chuyến đi</span>
              <span className={styles.shortcutMeta}>Đã lưu</span>
            </Link>
            <Link href="/wallet/" className={styles.shortcut}>
              <span className={styles.shortcutIcon}>
                <Wallet size={16} />
              </span>
              <span className={styles.shortcutLabel}>Ví xu</span>
              <span className={styles.shortcutMeta}>
                {walletLoading && balance == null
                  ? "…"
                  : `${(balance ?? 0).toLocaleString("vi-VN")} xu`}
              </span>
            </Link>
            <Link href="/book-a-trip/" className={styles.shortcut}>
              <span className={styles.shortcutIcon}>
                <CalendarPlus size={16} />
              </span>
              <span className={styles.shortcutLabel}>Tạo lịch</span>
              <span className={styles.shortcutMeta}>Book a trip</span>
            </Link>
          </nav>
        </div>

        <UserVibeCard />
      </div>
    </main>
  );
}

export default function AccountPage() {
  return (
    <MarketingChrome hideConversion>
      <RequireAuth nextPath="/account/">
        <AccountInner />
      </RequireAuth>
    </MarketingChrome>
  );
}
