import Link from "next/link";
import { knownIssues, knownIssuesMeta } from "@/content/known-issues";
import type { KnownIssueSeverity } from "@/content/types";
import { failureDetail } from "@/content/tests";
import shared from "./shared.module.css";
import styles from "./About.module.css";

function SeverityChip({ severity }: { severity: KnownIssueSeverity }) {
  const className = [
    styles.severity,
    severity === "medium" && styles.severityMedium,
    severity === "cosmetic" && styles.severityCosmetic,
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={className}>{severity}</span>;
}

export function About() {
  return (
    <section
      id="about"
      className={`${shared.section} ${styles.about}`}
      data-testid="section-about"
      aria-labelledby="about-heading"
    >
      <div className={shared.inner}>
        <h2 id="about-heading" className={shared.heading}>
          {knownIssuesMeta.title}
        </h2>
        <p className={shared.subheading}>{knownIssuesMeta.subtitle}</p>

        <div className={styles.panel}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Issue</th>
                <th scope="col">Severity</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {knownIssues.map((issue) => (
                <tr key={issue.id}>
                  <td className={styles.idCell}>{issue.id}</td>
                  <td>{issue.issue}</td>
                  <td>
                    <SeverityChip severity={issue.severity} />
                  </td>
                  <td className={styles.statusCell}>{issue.status}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className={styles.list}>
            {knownIssues.map((issue) => (
              <li key={issue.id} className={styles.listItem}>
                <div className={styles.listMeta}>
                  <span className={styles.idCell}>{issue.id}</span>
                  <SeverityChip severity={issue.severity} />
                  <span className={styles.statusCell}>{issue.status}</span>
                </div>
                <div>{issue.issue}</div>
              </li>
            ))}
          </ul>

          <div className={styles.flakyJoke}>
            <p className={styles.flakyTitle}>
              <span className={styles.failGlyph} aria-hidden="true">
                F
              </span>{" "}
              {failureDetail.title}
            </p>
            <p className={styles.flakyComment}>{failureDetail.statusComment}</p>
            <p className={styles.flakyHint}>
              The one failing pytest check is on purpose — QA humor, not a bug.
            </p>
          </div>

          <div className={styles.footer}>
            <span className={styles.footerText}>
              {knownIssuesMeta.footerPrompt}
            </span>
            <Link href="#contact" className={`${shared.btn} ${shared.btnPrimary}`}>
              {knownIssuesMeta.footerAction}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
