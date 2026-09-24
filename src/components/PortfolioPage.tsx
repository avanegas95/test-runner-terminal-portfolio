"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { identity } from "@/content/identity";
import { getTestById } from "@/content/tests";
import { useAnimationSkip } from "@/hooks/useAnimationSkip";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { IdentityAside } from "./IdentityAside";
import { MobileHero } from "./MobileHero";
import { IdentityNav } from "./IdentityNav";
import { TerminalWindow } from "./TerminalWindow";
import { TestRun, type ViewMode } from "./TestRun";

type PortfolioPageProps = {
  initialMode?: ViewMode;
  initialExpandedId?: string | null;
};

/** Only passing tests with a detail panel can be deep-linked by hash. */
function isExpandableTest(id: string) {
  const test = getTestById(id);
  return test?.status === "pass" && Boolean(test.detail);
}

export function PortfolioPage({
  initialMode = "home",
  initialExpandedId = null,
}: PortfolioPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  const [mode, setMode] = useState<ViewMode>(initialMode);
  const [expandedTestId, setExpandedTestId] = useState<string | null>(
    initialExpandedId,
  );
  const { state: runState, skip } = useAnimationSkip(
    reducedMotion,
    mode === "home",
  );

  const syncFromUrl = useCallback(() => {
    if (pathname === "/known-issues") {
      setMode("known-issues");
      setExpandedTestId("flaky-test");
      return;
    }

    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash && isExpandableTest(hash)) {
      setMode("expanded");
      setExpandedTestId(hash);
    } else {
      setMode("home");
      setExpandedTestId(null);
    }
  }, [pathname]);

  useEffect(() => {
    syncFromUrl();
    window.addEventListener("hashchange", syncFromUrl);
    window.addEventListener("popstate", syncFromUrl);
    return () => {
      window.removeEventListener("hashchange", syncFromUrl);
      window.removeEventListener("popstate", syncFromUrl);
    };
  }, [syncFromUrl]);

  const handleExpand = useCallback((testId: string) => {
    setMode("expanded");
    setExpandedTestId(testId);
    window.history.pushState(null, "", `/#${testId}`);
  }, []);

  const handleCollapse = useCallback(() => {
    const previousId = expandedTestId;
    if (pathname !== "/") {
      router.push("/", { scroll: false });
      return;
    }
    setMode("home");
    setExpandedTestId(null);
    window.history.pushState(null, "", "/");
    // Return focus to the row that was expanded.
    if (previousId) {
      requestAnimationFrame(() =>
        document.getElementById(`row-${previousId}`)?.focus(),
      );
    }
  }, [expandedTestId, pathname, router]);

  const handleOpenKnownIssues = useCallback(() => {
    router.push("/known-issues", { scroll: false });
  }, [router]);

  const isExpandedOrKnown = mode === "expanded" || mode === "known-issues";
  const running = mode === "home" && runState === "running";

  return (
    <div className={`page${isExpandedOrKnown ? " page--expanded" : ""}`}>
      <IdentityAside showHint={mode === "home"} />

      {isExpandedOrKnown ? (
        <MobileHero compact onBack={handleCollapse} />
      ) : (
        <MobileHero />
      )}

      <TerminalWindow
        showSkip={mode === "home" && runState !== "done"}
        skipped={runState === "skipped"}
        onSkip={skip}
        onBack={isExpandedOrKnown ? handleCollapse : undefined}
      >
        <TestRun
          mode={mode}
          expandedTestId={expandedTestId}
          animate={running}
          onExpand={handleExpand}
          onCollapse={handleCollapse}
          onOpenKnownIssues={handleOpenKnownIssues}
        />
      </TerminalWindow>

      {isExpandedOrKnown ? (
        <div className="mobile-nav-bottom">
          <IdentityNav mobile />
        </div>
      ) : (
        <p className="mobile-hint">{identity.hintMobile}</p>
      )}
    </div>
  );
}
