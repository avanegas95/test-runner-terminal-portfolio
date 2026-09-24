"use client";

import { useCallback } from "react";
import {
  animationSchedule,
  computeSummary,
  failureDetail,
  getNextTestId,
  getSuiteForTest,
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
  mobile?: boolean;
  skipped: boolean;
  onExpand: (testId: string) => void;
  onCollapse: () => void;
  onOpenKnownIssues: () => void;
  onBack: () => void;
};

function suiteKey(file: string) {
  if (file === "career.spec.ts") return "suite-career";
  if (file === "automation.spec.ts") return "suite-automation";
  if (file === "tooling.spec.ts") return "suite-tooling";
  return "suite-personality";
}

function shouldShowSuite(
  suite: Suite,
  mode: ViewMode,
  expandedTestId: string | null | undefined,
): boolean {
  if (mode === "home" || mode === "known-issues") return true;
  if (!expandedTestId) return true;
  const expandedSuite = getSuiteForTest(expandedTestId);
  return expandedSuite?.file === suite.file;
}

function collapsedSuiteSummary(expandedTestId: string) {
  const expandedSuite = getSuiteForTest(expandedTestId);
  const hiddenSuites = suites.filter((s) => s.file !== expandedSuite?.file);
  const hiddenCount = hiddenSuites.length;
  const hiddenPassed = hiddenSuites
    .flatMap((s) => s.tests)
    .filter((t) => t.status === "pass").length;
  const hiddenFailed = hiddenSuites
    .flatMap((s) => s.tests)
    .filter((t) => t.status === "fail").length;
  return { hiddenCount, hiddenPassed, hiddenFailed };
}

