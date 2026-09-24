import type { ExperienceRole } from "@/content/types";
import { ViewInTerminalButton } from "@/components/terminal/ViewInTerminalButton";
import { BulletText } from "./BulletText";
import styles from "./RoleCard.module.css";

type RoleCardProps = {
  role: ExperienceRole;
  company: string;
};

export function RoleCard({ role, company }: RoleCardProps) {
  const catCmd = `cat ${role.terminalPath}`;

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <div>
          <h3 className={styles.title}>{role.title}</h3>
          <p className={styles.company}>{company}</p>
        </div>
        <p className={styles.dates}>
          {role.startDate} – {role.endDate}
        </p>
      </header>

      <p className={styles.oneLiner}>{role.oneLiner}</p>

      <ul className={styles.bullets}>
        {role.bullets.map((bullet, i) => (
          <li key={i} className={styles.bullet}>
            <span className={styles.bulletGlyph} aria-hidden="true">
              ✓
            </span>
            <span>
              <BulletText
                text={bullet.text}
                glossaryTerms={bullet.glossaryTerms}
              />
            </span>
          </li>
        ))}
      </ul>

      <ViewInTerminalButton cmd={catCmd} />
    </article>
  );
}
