"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { BOOK_TRIP_ASSETS } from "@/lib/book-a-trip-assets";
import styles from "./site-nav.module.css";

/** Framer bird logo (558RNrhUApov3HeiOMs9CTGdiY) — shared with book-a-trip assets. */
const LOGO_URL = BOOK_TRIP_ASSETS.logo;

const MENU_LINKS = [
  { label: "Trang chủ", href: "/" },
  { label: "Về chúng tôi", href: "/about/" },
  { label: "Tours", href: "/tours/" },
  { label: "Blogs", href: "/blogs/" },
  { label: "Tạo chuyến đi", href: "/book-a-trip/" },
  { label: "Tài Khoản", href: "/map/" },
] as const;

/** Measured Framer open: link tops ~74px apart, row ~42px → 32px between. */
const LINK_GAP_PX = 32;

const FEATURE_IMG =
  "https://framerusercontent.com/images/gbVpyIHbkJ3pRoMQBsQuMD2dG3M.jpg";

type SiteNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/**
 * Framer `qWghg` Black-dekstop capsule + overlay menu (GW9HDjUFD).
 * Pixel values from book-a-trip SSR + script_main measurements.
 * Shared site nav for homepage, book-a-trip, and other product pages.
 */
export function SiteNav({ open, onOpenChange }: SiteNavProps) {
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
      {/* Fixed Black-dekstop capsule — stays visible when open (Framer measured). */}
      <div className={styles.root}>
        <div className={styles.bar}>
          <div
            className={styles.capsule}
            data-framer-name="Container"
            style={{
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            }}
          >
            <Link href="/" className={styles.logo} data-framer-name="Logo">
              {/* Wrapper forces 46×46 in flex — Next/Image span can collapse width. */}
              <span className={styles.logoImgWrap} data-framer-name="Logo@4x">
                <Image
                  src={LOGO_URL}
                  alt=""
                  width={46}
                  height={46}
                  className={styles.logoImg}
                  priority
                />
              </span>
              <p className={styles.logoText}>
                LOCA
                <span className={styles.logoTextLight}>TRIP</span>
              </p>
            </Link>

            <button
              type="button"
              className={styles.menuBtn}
              aria-label={open ? "Đóng menu" : "Mở menu"}
              aria-expanded={open}
              data-framer-name="Menu"
              onClick={() => onOpenChange(!open)}
            >
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
            {/* Dekstop Transparent — Logo left + X right (measured x:120 / x:1288) */}
            <div
              className={styles.overlayTop}
              data-framer-name="Dekstop Transparent"
            >
              <Link
                href="/"
                className={styles.overlayLogo}
                data-framer-name="Logo"
                onClick={() => onOpenChange(false)}
              >
                <Image
                  src={LOGO_URL}
                  alt=""
                  width={28}
                  height={28}
                  className={styles.overlayLogoImg}
                />
                <span className={styles.overlayLogoText}>
                  LOCA
                  <span className={styles.logoTextLight}>TRIP</span>
                </span>
              </Link>

              <button
                type="button"
                className={styles.overlayClose}
                aria-label="Đóng menu"
                data-framer-name="Menu"
                onClick={() => onOpenChange(false)}
              >
                <span className={styles.burger} data-framer-name="Open">
                  <span
                    className={`${styles.line} ${styles.lineTop} ${styles.lineTopOpen}`}
                  />
                  <span
                    className={`${styles.line} ${styles.lineBottom} ${styles.lineBottomOpen}`}
                  />
                </span>
              </button>
            </div>

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
                    sizes="273px"
                    priority
                  />
                </div>
              </div>

              <nav
                className={styles.linksCol}
                aria-label="Menu"
                data-framer-name="Right Menu"
              >
                {MENU_LINKS.map((item, i) => (
                  <div
                    key={item.href + item.label}
                    className={styles.navLinkWrap}
                    style={{
                      paddingBottom:
                        i === MENU_LINKS.length - 1 ? 0 : LINK_GAP_PX,
                      animationDelay: `${0.05 + i * 0.04}s`,
                    }}
                  >
                    <Link
                      href={item.href}
                      className={styles.navLink}
                      data-framer-name="Desktop Navlinks"
                      onClick={() => onOpenChange(false)}
                    >
                      <span className={styles.navLinkLine} aria-hidden />
                      <span className={styles.navLinkText}>{item.label}</span>
                    </Link>
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
