import Image from "next/image";
import styles from "./page-hero.module.css";

type PageHeroProps = {
  title: string;
  sub: string;
  bgSrc: string;
};

export function PageHero({ title, sub, bgSrc }: PageHeroProps) {
  return (
    <header className={styles.hero} data-framer-name="Header">
      <Image
        className={styles.bg}
        src={bgSrc}
        alt=""
        fill
        priority
        sizes="100vw"
      />
      <div className={styles.copy} data-framer-name="Titles">
        <h1 data-framer-name="Main Title">{title}</h1>
        <p data-framer-name="Sub Title">{sub}</p>
      </div>
      <div className={styles.curve} aria-hidden />
    </header>
  );
}