export function TestRun({
  mode,
  expandedTestId,
  mobile,
  skipped,
  onExpand,
  onCollapse,
  onOpenKnownIssues,
  onBack,
}: TestRunProps) {
  const summary = computeSummary();
  const animate = mode === "home" && !skipped;
  const expandedTest = expandedTestId
    ? suites.flatMap((s) => s.tests).find((t) => t.id === expandedTestId)
    : null;
  const navigateToTest = useCallback(
    (testId: string) => {
      const test = suites.flatMap((s) => s.tests).find((t) => t.id === testId);
      if (test?.status === "fail") {
        onOpenKnownIssues();
        return;
      }
      onExpand(testId);
    },
    [onExpand, onOpenKnownIssues],
  );

  const handleTestClick = useCallback(
    (test: Test) => {
      if (test.status === "fail") {
        onOpenKnownIssues();
        return;
      }
      if (expandedTestId === test.id) {
        onCollapse();
      } else {
        onExpand(test.id);
      }
    },
    [expandedTestId, onCollapse, onExpand, onOpenKnownIssues],
  );

  const promptCommand = () => {
    if (mode === "known-issues") return "npm test anderson --onlyFailures";
    if (mode === "expanded" && expandedTest) {
      const shortName = expandedTest.name.split(" — ")[0];
      return `npm test anderson -t "${shortName}"`;
    }
    return "npm test anderson";
  };

  const renderTest = (test: Test) => {
    const isExpanded =
      (mode === "expanded" && test.id === expandedTestId) ||
      (mode === "known-issues" && test.id === "flaky-test");
    const panelId = `panel-${test.id}`;
    const revealDelay = animationSchedule[test.id];

    return (
      <div key={test.id}>
        <TestRow
          test={test}
          expanded={isExpanded}
          mobile={mobile}
          onClick={() => handleTestClick(test)}
          revealDelay={revealDelay}
          animate={animate}
          panelId={isExpanded ? panelId : undefined}
        />
        {isExpanded && test.status === "pass" && test.detail && (
          <DetailPanel
            detail={test.detail}
            testName={test.name}
            panelId={panelId}
            mobile={mobile}
            nextTestId={getNextTestId(test.id)}
            nextTestName={
              suites
                .flatMap((s) => s.tests)
                .find((t) => t.id === getNextTestId(test.id))?.name
            }
            onCollapse={onCollapse}
            onNavigateTest={navigateToTest}
          />
        )}
        {isExpanded && test.status === "fail" && mode === "known-issues" && (
          <FailurePanel failure={failureDetail} panelId={panelId} mobile={mobile} />
        )}
      </div>
    );
  };

  const renderSuites = () => {
    if (mode === "known-issues") {
      const personalitySuite = suites.find(
        (s) => s.file === "personality.spec.ts",
      )!;
      return (
        <>
          <SuiteHeader
            file={personalitySuite.file}
            status="fail"
            mobile={mobile}
          />
          <div className={`test-list${mobile ? " test-list--mobile" : ""}`}>
            {personalitySuite.tests.map((test) => renderTest(test))}
          </div>
        </>
      );
    }

    return suites.map((suite) => {
      if (!shouldShowSuite(suite, mode, expandedTestId)) return null;

      const suiteDelay = animationSchedule[suiteKey(suite.file)];
      const suiteStatus = suite.tests.some((t) => t.status === "fail")
        ? "fail"
        : "pass";

      return (
        <div key={suite.file}>
          <SuiteHeader
            file={suite.file}
            status={suiteStatus}
            mobile={mobile}
            revealDelay={suiteDelay}
            animate={animate}
          />
          <div className={`test-list${mobile ? " test-list--mobile" : ""}`}>
            {suite.tests.map((test) => renderTest(test))}
          </div>
        </div>
      );
    });
  };

  const collapsed =
    mode === "expanded" && expandedTestId
      ? collapsedSuiteSummary(expandedTestId)
      : null;

  return (
    <div className={`run${skipped ? " run--skipped" : ""}`}>
      <div className="prompt">
        <span className="prompt__dollar">$</span> {promptCommand()}
      </div>

      {mode === "home" && (
        <div
          className={`prompt__dim${animate ? " reveal-line" : ""}`}
          style={
            animate
              ? { animationDelay: `${animationSchedule.jest}s` }
              : undefined
          }
        >
          &gt; jest --verbose
        </div>
      )}

      {renderSuites()}

      {collapsed && collapsed.hiddenCount > 0 && (
        <div className="collapsed-suites">
          <button type="button" className="test-row" onClick={onBack}>
            <span aria-hidden="true">+</span>
            <span>
              {collapsed.hiddenCount} more suites · {collapsed.hiddenPassed}{" "}
              passed, {collapsed.hiddenFailed} failed
            </span>
            <span />
            <span className="test-row__chevron" aria-hidden="true">
              ›
            </span>
          </button>
        </div>
      )}

      {mode === "home" && (
        <>
          <SummaryBlock
            passed={summary.passed}
            failed={summary.failed}
            skipped={summary.skipped}
            coverage={summary.coverage}
            timeSeconds={summary.timeSeconds}
            revealDelay={animationSchedule.summary}
            animate={animate}
          />
          <div
            className={animate ? " reveal-line" : ""}
            style={
              animate
                ? { animationDelay: `${animationSchedule.cursor}s` }
                : { marginTop: "16px" }
            }
          >
            <span className="prompt__dollar">$</span>
            <Cursor />
          </div>
        </>
      )}

      {mode === "expanded" && (
        <>
          <SummaryBlock
            passed={summary.passed}
            failed={summary.failed}
            skipped={summary.skipped}
            coverage={summary.coverage}
            timeSeconds={summary.timeSeconds}
            showComment={false}
          />
          <div style={{ marginTop: "16px" }}>
            <span className="prompt__dollar">$</span>
            <Cursor />
          </div>
        </>
      )}

      {mode === "known-issues" && (
        <>
          <KnownIssuesBlock mobile={mobile} />
          <div style={{ marginTop: "20px" }}>
            <span className="prompt__dollar">$</span>
            <Cursor />
          </div>
        </>
      )}
    </div>
  );
}
