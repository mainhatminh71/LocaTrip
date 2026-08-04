import Link from "next/link";
import styles from "./site-footer.module.css";

/** Framer light-theme footer (transparent bg, ink text, gray heads). */
export function SiteFooter() {
  return (
    <footer className={styles.footer} data-framer-name="Container">
      <div className={styles.footerGrid} data-framer-name="Top Content">
        <div data-framer-name="Pages">
          <p className={styles.footerHead}>Pages</p>
          <Link href="/">Trang chủ</Link>
          <Link href="/about/">Về chúng tôi</Link>
          <Link href="/tours/">Tours</Link>
          <Link href="/book-a-trip/">Tạo lịch trình</Link>
        </div>
        <div data-framer-name="Documentation ">
          <p className={styles.footerHead}>Documentation</p>
          <Link href="/blogs/">Blogs</Link>
          <Link href="/policies/privacy-policy/">Chính sách bảo mật</Link>
          <Link href="/policies/terms-conditions/">
            Điều khoản và dịch vụ
          </Link>
        </div>
        <div>
          <p className={styles.footerHead}>Other Pages</p>
          <Link href="/404/">404</Link>
        </div>
        <div data-framer-name="Social">
          <p className={styles.footerHead}>Social</p>
          <p className={styles.socialRow}>Facebook · Instagram · LinkedIn · X</p>
        </div>
      </div>
      <div className={styles.footerBottom} data-framer-name="Bottom">
        <span>All rights reserved for LocalTrip</span>
        <span>Designed by Jitu Raut @fremix.design</span>
      </div>
    </footer>
  );
}
