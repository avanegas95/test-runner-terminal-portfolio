"use client";

import { useEffect, type ReactNode } from "react";
import { Button } from "./Button";

type TerminalWindowProps = {
  showSkip?: boolean;
  skipped?: boolean;
  onSkip?: () => void;
  onBack?: () => void;
  children: ReactNode;
};

export function TerminalWindow({
  showSkip,
  skipped,
  onSkip,
  onBack,
  children,
}: TerminalWindowProps) {
  const canSkip = Boolean(showSkip && !skipped && onSkip);

  useEffect(() => {
    if (!canSkip) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSkip?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [canSkip, onSkip]);

  return (
    <section
      aria-label="Test results"
      className="terminal"
      onClick={canSkip ? onSkip : undefined}
    >
      <div className="terminal__titlebar">
        <div className="terminal__titlebar-left">
          <span className="terminal__dots" aria-hidden="true">
            <span className="terminal__dot" />
            <span className="terminal__dot" />
            <span className="terminal__dot" />
          </span>
          <span>~/anderson — test run</span>
        </div>
        {showSkip && onSkip && (
          <Button small onClick={onSkip} disabled={skipped}>
            {skipped ? "Animation skipped" : "Skip animation"}
          </Button>
        )}
        {!showSkip && onBack && (
          <Button small onClick={onBack}>
            <span aria-hidden="true">←</span> All results
          </Button>
        )}
      </div>
      <div className="terminal__body">{children}</div>
    </section>
  );
}
