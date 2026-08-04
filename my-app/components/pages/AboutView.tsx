import Image from "next/image";
import { ABOUT } from "@/lib/pages-content";
import { PageHero } from "@/components/pages/PageHero";
import styles from "./about.module.css";

export function AboutView() {
  return (
    <main>
      <PageHero
        title={ABOUT.heroTitle}
        sub={ABOUT.heroSub}
        bgSrc={ABOUT.heroBg}
      />

      <section className={styles.section} data-framer-name="About">
        <div className={styles.split}>
          <div>
            <h2 className={styles.h2}>{ABOUT.aboutTitle}</h2>
            {ABOUT.aboutBody.map((p) => (
              <p key={p.slice(0, 24)} className={styles.body}>
                {p}
              </p>
            ))}
          </div>
          <div className={styles.photo}>
            <Image
              src={ABOUT.aboutImage}
              alt=""
              fill
              className={styles.photoImg}
              sizes="(max-width: 809px) 100vw, 560px"
            />
          </div>
        </div>
      </section>

      <section className={styles.milestone} data-framer-name="Milestone">
        <div className={styles.milestoneInner}>
          <h2 className={styles.h2} style={{ color: "#fff" }}>
            {ABOUT.milestoneTitle}
          </h2>
          <div className={styles.stats}>
            {ABOUT.stats.map((s) => (
              <div key={s.label} className={styles.stat} data-framer-name="Stats">
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} data-framer-name="Journey">
        <p className={styles.tag}>{ABOUT.journeyTag}</p>
        <h2 className={styles.h2}>{ABOUT.journeyTitle}</h2>
        <div className={styles.journeyList}>
          {ABOUT.journeyItems.map((item) => (
            <div key={item.title} className={styles.journeyItem}>
              <h3>{item.title}</h3>
              <p className={styles.body}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} data-framer-name="Teams">
        <p className={styles.tag}>{ABOUT.teamTag}</p>
        <h2 className={styles.h2}>{ABOUT.teamTitle}</h2>
        <div className={styles.teamGrid}>
          {ABOUT.team.map((m) => (
            <article key={m.name} className={styles.card} data-framer-name="Team Card">
              <h3>{m.name}</h3>
              <p>{m.role}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
