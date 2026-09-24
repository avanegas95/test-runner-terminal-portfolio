"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { identity } from "@/content/identity";
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

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMatches(mq.matches);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export function PortfolioPage({
  initialMode = "home",
  initialExpandedId = null,
}: PortfolioPageProps) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const { skipped, skip, skipLabel } = useAnimationSkip(reducedMotion);
  const isMobile = useMediaQuery("(max-width: 639px)");

  const [mode, setMode] = useState<ViewMode>(initialMode);
  const [expandedTestId, setExpandedTestId] = useState<string | null>(
    initialExpandedId,
  );

  const syncFromUrl = useCallback(() => {
    if (pathname === "/known-issues") {
      setMode("known-issues");
      setExpandedTestId("flaky-test");
      return;
    }

    const hash = window.location.hash.slice(1);
    if (hash) {
      setMode("expanded");
      setExpandedTestId(hash);
    } else {
      setMode("home");
      setExpandedTestId(null);
    }
  }, [pathname]);

  useEffect(() => {
    syncFromUrl();
    const onPopState = () => syncFromUrl();
    window.addEventListener("hashchange", syncFromUrl);
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("hashchange", syncFromUrl);
      window.removeEventListener("popstate", onPopState);
    };
  }, [syncFromUrl]);

  useEffect(() => {
    syncFromUrl();
  }, [pathname, syncFromUrl]);

  const handleExpand = useCallback((testId: string) => {
    setMode("expanded");
    setExpandedTestId(testId);
    window.history.pushState(null, "", `/#${testId}`);
  }, []);

  const handleCollapse = useCallback(() => {
    setMode("home");
    setExpandedTestId(null);
    window.history.pushState(null, "", "/");
  }, []);

  const handleOpenKnownIssues = useCallback(() => {
    setMode("known-issues");
    setExpandedTestId("flaky-test");
    router.push("/known-issues", { scroll: false });
  }, [router]);

  const handleBack = useCallback(() => {
    handleCollapse();
  }, [handleCollapse]);

  const handleSkip = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      skip();
    },
    [skip],
  );

  const isExpandedOrKnown = mode === "expanded" || mode === "known-issues";
  const showHint = mode === "home";

  return (
    <div
      className={`page${isMobile && isExpandedOrKnown ? " page--mobile-expanded" : ""}`}
    >
      {!isMobile && <IdentityAside showHint={showHint} />}

      {isMobile && !isExpandedOrKnown && <MobileHero />}

      {isMobile && isExpandedOrKnown && (
        <MobileHero compact onBack={handleBack} />
      )}

      <TerminalWindow
        mobile={isMobile}
        showSkip={mode === "home" && !skipped}
        skipLabel={skipLabel}
        onSkip={handleSkip}
        onBack={isExpandedOrKnown ? handleBack : undefined}
        onTerminalClick={mode === "home" && !skipped ? () => skip() : undefined}
      >
        <TestRun
          mode={mode}
          expandedTestId={expandedTestId}
          mobile={isMobile}
          skipped={skipped}
          onExpand={handleExpand}
          onCollapse={handleCollapse}
          onOpenKnownIssues={handleOpenKnownIssues}
          onBack={handleBack}
        />
      </TerminalWindow>

      {isMobile && isExpandedOrKnown && (
        <div className="mobile-nav-bottom">
          <IdentityNav mobile />
        </div>
      )}

      {isMobile && mode === "home" && (
        <p
          className="identity__hint"
          style={{ padding: "0 20px", margin: "16px 0 0" }}
        >
          {identity.hintMobile}
        </p>
      )}
    </div>
  );
}
