import { PageHero } from "@/components/pages/PageHero";
import styles from "./listing.module.css";

type Section = { h: string; p: string };

type PolicyViewProps = {
  title: string;
  sub: string;
  sections: readonly Section[];
};

const POLICY_BG =
  "/media/dalat-lake.jpg";

export function PolicyView({ title, sub, sections }: PolicyViewProps) {
  return (
    <main>
      <PageHero title={title} sub={sub} bgSrc={POLICY_BG} />
      <div className={styles.policy}>
        {sections.map((s) => (
          <section key={s.h}>
            <h2>{s.h}</h2>
            <p>{s.p}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
