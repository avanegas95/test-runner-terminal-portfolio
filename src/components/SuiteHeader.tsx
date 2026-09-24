import type { TestStatus } from "@/content/types";

type SuiteHeaderProps = {
  file: string;
  status: TestStatus;
  /** Reveal delay in seconds; omit to render without the reveal animation. */
  revealDelay?: number;
};

export function SuiteHeader({ file, status, revealDelay }: SuiteHeaderProps) {
  return (
    <div
      className={`suite-header${revealDelay !== undefined ? " reveal-line" : ""}`}
      style={
        revealDelay !== undefined
          ? { animationDelay: `${revealDelay}s` }
          : undefined
      }
    >
      <span className={`badge badge--${status}`}>
        {status === "pass" ? "PASS" : "FAIL"}
      </span>
      <span>{file}</span>
    </div>
  );
}
