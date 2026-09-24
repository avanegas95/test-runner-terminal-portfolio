import Link from "next/link";
import { resume } from "@/content/resume";
import { PytestTeaser } from "./PytestTeaser";
import { TerminalOpenHint } from "./TerminalOpenHint";
import shared from "./shared.module.css";
import styles from "./Hero.module.css";

export function Hero() {
  const { profile } = resume;

  return (
    <section
      id="hero"
      className={`${shared.section} ${styles.hero}`}
      data-testid="section-hero"
      aria-labelledby="hero-heading"
    >
      <div className={shared.inner}>
        <p className={styles.location}>{profile.location}</p>
        <h1 id="hero-heading" className={styles.name}>
          {profile.name}
        </h1>
        <p className={styles.title}>
          {profile.title} @{" "}
          <span className={styles.company}>{profile.company}</span>
        </p>
        <p className={styles.summary}>{profile.summary}</p>
        <p className={styles.experience}>
          <span className={styles.experienceLabel}>{profile.yearsExperience}</span>{" "}
          in software quality assurance
        </p>

        <div className={styles.ctas}>
          <Link
            href="/Anderson_Vanegas_Resume.pdf"
            className={`${shared.btn} ${shared.btnPrimary}`}
          >
            Resume
          </Link>
          <a href="#contact" className={shared.btn}>
            Contact
          </a>
        </div>

        <PytestTeaser />

        <p className={styles.terminalHint}>
          Prefer the command line? <TerminalOpenHint />
        </p>
      </div>
    </section>
  );
}
