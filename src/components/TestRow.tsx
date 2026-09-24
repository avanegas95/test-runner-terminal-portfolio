"use client";

import Link from "next/link";
import type { Test } from "@/content/types";

type TestRowProps = {
  test: Test;
  expanded?: boolean;
  /** When set, the row is a link to a route instead of an inline toggle. */
  href?: string;
  onClick?: () => void;
  /** Reveal delay in seconds; omit to render without the reveal animation. */
  revealDelay?: number;
  panelId?: string;
};

export function TestRow({
  test,
  expanded,
  href,
  onClick,
  revealDelay,
  panelId,
}: TestRowProps) {
  const isFail = test.status === "fail";

  let rowClass = "test-row";
  if (expanded) {
    rowClass += isFail ? " test-row--expanded-fail" : " test-row--expanded";
  }
  if (revealDelay !== undefined) rowClass += " reveal-line";

  const style =
    revealDelay !== undefined ? { animationDelay: `${revealDelay}s` } : undefined;

  const content = (
    <>
      <span
        className={isFail ? "test-row__glyph--fail" : "test-row__glyph--pass"}
        aria-hidden="true"
      >
        {isFail ? "✗" : "✓"}
      </span>
      <span className={isFail ? "test-row__name--fail" : undefined}>
        <span className="sr-only">{isFail ? "Failed: " : "Passed: "}</span>
        {test.name}
      </span>
      <span
        className={`test-row__timing${isFail ? " test-row__timing--hint" : ""}`}
      >
        {isFail ? (
          <>
            <span className="only-desktop">see Known Issues</span>
            <span className="only-mobile">open ›</span>
          </>
        ) : test.ms !== null ? (
          `${test.ms}ms`
        ) : null}
      </span>
      <span
        className={`test-row__chev ${
          expanded
            ? isFail
              ? "test-row__chevron--open-fail"
              : "test-row__chevron--open"
            : "test-row__chevron"
        }`}
        aria-hidden="true"
      >
        {expanded ? "▾" : "›"}
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        id={`row-${test.id}`}
        href={href}
        className={rowClass}
        style={style}
        aria-current={expanded ? "page" : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      id={`row-${test.id}`}
      type="button"
      className={rowClass}
      onClick={onClick}
      aria-expanded={Boolean(expanded)}
      aria-controls={panelId}
      style={style}
    >
      {content}
    </button>
  );
}
