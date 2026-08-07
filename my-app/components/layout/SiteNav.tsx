"use client";

import Image from "next/image";
import { LT_IMAGE_QUALITY } from "@/lib/image-quality";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import { BOOK_TRIP_ASSETS } from "@/lib/book-a-trip-assets";
import { useAuthActions } from "@/components/auth/useAuthActions";
import { useAuthModal } from "@/components/auth/AuthModalProvider";
import styles from "./site-nav.module.css";

/** Framer bird logo — shared with book-a-trip assets. */
const LOGO_URL = BOOK_TRIP_ASSETS.logo;

const BASE_LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Về chúng tôi", href: "/about/" },
  { label: "Tours", href: "/tours/" },
  { label: "Blogs", href: "/blogs/" },
  { label: "Tạo chuyến đi", href: "/book-a-trip/" },
] as const;

/** Always-visible capsule links (desktop). Overlay still lists the full set. */
const INLINE_LINKS = [
  { label: "Về chúng tôi", href: "/about/" },
  { label: "Tours", href: "/tours/" },
  { label: "Blogs", href: "/blogs/" },
] as const;

const INLINE_CTA = { label: "Tạo chuyến đi", href: "/book-a-trip/" } as const;

const FEATURE_IMG = "/media/travelers.jpg";

type SiteNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Framer capsule + overlay menu. Auth links depend on Keycloak session. */
export function SiteNav({ open, onOpenChange }: SiteNavProps) {
  const { isAuthenticated, isLoading, role, signOut } = useAuthActions();
  const { openAuth } = useAuthModal();

  const menuLinks = useMemo(() => {
    const links: {
      label: string;
      href: string;
      action?: "logout" | "signin" | "signup";
    }[] = [...BASE_LINKS];
    if (role === "admin") {
      links.push({ label: "Admin", href: "/admin/" });
    }
    if (isAuthenticated) {
      links.push({ label: "Chuyến đi của tôi", href: "/my-trips/" });
      links.push({ label: "Tài khoản", href: "/account/" });
      links.push({ label: "Đăng xuất", href: "#logout", action: "logout" });
    } else if (!isLoading) {
      links.push({ label: "Đăng nhập", href: "#login", action: "signin" });
      links.push({ label: "Đăng ký", href: "#signup", action: "signup" });
    }
    return links;
  }, [isAuthenticated, isLoading, role]);

  useEffect(() => {
    document.documentElement.dataset.navHydrated = "1";
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  return (
    <>
      <div className={styles.root}>
        <div className={styles.bar}>
          <div
            className={styles.capsule}
            data-framer-name="Container"
            style={{
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              backgroundColor: "rgba(0, 0, 0, 0.35)",
            }}
          >
            <Link
              href="/"
              className={styles.logo}
              data-framer-name="Logo"
              onClick={() => onOpenChange(false)}
            >
              <span className={styles.logoImgWrap} data-framer-name="Logo@4x">
                <Image
                  src={LOGO_URL}
                  alt=""
                  width={46}
                  height={46}
                  className={styles.logoImg}
                  priority
                  quality={LT_IMAGE_QUALITY}
                />
              </span>
              <p className={styles.logoText}>
                LOCA
                <span className={styles.logoTextLight}>TRIP</span>
              </p>
            </Link>

            <nav className={styles.inlineNav} aria-label="Điều hướng chính">
              {INLINE_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={styles.inlineLink}
                  onClick={() => onOpenChange(false)}
                >
                  {item.label}
                </Link>
              ))}
              {!isLoading && !isAuthenticated ? (
                <button
                  type="button"
                  className={styles.inlineLink}
                  onClick={() => {
                    onOpenChange(false);
                    openAuth();
                  }}
                >
                  Đăng nhập
                </button>
              ) : null}
              <Link
                href={INLINE_CTA.href}
                className={styles.inlineCta}
                onClick={() => onOpenChange(false)}
              >
                {INLINE_CTA.label}
              </Link>
            </nav>

            <button
              type="button"
              className={styles.menuBtn}
              aria-label={open ? "Đóng menu" : "Mở menu"}
              aria-expanded={open}
              data-framer-name="Menu"
              onClick={() => onOpenChange(!open)}
            >
              <span className={styles.menuLabel} aria-hidden="true">
                Menu
              </span>
              <span
                className={styles.burger}
                data-framer-name={open ? "Open" : "Close"}
              >
                <span
                  className={`${styles.line} ${styles.lineTop} ${
                    open ? styles.lineTopOpen : ""
                  }`}
                />
                <span
                  className={`${styles.line} ${styles.lineBottom} ${
                    open ? styles.lineBottomOpen : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <div
          className={styles.overlay}
          data-framer-name="Nav Background"
          role="dialog"
          aria-modal="true"
          style={{
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            backgroundColor: "rgba(5, 5, 5, 0.55)",
          }}
        >
          <div className={styles.overlayInner}>
            <div className={styles.overlayMain} data-framer-name="Nav-menu">
              <div
                className={styles.featureCol}
                data-framer-name="Wrapper-photo-nav"
              >
                <div className={styles.featureImg} data-framer-name="Image">
                  <Image
                    src={FEATURE_IMG}
                    alt="running man on bridge"
                    fill
                    sizes="(max-width: 900px) 40vw, 280px"
                    quality={LT_IMAGE_QUALITY}
                  />
                </div>
              </div>

              <nav
                className={styles.linksCol}
                aria-label="Menu"
                data-framer-name="Right Menu"
              >
                {menuLinks.map((item, i) => (
                  <div
                    key={item.href + item.label}
                    className={styles.navLinkWrap}
                    style={{
                      animationDelay: `${0.05 + i * 0.04}s`,
                    }}
                  >
                    {item.action === "logout" ||
                    item.action === "signin" ||
                    item.action === "signup" ? (
                      <button
                        type="button"
                        className={styles.navLink}
                        data-framer-name="Desktop Navlinks"
                        onClick={() => {
                          onOpenChange(false);
                          if (item.action === "logout") {
                            void signOut();
                          } else if (item.action === "signup") {
                            openAuth({ mode: "signup" });
                          } else {
                            openAuth();
                          }
                        }}
                      >
                        <span className={styles.navLinkLine} aria-hidden />
                        <span className={styles.navLinkText}>{item.label}</span>
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={styles.navLink}
                        data-framer-name="Desktop Navlinks"
                        onClick={() => onOpenChange(false)}
                      >
                        <span className={styles.navLinkLine} aria-hidden />
                        <span className={styles.navLinkText}>{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            <div className={styles.bottomMenu} data-framer-name="Bottom-menu">
              <div className={styles.contactBlock} data-framer-name="Get In Touch">
                <p className={styles.contactLabel}>Liên lạc</p>
                <a
                  className={styles.contactEmail}
                  href="mailto:info@locatrip.vn"
                >
                  info@locatrip.vn
                </a>
              </div>

              <div
                className={styles.socialRow}
                data-framer-name="Social Wrapper"
              >
                <a
                  className={styles.socialBtn}
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  data-framer-name="Facebook"
                >
                  <FbIcon />
                </a>
                <a
                  className={styles.socialBtn}
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                >
                  <IgIcon />
                </a>
                <a
                  className={styles.socialBtn}
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <LiIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function FbIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 8h2V5h-2c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.2l.8-3H13V9c0-.6.4-1 1-1Z"
        fill="currentColor"
      />
    </svg>
  );
}

function IgIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

function LiIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 9.5V18M6.5 6.2v.2M10.5 18v-5.2c0-1.4.9-2.3 2.2-2.3 1.2 0 2 .8 2 2.4V18M14.7 18v-5.5c0-2.4-1.3-3.5-3.1-3.5-1.4 0-2.3.7-2.7 1.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}
