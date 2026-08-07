"use client";

import Link from "next/link";
import { MarketingChrome } from "@/components/layout/MarketingChrome";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuthActions } from "@/components/auth/useAuthActions";
import styles from "./account-stub.module.css";

function AccountInner() {
  const { displayName, role } = useAuthActions();

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Tài khoản</p>
        <h1 className={styles.title}>{displayName}</h1>
        <p className={styles.sub}>
          Trang hồ sơ cá nhân — UI và tính năng sẽ bổ sung sau.
        </p>
        <dl className={styles.meta}>
          <div>
            <dt>Vai trò</dt>
            <dd>{role ?? "traveller"}</dd>
          </div>
        </dl>
        <div className={styles.actions}>
          <Link href="/my-trips/" className={styles.btnPrimary}>
            Chuyến đi của tôi
          </Link>
          <Link href="/" className={styles.btnGhost}>
            Về trang chủ
          </Link>
        </div>
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
