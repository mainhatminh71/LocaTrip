"use client";

import Link from "next/link";
import Image from "next/image";
import { LT_IMAGE_QUALITY } from "@/lib/image-quality";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useAuthActions } from "@/components/auth/useAuthActions";
import { BOOK_TRIP_ASSETS } from "@/lib/book-a-trip-assets";
import styles from "./account-fab.module.css";

const HIDDEN_PREFIXES = ["/login", "/auth/callback"];

type MenuItem = {
  href: string;
  label: string;
  description: string;
  icon: "trips" | "account" | "create";
};

const MENU_ITEMS: MenuItem[] = [
  {
    href: "/my-trips/",
    label: "Chuyến đi của tôi",
    description: "Danh sách lịch trình đã lưu",
    icon: "trips",
  },
  {
    href: "/account/",
    label: "Tài khoản",
    description: "Thông tin cá nhân",
    icon: "account",
  },
  {
    href: "/book-a-trip/",
    label: "Tạo chuyến đi",
    description: "Lên kế hoạch Đà Lạt mới",
    icon: "create",
  },
];

export function AccountFab() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, displayName, signOut } = useAuthActions();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const hidden = HIDDEN_PREFIXES.some(
    (p) => pathname === p || pathname?.startsWith(`${p}/`),
  );

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (isLoading || !isAuthenticated || hidden) return null;

  return (
    <div className={styles.root} ref={rootRef}>
      {open ? (
        <div
          className={styles.panel}
          id={menuId}
          role="menu"
          aria-label="Tài khoản LocaTrip"
        >
          <div className={styles.panelHead}>
            <p className={styles.eyebrow}>Đã đăng nhập</p>
            <p className={styles.name}>{displayName}</p>
          </div>
          <ul className={styles.list}>
            {MENU_ITEMS.map((item) => (
              <li key={item.href} role="none">
                <Link
                  href={item.href}
                  className={styles.item}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                >
                  <span className={styles.itemIcon} aria-hidden>
                    <MenuIcon name={item.icon} />
                  </span>
                  <span className={styles.itemText}>
                    <span className={styles.itemLabel}>{item.label}</span>
                    <span className={styles.itemDesc}>{item.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={styles.signOut}
            role="menuitem"
            onClick={() => {
              setOpen(false);
              void signOut();
            }}
          >
            Đăng xuất
          </button>
        </div>
      ) : null}

      <button
        type="button"
        className={`${styles.fab} ${open ? styles.fabOpen : ""}`}
        aria-label={open ? "Đóng menu tài khoản" : "Mở menu tài khoản"}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.fabIcon} aria-hidden>
          {open ? (
            <CloseIcon />
          ) : (
            <Image
              src={BOOK_TRIP_ASSETS.logo}
              alt=""
              width={34}
              height={34}
              className={styles.fabLogo}
              priority
                    quality={LT_IMAGE_QUALITY}
                  />
          )}
        </span>
      </button>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon({ name }: { name: MenuItem["icon"] }) {
  if (name === "trips") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 7h16M4 12h16M4 17h10"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (name === "create") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 5v14M5 12h14"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M6 18.5c1.4-2.6 3.5-3.9 6-3.9s4.6 1.3 6 3.9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
