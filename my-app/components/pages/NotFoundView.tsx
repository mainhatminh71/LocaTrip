import Link from "next/link";
import { NOT_FOUND } from "@/lib/pages-content";
import styles from "./listing.module.css";

export function NotFoundView() {
  return (
    <main className={styles.notFound} data-framer-name="Hero">
      <h1>{NOT_FOUND.title}</h1>
      <p>{NOT_FOUND.body}</p>
      <p>{NOT_FOUND.support}</p>
      <Link href="/" className={styles.cta}>
        {NOT_FOUND.cta}
      </Link>
    </main>
  );
}
