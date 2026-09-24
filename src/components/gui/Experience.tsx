import { resume } from "@/content/resume";
import { RoleCard } from "./RoleCard";
import shared from "./shared.module.css";
import styles from "./Experience.module.css";

export function Experience() {
  return (
    <section
      id="experience"
      className={`${shared.section} ${styles.experience}`}
      data-testid="section-experience"
      aria-labelledby="experience-heading"
    >
      <div className={shared.inner}>
        <h2 id="experience-heading" className={shared.heading}>
          Experience
        </h2>
        <p className={shared.subheading}>
          QA and automation across robotics and consumer products — from manual
          testing to tiered regression libraries and nightly HIL triage.
        </p>

        <div className={styles.timeline}>
          {resume.experience.map((company) => (
            <div key={company.id} className={styles.companyGroup}>
              <h3 className={styles.companyName}>{company.company}</h3>
              <div className={styles.roles}>
                {company.roles.map((role) => (
                  <RoleCard
                    key={role.id}
                    role={role}
                    company={company.company}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
