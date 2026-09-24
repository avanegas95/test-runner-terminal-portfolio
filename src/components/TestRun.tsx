"use client";

import { useCallback } from "react";
import {
  animationSchedule,
  computeSummary,
  failureDetail,
  getNextTestId,
  getTestById,
  suites,
} from "@/content/tests";
import type { Suite, Test } from "@/content/types";
import { Cursor } from "./Cursor";
import { DetailPanel } from "./DetailPanel";
import { FailurePanel } from "./FailurePanel";
import { KnownIssuesBlock } from "./KnownIssuesBlock";
import { SummaryBlock } from "./SummaryBlock";
import { SuiteHeader } from "./SuiteHeader";
import { TestRow } from "./TestRow";

export type ViewMode = "home" | "expanded" | "known-issues";

type TestRunProps = {
  mode: ViewMode;
  expandedTestId?: string | null;
  animate: boolean;
  onExpand: (testId: string) => void;
  onCollapse: () => void;
  onOpenKnownIssues: () => void;
};

const summary = computeSummary();

function suiteKey(file: string) {
  return `suite-${file.replace(".spec.ts", "")}`;
}

function suiteStatus(suite: Suite) {
  return suite.tests.some((t) => t.status === "fail") ? "fail" : "pass";
}

function shortName(test: Test) {
  return test.name.split(" — ")[0];
}

function FinalPrompt({ delay }: { delay?: number }) {
  return (
    <div
      className={`final-prompt${delay !== undefined ? " reveal-line" : ""}`}
      style={delay !== undefined ? { animationDelay: `${delay}s` } : undefined}
    >
      <span className="prompt__dollar">$</span>
      <Cursor />
    </div>
  );
}

export function TestRun({
  mode,
  expandedTestId,
  animate,
  onExpand,
  onCollapse,
  onOpenKnownIssues,
}: TestRunProps) {
  const expandedTest = expandedTestId ? getTestById(expandedTestId) : undefined;

  const navigateToTest = useCallback(
    (testId: string) => {
      if (getTestById(testId)?.status === "fail") {
        onOpenKnownIssues();
        return;
      }
      onExpand(testId);
    },
    [onExpand, onOpenKnownIssues],
  );

  const handleTestClick = useCallback(
    (test: Test) => {
      if (expandedTestId === test.id) {
        onCollapse();
      } else {
        onExpand(test.id);
      }
    },
    [expandedTestId, onCollapse, onExpand],
  );

  const promptCommand = () => {
    if (mode === "known-issues") return "npm test anderson --onlyFailures";
    if (mode === "expanded" && expandedTest) {
      return `npm test anderson -t "${shortName(expandedTest)}"`;
    }
    return "npm test anderson";
  };

  const renderTest = (test: Test) => {
    const isExpanded =
      (mode === "expanded" && test.id === expandedTestId) ||
      (mode === "known-issues" && test.status === "fail");
    const panelId = `panel-${test.id}`;
    const nextTest = getNextTestId(test.id);

    return (
      <div key={test.id}>
        <TestRow
          test={test}
          expanded={isExpanded}
          // The failing test is a route, not an inline toggle.
          href={
            test.status === "fail"
              ? isExpanded
                ? "/"
                : "/known-issues"
              : undefined
          }
          onClick={() => handleTestClick(test)}
          revealDelay={animate ? animationSchedule[test.id] : undefined}
          panelId={isExpanded ? panelId : undefined}
        />
        {isExpanded && test.status === "pass" && test.detail && (
          <DetailPanel
            detail={test.detail}
            testName={test.name}
            panelId={panelId}
            nextTestId={nextTest}
            nextTestName={nextTest ? shortName(getTestById(nextTest)!) : undefined}
            onCollapse={onCollapse}
            onNavigateTest={navigateToTest}
          />
        )}
        {isExpanded && test.status === "fail" && (
          <FailurePanel failure={failureDetail} panelId={panelId} />
        )}
      </div>
    );
  };

  const renderSuite = (suite: Suite) => (
    <div key={suite.file}>
      <SuiteHeader
        file={suite.file}
        status={suiteStatus(suite)}
        revealDelay={animate ? animationSchedule[suiteKey(suite.file)] : undefined}
      />
      <div className="test-list">{suite.tests.map(renderTest)}</div>
    </div>
  );

  const visibleSuites = () => {
    if (mode === "known-issues") {
      return suites.filter((s) => suiteStatus(s) === "fail");
    }
    // Expanding a test opens it inline; the rest of the run stays put.
    return suites;
  };

  return (
    <div className="run">
      <div className="prompt">
        <span className="prompt__dollar">$</span> {promptCommand()}
      </div>

      {mode !== "known-issues" && (
        <div
          className={`prompt__dim${animate ? " reveal-line" : ""}`}
          style={
            animate ? { animationDelay: `${animationSchedule.jest}s` } : undefined
          }
        >
          &gt; jest --verbose
        </div>
      )}

      {visibleSuites().map(renderSuite)}

      {mode !== "known-issues" && (
        <SummaryBlock
          passed={summary.passed}
          failed={summary.failed}
          skipped={summary.skipped}
          coverage={summary.coverage}
          timeSeconds={summary.timeSeconds}
          showComment
          revealDelay={animate ? animationSchedule.summary : undefined}
          commentDelay={animate ? animationSchedule.comment : undefined}
        />
      )}

      {mode === "known-issues" && <KnownIssuesBlock />}

      <FinalPrompt delay={animate ? animationSchedule.cursor : undefined} />
    </div>
  );
}
