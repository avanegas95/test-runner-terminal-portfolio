"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { knownIssues } from "@/content/known-issues";
import { resume, allRoles } from "@/content/resume";
import {
  allTests,
  computeSummary,
  failureDetail,
  pytestSuites,
} from "@/content/tests";
import type { PytestTest } from "@/content/types";
import styles from "./ReportView.module.css";

type Filter = "all" | "passed" | "failed";

function formatDuration(ms: number | null) {
  if (ms === null) return "—";
  return `${(ms / 1000).toFixed(2)}s`;
}

function getTestDetail(test: PytestTest) {
  if (test.resumeRef === "about") {
    return {
      title: "Known Issues",
      subtitle: "The one failing test — working as intended.",
      bullets: knownIssues.map((ki) => `${ki.id}: ${ki.issue} (${ki.status})`),
      extra: failureDetail.statusComment,
    };
  }

  if (test.resumeRef.startsWith("experience/")) {
    const roleId = test.resumeRef.split("/").pop()!;
    const role = allRoles.find((r) => r.id === roleId);
    if (role) {
      return {
        title: `${role.title} — ${role.company}`,
        subtitle: `${role.startDate} – ${role.endDate}`,
        bullets: role.bullets.map((b) => b.text),
      };
    }
  }

  if (test.resumeRef.startsWith("skills/")) {
    const groupId = test.resumeRef.split("/").pop()!;
    const group = resume.skills.find((g) => g.id === groupId);
    if (group) {
      return {
        title: group.label,
        subtitle: test.docstring,
        bullets: group.items,
      };
    }
  }

  return {
    title: test.name,
    subtitle: test.docstring,
    bullets: [] as string[],
  };
}

