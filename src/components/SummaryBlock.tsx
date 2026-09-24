import Link from "next/link";

type SummaryBlockProps = {
  passed: number;
  failed: number;
  skipped: number;
  coverage: number;
  timeSeconds: string;
  showComment?: boolean;
  /** Reveal delays in seconds; omit to render without the reveal animation. */
  revealDelay?: number;
  commentDelay?: number;
};

export function SummaryBlock({
  passed,
  failed,
  skipped,
  coverage,
  timeSeconds,
  showComment = true,
  revealDelay,
  commentDelay,
}: SummaryBlockProps) {
  return (
    <>
      <div
        className={`summary${revealDelay !== undefined ? " reveal-line" : ""}`}
        style={
          revealDelay !== undefined
            ? { animationDelay: `${revealDelay}s` }
            : undefined
        }
      >
        <span className="summary__label">Tests:</span>
        <span>
          <strong className="summary__passed">{passed} passed</strong>,{" "}
          <strong className="summary__failed">{failed} failed</strong>,{" "}
          {skipped} skipped — coverage {coverage}%
        </span>
        <span className="summary__label">Coverage:</span>
        <span className="summary__coverage-row">
          <span
            className="coverage-bar"
            role="img"
            aria-label={`${coverage} percent coverage`}
          >
            <span
              className="coverage-bar__fill"
              style={{ width: `${coverage}%` }}
            />
          </span>
          {coverage}%
        </span>
        <span className="summary__label">Time:</span>
        <span>{timeSeconds}s</span>
      </div>

      {showComment && (
        <p
          className={`summary__comment${commentDelay !== undefined ? " reveal-line" : ""}`}
          style={
            commentDelay !== undefined
              ? { animationDelay: `${commentDelay}s` }
              : undefined
          }
        >
          {"// "}
          {passed} of {passed + failed} checks pass.{" "}
          <Link href="/known-issues" className="summary__comment-link">
            The failing one
          </Link>{" "}
          is the fun part.
        </p>
      )}
    </>
  );
}
