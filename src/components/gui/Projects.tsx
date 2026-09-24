import { resume } from "@/content/resume";
import shared from "./shared.module.css";
import styles from "./Projects.module.css";

export function Projects() {
  return (
    <section
      id="projects"
      className={`${shared.section} ${styles.projects}`}
      data-testid="section-projects"
      aria-labelledby="projects-heading"
    >
      <div className={shared.inner}>
        <h2 id="projects-heading" className={shared.heading}>
          Projects
        </h2>
        <p className={shared.subheading}>
          Side and contract work — interactive reports, full-stack SaaS, and
          production handoffs with accessibility and performance budgets.
        </p>

        <div className={styles.grid}>
          {resume.projects.map((project) => (
            <article key={project.id} className={styles.card}>
              <h3 className={styles.name}>{project.name}</h3>
              <p className={styles.summary}>{project.summary}</p>
              <ul className={styles.stack} aria-label="Tech stack">
                {project.stack.map((item) => (
                  <li key={item} className={styles.chip}>
                    {item}
                  </li>
                ))}
              </ul>
              <ul className={styles.highlights}>
                {project.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
