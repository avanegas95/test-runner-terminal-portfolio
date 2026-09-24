import { knownIssues, knownIssuesMeta } from "@/content/known-issues";
import type { KnownIssueSeverity } from "@/content/types";
import { Button } from "./Button";

function SeverityChip({ severity }: { severity: KnownIssueSeverity }) {
  const className = [
    "severity-chip",
    severity === "medium" && "severity-chip--medium",
    severity === "cosmetic" && "severity-chip--cosmetic",
  ]
    .filter(Boolean)
    .join(" ");

  return <span className={className}>{severity}</span>;
}

export function KnownIssuesBlock() {
  return (
    <>
      <div className="known-issues-prompt">
        <span className="prompt__dollar">$</span> cat KNOWN_ISSUES.md
      </div>
      <div className="known-issues-panel">
        <div>
          <h2 className="known-issues-panel__title">
            <span className="known-issues-panel__hash">#</span>{" "}
            {knownIssuesMeta.title}
          </h2>
          <p className="known-issues-panel__subtitle">
            {knownIssuesMeta.subtitle}
          </p>
        </div>

        <table className="ki-table">
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
                <td className="ki-table__id">{issue.id}</td>
                <td>{issue.issue}</td>
                <td className="ki-table__severity">
                  <SeverityChip severity={issue.severity} />
                </td>
                <td className="ki-table__status">{issue.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="ki-list">
          {knownIssues.map((issue) => (
            <li key={issue.id} className="ki-list__item">
              <div className="ki-list__meta">
                <span className="ki-list__id">{issue.id}</span>
                <SeverityChip severity={issue.severity} />
                <span className="ki-list__status">{issue.status}</span>
              </div>
              <div>{issue.issue}</div>
            </li>
          ))}
        </ul>

        <div className="known-issues-panel__footer">
          <span className="known-issues-panel__footer-text">
            {knownIssuesMeta.footerPrompt}
          </span>
          <Button href={knownIssuesMeta.footerHref} primary>
            {knownIssuesMeta.footerAction}
            <span aria-hidden="true">→</span>
          </Button>
        </div>
      </div>
    </>
  );
}
