import Image from "next/image";
import { LT_IMAGE_QUALITY } from "@/lib/image-quality";
import Link from "next/link";
import styles from "./listing.module.css";

export type TourCard = {
  slug: string;
  title: string;
  days: string;
  price: string;
  filter: string;
  image: string;
};

export function TourDetailView({ tour }: { tour: TourCard }) {
  return (
    <main>
      <article className={styles.article}>
        <p className={styles.meta}>
          {tour.days} · {tour.filter}
        </p>
        <h1>{tour.title}</h1>
        <p className={styles.price}>{tour.price}</p>
        <div className={styles.articleHero}>
          <Image
            src={tour.image}
            alt=""
            fill
            className={styles.thumbImg}
            sizes="760px"
            quality={LT_IMAGE_QUALITY}
          />
        </div>
        <p className={styles.articleLead}>
          Lịch trình mẫu cố định — xem điểm dừng trên bản đồ. Không chỉnh tiêu
          chí và không gọi API.
        </p>
        <div
          style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 28 }}
        >
          <Link
            href={`/map/?tour=${encodeURIComponent(tour.slug)}`}
            className={styles.cta}
          >
            Xem trên bản đồ
          </Link>
          <Link
            href="/tours/"
            className={styles.cta}
            style={{ background: "var(--lt-field)", color: "var(--lt-deep)" }}
          >
            ← Tất cả tours
          </Link>
        </div>
      </article>
    </main>
  );
}
