"use client";

import type { Test } from "@/content/types";

type TestRowProps = {
  test: Test;
  expanded?: boolean;
  mobile?: boolean;
  onClick?: () => void;
  revealDelay?: number;
  animate?: boolean;
  panelId?: string;
};

export function TestRow({
  test,
  expanded,
  mobile,
  onClick,
  revealDelay,
  animate,
  panelId,
}: TestRowProps) {
  const isFail = test.status === "fail";
  const glyph = isFail ? "✗" : "✓";
  const statusLabel = isFail ? "Failed: " : "Passed: ";

  let rowClass = "test-row";
  if (mobile) rowClass += " test-row--mobile";
  if (expanded) {
    rowClass += isFail ? " test-row--expanded-fail" : " test-row--expanded";
  }
  if (animate) rowClass += " reveal-line";

  const timingContent = () => {
    if (isFail) {
      if (mobile) return "open ›";
      return "see Known Issues";
    }
    return test.ms !== null ? `${test.ms}ms` : "";
  };

  return (
    <button
      type="button"
      className={rowClass}
      onClick={onClick}
      aria-expanded={expanded}
      aria-controls={panelId}
      style={
        animate && revealDelay !== undefined
          ? { animationDelay: `${revealDelay}s` }
          : undefined
      }
    >
      <span
        className={
          isFail ? "test-row__glyph--fail" : "test-row__glyph--pass"
        }
        aria-hidden="true"
      >
        {glyph}
      </span>
      <span className={isFail ? "test-row__name--fail" : undefined}>
        <span className="sr-only">{statusLabel}</span>
        {test.name}
      </span>
      <span
        className={`test-row__timing${mobile ? " test-row__timing--mobile" : ""}${isFail ? " test-row__timing--hint" : ""}`}
      >
        {timingContent()}
      </span>
      {!mobile && (
        <span
          className={
            expanded
              ? isFail
                ? "test-row__chevron--open-fail"
                : "test-row__chevron--open"
              : "test-row__chevron"
          }
          aria-hidden="true"
        >
          {expanded ? "▾" : "›"}
        </span>
      )}
    </button>
  );
}
