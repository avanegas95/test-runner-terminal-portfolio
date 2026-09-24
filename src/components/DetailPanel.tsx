"use client";

import { useEffect, useRef } from "react";
import type { Detail } from "@/content/types";
import { Button } from "./Button";

type DetailPanelProps = {
  detail: Detail;
  testName: string;
  panelId: string;
  mobile?: boolean;
  nextTestId?: string | null;
  nextTestName?: string;
  onCollapse: () => void;
  onNavigateTest?: (testId: string) => void;
};

export function DetailPanel({
  detail,
  testName,
  panelId,
  mobile,
  nextTestId,
  nextTestName,
  onCollapse,
  onNavigateTest,
}: DetailPanelProps) {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div
      id={panelId}
      role="region"
      aria-label={`${testName} details`}
      className={`detail-panel${mobile ? " detail-panel--mobile" : ""}`}
      tabIndex={-1}
      ref={headingRef}
    >
      {detail.metadata && (
        <dl className="detail-panel__meta">
          <dt>role</dt>
          <dd>{detail.metadata.role}</dd>
          <dt>company</dt>
          <dd>{detail.metadata.company}</dd>
          <dt>period</dt>
          <dd>{detail.metadata.period}</dd>
        </dl>
      )}

      <p className="detail-panel__plain">
        <span className="detail-panel__plain-prefix">{"// In plain English:"}</span>{" "}
        {detail.plainEnglish}
      </p>

      {detail.bullets && detail.bullets.length > 0 && (
        <div>
          <div>
            describe(
            <span className="detail-panel__describe">
              &apos;{detail.describeLabel ?? "details"}&apos;
            </span>
            )
          </div>
          <ul className="detail-panel__bullets">
            {detail.bullets.map((bullet) => (
              <li key={bullet} className="detail-panel__bullet">
                <span className="detail-panel__bullet-glyph" aria-hidden="true">
                  ✓
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {detail.glossary && detail.glossary.length > 0 && (
        <div className="detail-panel__glossary">
          {detail.glossary.map((line) => (
            <div key={line}>{"// "}{line}</div>
          ))}
        </div>
      )}

      <div
        className={`detail-panel__actions${mobile ? " detail-panel__actions--mobile" : ""}`}
      >
        {mobile ? (
          <>
            <Button href="/resume" primary mobile>
              Full resume<span aria-hidden="true">→</span>
            </Button>
            <div className="detail-panel__actions-row">
              <Button mobile onClick={onCollapse}>
                <span aria-hidden="true">▴</span> Collapse
              </Button>
              {nextTestId && nextTestName && onNavigateTest && (
                <Button mobile onClick={() => onNavigateTest(nextTestId)}>
                  Next: {nextTestName.split(" — ")[0]}
                  <span aria-hidden="true">→</span>
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <Button onClick={onCollapse}>
              <span aria-hidden="true">▴</span> Collapse
            </Button>
            {nextTestId && nextTestName && onNavigateTest && (
              <Button onClick={() => onNavigateTest(nextTestId)}>
                Next: {nextTestName.split(" — ")[0]}
                <span aria-hidden="true">→</span>
              </Button>
            )}
            <Button href="/resume" primary>
              Full resume<span aria-hidden="true">→</span>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
