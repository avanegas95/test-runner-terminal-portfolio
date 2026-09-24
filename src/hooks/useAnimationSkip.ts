"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "test-run-animation-skipped";

export function useAnimationSkip(reducedMotion: boolean) {
  const [skipped, setSkipped] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) {
      setSkipped(true);
      return;
    }
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "true") {
        setSkipped(true);
      }
    } catch {
      /* sessionStorage unavailable */
    }
  }, [reducedMotion]);

  const skip = useCallback(() => {
    setSkipped(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      /* sessionStorage unavailable */
    }
  }, []);

  return { skipped, skip, skipLabel: skipped ? "Animation skipped" : "Skip animation" };
}
