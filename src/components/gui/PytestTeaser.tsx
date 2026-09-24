"use client";

import { computeSummary } from "@/content/tests";
import { useTerminalContext } from "@/components/terminal/TerminalProvider";
import styles from "./PytestTeaser.module.css";

export function PytestTeaser() {
  const summary = computeSummary();
  const { open } = useTerminalContext();

  return (
    <button
      type="button"
      className={styles.teaser}
      data-testid="pytest-teaser"
      onClick={() => open("pytest")}
      aria-label={`Run pytest — ${summary.passed} passed, ${summary.failed} failed in ${summary.timeSeconds} seconds`}
    >
      <span className={styles.prompt}>
        <span className={styles.dollar}>$</span> pytest
      </span>
      <span className={styles.arrow} aria-hidden="true">
        →
      </span>
      <span className={styles.result}>
        <span className={styles.passed}>{summary.passed} passed</span>
        <span className={styles.sep}>, </span>
        <span className={styles.failed}>{summary.failed} failed</span>
        <span className={styles.dim}> in {summary.timeSeconds}s</span>
      </span>
      <span className={styles.runHint} aria-hidden="true">
        ▸ run it
      </span>
    </button>
  );
}
