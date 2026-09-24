"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "test-run-animation-skipped";
/** Default pytest reveal duration (seconds) + buffer — used by terminal pytest animation. */
const RUN_MS = 4300;

export type RunState = "running" | "skipped" | "done";

/**
 * Tracks a timed reveal animation. `active` is true while the animation is on screen;
 * leaving it (or a reduced-motion / remembered-skip preference) ends the run for good.
 */
export function useAnimationSkip(reducedMotion: boolean, active: boolean) {
  const [state, setState] = useState<RunState>("running");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "true") setState("done");
    } catch {
      /* sessionStorage unavailable */
    }
  }, []);

  useEffect(() => {
    if (state !== "running") return;
    if (reducedMotion || !active) {
      setState("done");
      return;
    }
    const timer = setTimeout(() => setState("done"), RUN_MS);
    return () => clearTimeout(timer);
  }, [state, reducedMotion, active]);

  const skip = useCallback(() => {
    setState((s) => (s === "running" ? "skipped" : s));
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* sessionStorage unavailable */
    }
  }, []);

  return { state, skip };
}
