"use client";

import { useCallback, useEffect, type ReactNode } from "react";
import { Button } from "./Button";

type TerminalWindowProps = {
  mobile?: boolean;
  showSkip?: boolean;
  skipLabel?: string;
  onSkip?: () => void;
  onBack?: () => void;
  onTerminalClick?: () => void;
  children: ReactNode;
};

export function TerminalWindow({
  mobile,
  showSkip,
  skipLabel,
  onSkip,
  onBack,
  onTerminalClick,
  children,
}: TerminalWindowProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && showSkip && onSkip) {
        onSkip();
      }
    },
    [showSkip, onSkip],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <section
      aria-label="Test results"
      className={`terminal${mobile ? " terminal--mobile" : ""}`}
      onClick={showSkip ? onTerminalClick : undefined}
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
          <Button small mobile={mobile} onClick={onSkip}>
            {skipLabel}
          </Button>
        )}
        {!showSkip && onBack && (
          <Button small mobile={mobile} onClick={onBack}>
            <span aria-hidden="true">←</span> All results
          </Button>
        )}
      </div>
      <div
        className={`terminal__body${mobile ? " terminal__body--mobile" : ""}`}
      >
        {children}
      </div>
    </section>
  );
}
