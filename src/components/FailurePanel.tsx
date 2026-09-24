"use client";

import { useEffect, useRef } from "react";
import type { FailureDetail } from "@/content/types";

type FailurePanelProps = {
  failure: FailureDetail;
  panelId: string;
};

export function FailurePanel({ failure, panelId }: FailurePanelProps) {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <div
      id={panelId}
      role="region"
      aria-label="Failure details"
      className="detail-panel detail-panel--fail"
      tabIndex={-1}
      ref={headingRef}
    >
      <div className="detail-panel__fail-title">{failure.title}</div>
      <div>
        expect(anderson.ignore(flakyTest)).toBe(
        <span className="detail-panel__expected-value">true</span>)
      </div>
      <div className="detail-panel__expected-grid">
        <span className="detail-panel__expected-label">Expected:</span>
        <span className="detail-panel__expected-value">{failure.expected}</span>
        <span className="detail-panel__expected-label">Received:</span>
        <span className="detail-panel__received-value">{failure.received}</span>
      </div>
      <div className="detail-panel__stack">{failure.stack}</div>
      <div className="detail-panel__status">{failure.statusComment}</div>
    </div>
  );
}
