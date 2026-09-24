import { resume } from "@/content/resume";
import shared from "./shared.module.css";
import styles from "./Skills.module.css";

export function Skills() {
  return (
    <section
      id="skills"
      className={`${shared.section} ${styles.skills}`}
      data-testid="section-skills"
      aria-labelledby="skills-heading"
    >
      <div className={shared.inner}>
        <h2 id="skills-heading" className={shared.heading}>
          Skills
        </h2>
        <p className={shared.subheading}>
          Testing frameworks, languages, and tooling — from pytest and Appium to
          AI-assisted development workflows.
        </p>

        <div className={styles.groups}>
          {resume.skills.map((group) => (
            <div key={group.id} className={styles.group}>
              <h3 className={styles.groupLabel}>{group.label}</h3>
              <ul className={styles.chips} aria-label={group.label}>
                {group.items.map((item) => (
                  <li key={item} className={styles.chip}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
