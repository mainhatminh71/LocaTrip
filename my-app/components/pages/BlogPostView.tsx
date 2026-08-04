import Image from "next/image";
import Link from "next/link";
import styles from "./listing.module.css";

export type BlogPost = {
  slug: string;
  title: string;
  author: string;
  date: string;
  image: string;
  excerpt: string;
};

export function BlogPostView({ post }: { post: BlogPost }) {
  return (
    <main>
      <article className={styles.article}>
        <p className={styles.blogMeta}>
          <span>{post.author}</span>
          <span>{post.date}</span>
        </p>
        <h1>{post.title}</h1>
        <p className={styles.articleLead}>{post.excerpt}</p>
        <div className={styles.articleHero}>
          <Image
            src={post.image}
            alt=""
            fill
            className={styles.thumbImg}
            sizes="760px"
          />
        </div>
        <p className={styles.articleLead}>
          Nội dung bài viết đang được port từ Framer sang React. Phần mở đầu và
          hình ảnh giữ đúng tiêu đề / slug gốc của site.
        </p>
        <Link href="/blogs/" className={styles.cta}>
          ← Tất cả blogs
        </Link>
      </article>
    </main>
  );
}
