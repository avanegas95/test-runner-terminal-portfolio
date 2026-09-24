"use client";

import { useEffect } from "react";

/** Old Jest-view test-id and company hashes → new GUI section anchors. */
const LEGACY_HASH_MAP: Record<string, string> = {
  "boston-dynamics": "experience",
  "sharkninja": "experience",
  "staff-sqa-bd": "experience",
  "senior-sqa-bd": "experience",
  "sqa-ii-sn": "experience",
  "sqa-sn": "experience",
  "intern-sn": "experience",
  "appium-growth": "skills",
  "cicd-reporting": "experience",
  "hil-triage": "experience",
  "gazebo-sim": "experience",
  "ssh-fixture": "experience",
  selenium: "skills",
  "pytest-framework": "skills",
  "test-management": "skills",
  linux: "skills",
  "flaky-test": "about",
};

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (!el) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
  history.replaceState(null, "", `#${sectionId}`);
}

function resolveLegacyHash(hash: string): string | undefined {
  if (LEGACY_HASH_MAP[hash]) return LEGACY_HASH_MAP[hash];
  if (document.getElementById(hash)) return hash;
  return undefined;
}

export function HashRedirect() {
  useEffect(() => {
    function handleHash() {
      const raw = decodeURIComponent(window.location.hash.slice(1));
      if (!raw) return;

      const target = resolveLegacyHash(raw);
      if (target && target !== raw) {
        scrollToSection(target);
      } else if (target) {
        document.getElementById(target)?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
          block: "start",
        });
      }
    }

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  return null;
}