export function ReportView() {
  const summary = computeSummary();
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const filteredTests = useMemo(() => {
    if (filter === "all") return allTests;
    return allTests.filter((t) => t.status === filter);
  }, [filter]);

  function toggleRow(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <p className={styles.eyebrow}>reports/anderson_report.html</p>
            <h1 className={styles.title}>Test Report</h1>
          </div>
          <div className={styles.headerActions}>
            <button
              type="button"
              className={styles.printBtn}
              onClick={() => window.print()}
            >
              Download as PDF
            </button>
            <Link href="/" className={styles.backLink}>
              ← Back to portfolio
            </Link>
          </div>
        </div>

        <table className={styles.envTable}>
          <caption className={styles.srOnly}>Environment</caption>
          <tbody>
            <tr>
              <th scope="row">Name</th>
              <td>{resume.profile.name}</td>
              <th scope="row">Title</th>
              <td>{resume.profile.title}</td>
            </tr>
            <tr>
              <th scope="row">Location</th>
              <td>{resume.profile.location}</td>
              <th scope="row">Education</th>
              <td>
                {resume.education.degree}, {resume.education.institution} (
                {resume.education.year})
              </td>
            </tr>
            <tr>
              <th scope="row">Email</th>
              <td>
                <a href={`mailto:${resume.contact.email}`}>
                  {resume.contact.email}
                </a>
              </td>
              <th scope="row">Links</th>
              <td>
                <a href={resume.contact.linkedIn}>LinkedIn</a>
                {" · "}
                <a href={resume.contact.github}>GitHub</a>
              </td>
            </tr>
          </tbody>
        </table>
      </header>

      <div className={styles.summaryBar}>
        <span className={styles.summaryItem}>
          <strong className={styles.passed}>{summary.passed}</strong> passed
        </span>
        <span className={styles.summaryItem}>
          <strong className={styles.failed}>{summary.failed}</strong> failed
        </span>
        <span className={styles.summaryItem}>
          <strong>{summary.skipped}</strong> skipped
        </span>
        <span className={styles.summaryItem}>
          in <strong>{summary.timeSeconds}s</strong>
        </span>

        <div className={styles.filters} role="group" aria-label="Filter results">
          <button
            type="button"
            className={`${styles.filterBtn} ${filter === "all" ? styles.filterActive : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${filter === "passed" ? styles.filterActive : ""}`}
            onClick={() => setFilter("passed")}
          >
            Passed
          </button>
          <button
            type="button"
            className={`${styles.filterBtn} ${filter === "failed" ? styles.filterActive : ""}`}
            onClick={() => setFilter("failed")}
          >
            Failed
          </button>
        </div>
      </div>

      <section className={styles.printSections} aria-label="Resume sections">
        <h2 className={styles.printHeading}>Experience</h2>
        {resume.experience.map((co) => (
          <div key={co.id} className={styles.printBlock}>
            <h3>{co.company}</h3>
            {co.roles.map((role) => (
              <div key={role.id}>
                <p>
                  <strong>{role.title}</strong> ({role.startDate} –{" "}
                  {role.endDate})
                </p>
                <ul>
                  {role.bullets.map((b) => (
                    <li key={b.text}>{b.text}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}

        <h2 className={styles.printHeading}>Projects</h2>
        {resume.projects.map((p) => (
          <div key={p.id} className={styles.printBlock}>
            <h3>{p.name}</h3>
            <p>{p.summary}</p>
          </div>
        ))}

        <h2 className={styles.printHeading}>Skills</h2>
        <div className={styles.printBlock}>
          {resume.skills.map((g) => (
            <p key={g.id}>
              <strong>{g.label}:</strong> {g.items.join(", ")}
            </p>
          ))}
        </div>

        <h2 className={styles.printHeading}>Education</h2>
        <div className={styles.printBlock}>
          <p>
            {resume.education.degree}, {resume.education.institution} (
            {resume.education.year})
          </p>
        </div>
      </section>

      <div className={styles.results}>
        <table className={styles.resultsTable}>
          <thead>
            <tr>
              <th scope="col">Result</th>
              <th scope="col">Test</th>
              <th scope="col">Marker</th>
              <th scope="col">Duration</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.map((test) => {
              const isOpen = expanded.has(test.id);
              const detail = getTestDetail(test);
              return (
                <tr
                  key={test.id}
                  data-result={test.status}
                  data-testid="report-row"
                  className={styles.resultRow}
                >
                  <td colSpan={4} className={styles.resultCell}>
                    <button
                      type="button"
                      className={styles.rowBtn}
                      onClick={() => toggleRow(test.id)}
                      aria-expanded={isOpen}
                    >
                      <span
                        className={
                          test.status === "passed"
                            ? styles.resultPassed
                            : styles.resultFailed
                        }
                      >
                        {test.status === "passed" ? "Passed" : "Failed"}
                      </span>
                      <span className={styles.testName}>
                        {test.file}::{test.name}
                      </span>
                      <span className={styles.marker}>[{test.marker}]</span>
                      <span className={styles.duration}>
                        {formatDuration(test.durationMs)}
                      </span>
                    </button>
                    {isOpen && (
                      <div
                        className={styles.rowDetail}
                        data-testid="report-row-detail"
                      >
                        <h3 className={styles.detailTitle}>{detail.title}</h3>
                        {detail.subtitle && (
                          <p className={styles.detailSubtitle}>
                            {detail.subtitle}
                          </p>
                        )}
                        {detail.bullets.length > 0 && (
                          <ul className={styles.detailList}>
                            {detail.bullets.map((b) => (
                              <li key={b}>{b}</li>
                            ))}
                          </ul>
                        )}
                        {"extra" in detail && detail.extra && (
                          <p className={styles.detailExtra}>{detail.extra}</p>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredTests.length === 0 && (
          <p className={styles.empty}>No tests match the current filter.</p>
        )}
      </div>

      <footer className={styles.footer}>
        <p>
          Generated by pytest-html · {pytestSuites.length} files ·{" "}
          {allTests.length} tests collected
        </p>
      </footer>
    </div>
  );
}
