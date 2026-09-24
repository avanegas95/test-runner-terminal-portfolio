"use client";

import type { OutputLine, Segment, SegmentAction } from "@/terminal/types";
import styles from "./TerminalOutput.module.css";

type TerminalOutputProps = {
  lines: OutputLine[];
  isAnimating: boolean;
  onSegmentAction: (action: SegmentAction) => void;
  onFocusInput: () => void;
};

function SegmentView({
  segment,
  onAction,
}: {
  segment: Segment;
  onAction: (action: SegmentAction) => void;
}) {
  const className = segment.style ? styles[segment.style] : undefined;

  if (segment.action) {
    return (
      <button
        type="button"
        className={`${styles.segment} ${styles.clickable} ${className ?? ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onAction(segment.action!);
        }}
      >
        {segment.text}
      </button>
    );
  }

  return <span className={`${styles.segment} ${className ?? ""}`}>{segment.text}</span>;
}

export function TerminalOutput({
  lines,
  isAnimating,
  onSegmentAction,
  onFocusInput,
}: TerminalOutputProps) {
  return (
    <div
      className={styles.output}
      data-testid="terminal-output"
      role="log"
      aria-live={isAnimating ? "off" : "polite"}
      aria-relevant="additions"
      onClick={onFocusInput}
    >
      {lines.map((outputLine, lineIndex) => (
        <div
          key={lineIndex}
          className={styles.line}
          data-testid="terminal-line"
        >
          {outputLine.segments.map((segment, segIndex) => (
            <SegmentView
              key={segIndex}
              segment={segment}
              onAction={onSegmentAction}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
