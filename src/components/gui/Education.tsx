import { resume } from "@/content/resume";
import shared from "./shared.module.css";
import styles from "./Education.module.css";

export function Education() {
  const { education } = resume;

  return (
    <section
      id="education"
      className={`${shared.section} ${styles.education}`}
      data-testid="section-education"
      aria-labelledby="education-heading"
    >
      <div className={shared.inner}>
        <h2 id="education-heading" className={shared.heading}>
          Education
        </h2>
        <p className={shared.subheading}>
          Computer engineering foundation from Boston University.
        </p>

        <article className={styles.card}>
          <h3 className={styles.institution}>{education.institution}</h3>
          <p className={styles.degree}>{education.degree}</p>
          <p className={styles.year}>{education.year}</p>
        </article>
      </div>
    </section>
  );
}
