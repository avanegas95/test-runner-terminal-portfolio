import type { Glossary, GlossaryEntry } from "./types";

export const glossaryEntries: GlossaryEntry[] = [
  {
    id: "hil",
    term: "HIL",
    shortDefinition:
      "Hardware-in-the-loop — testing software against real robot hardware in a controlled setup.",
    longDefinition:
      "Hardware-in-the-loop (HIL) testing runs software against actual robot hardware (motors, sensors, controllers) while the rest of the environment is simulated or stubbed. At Boston Dynamics, nightly HIL runs catch integration issues before release.",
  },
  {
    id: "gazebo",
    term: "Gazebo",
    shortDefinition:
      "Open-source robotics simulator for testing without a physical robot.",
    longDefinition:
      "Gazebo simulates robot physics, sensors, and environments. Anderson builds and maintains Gazebo worlds for pre-robot validation of Boston Dynamics software.",
  },
  {
    id: "appium",
    term: "Appium",
    shortDefinition:
      "Cross-platform mobile UI automation framework for Android and iOS apps.",
    longDefinition:
      "Appium drives real or emulated mobile devices through UI interactions. Anderson uses it for the Boston Dynamics robot control Android app, growing coverage from 16 to 33 automated tests.",
  },
  {
    id: "cicd",
    term: "CI/CD",
    shortDefinition:
      "Continuous Integration / Continuous Delivery — automated build, test, and deploy pipelines.",
    longDefinition:
      "CI/CD pipelines run automated tests on every commit or build stage. Anderson integrates pytest and Appium suites with stage-based reporting so failures surface at the right gate.",
  },
  {
    id: "fixture",
    term: "fixture",
    shortDefinition:
      "Reusable pytest setup/teardown object shared across tests (from conftest.py).",
    longDefinition:
      "In pytest, a fixture provides shared setup — database connections, SSH sessions, or mock hardware. Anderson's Python robot-metrics monitor runs as a standalone tool or as a session-scoped pytest fixture.",
  },
  {
    id: "smoke",
    term: "smoke test",
    shortDefinition:
      "Fast, shallow check that core functionality works — run on every build.",
    longDefinition:
      "Smoke tests are the first gate: quick checks that the system starts and critical paths respond. Anderson tiered a 700+ case library so smoke runs finish in minutes.",
  },
  {
    id: "sanity",
    term: "sanity test",
    shortDefinition:
      "Targeted check after a change to confirm the affected area still works.",
    longDefinition:
      "Sanity tests validate a specific feature or fix without running the full regression suite. They sit between smoke and regression in Anderson's tiered test library.",
  },
  {
    id: "regression",
    term: "regression test",
    shortDefinition:
      "Full-depth check that existing behavior still works after changes.",
    longDefinition:
      "Regression tests cover the complete feature set. Anderson reorganized Boston Dynamics' library into tiers targeting a 3-month → 1-month regression cycle.",
  },
];

export const glossary: Glossary = Object.fromEntries(
  glossaryEntries.map((entry) => [entry.id, entry]),
);

export function getGlossaryTerm(id: string): GlossaryEntry | undefined {
  return glossary[id];
}
