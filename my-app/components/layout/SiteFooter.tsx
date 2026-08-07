import Image from "next/image";
import Link from "next/link";
import { BOOK_TRIP_ASSETS } from "@/lib/book-a-trip-assets";
import { LT_IMAGE_QUALITY } from "@/lib/image-quality";
import styles from "./site-footer.module.css";

const EXPLORE = [
  { href: "/", label: "Trang chủ" },
  { href: "/about/", label: "Về chúng tôi" },
  { href: "/tours/", label: "Tours" },
  { href: "/book-a-trip/", label: "Tạo lịch trình" },
  { href: "/my-trips/", label: "Chuyến đi của tôi" },
] as const;

const SUPPORT = [
  { href: "/blogs/", label: "Blogs" },
  { href: "/policies/privacy-policy/", label: "Chính sách bảo mật" },
  { href: "/policies/terms-conditions/", label: "Điều khoản dịch vụ" },
] as const;

const SOCIAL = [
  { href: "https://facebook.com", label: "Facebook" },
  { href: "https://instagram.com", label: "Instagram" },
  { href: "https://linkedin.com", label: "LinkedIn" },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.shell}>
        <div className={styles.inner}>
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brandLink} aria-label="LocaTrip">
              <span className={styles.logoWrap}>
                <Image
                  src={BOOK_TRIP_ASSETS.logo}
                  alt=""
                  width={40}
                  height={40}
                  className={styles.logo}
                  quality={LT_IMAGE_QUALITY}
                />
              </span>
              <p className={styles.brandName}>
                LOCA
                <span className={styles.brandNameLight}>TRIP</span>
              </p>
            </Link>
            <p className={styles.tagline}>
              Lịch trình địa phương cho Đà Lạt — gọn, thực tế, đúng gu của bạn.
            </p>
            <Link href="/book-a-trip/" className={styles.cta}>
              Tạo lịch trình
            </Link>
          </div>

          <nav className={styles.col} aria-label="Khám phá">
            <p className={styles.head}>Khám phá</p>
            <ul className={styles.list}>
              {EXPLORE.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className={styles.col} aria-label="Hỗ trợ">
            <p className={styles.head}>Hỗ trợ</p>
            <ul className={styles.list}>
              {SUPPORT.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>© {year} LocaTrip. Bảo lưu mọi quyền.</p>
          <ul className={styles.social}>
            {SOCIAL.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
