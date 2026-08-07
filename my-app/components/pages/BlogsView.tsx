import Image from "next/image";
import { LT_IMAGE_QUALITY } from "@/lib/image-quality";
import Link from "next/link";
import { BLOG_POSTS, BLOGS_PAGE } from "@/lib/pages-content";
import { PageHero } from "@/components/pages/PageHero";
import styles from "./listing.module.css";

export function BlogsView() {
  return (
    <main>
      <PageHero
        title={BLOGS_PAGE.heroTitle}
        sub={BLOGS_PAGE.heroSub}
        bgSrc={BLOGS_PAGE.heroBg}
      />
      <div className={styles.wrap} data-framer-name="Blogs">
        <div className={styles.grid}>
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blogs/${post.slug}/`}
              className={styles.card}
            >
              <div className={styles.thumb}>
                <Image
                  src={post.image}
                  alt=""
                  fill
                  className={styles.thumbImg}
                  sizes="(max-width:809px) 100vw, 360px"
                    quality={LT_IMAGE_QUALITY}
                  />
              </div>
              <h3 className={styles.title}>{post.title}</h3>
              <div className={styles.blogMeta}>
                <span>{post.author}</span>
                <span>{post.date}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
