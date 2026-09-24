import type { FailureDetail, Suite } from "./types";

export const suites: Suite[] = [
  {
    file: "career.spec.ts",
    tests: [
      {
        id: "qa-experience",
        name: "6+ years of QA experience",
        ms: 412,
        status: "pass",
        detail: {
          plainEnglish:
            "Anderson has spent more than six years in software quality assurance, from manual testing through automation and CI integration.",
        },
      },
      {
        id: "boston-dynamics",
        name: "Boston Dynamics — QA lead, 2023–present",
        ms: 274,
        status: "pass",
        detail: {
          metadata: {
            role: "Staff SQA Engineer",
            company: "Boston Dynamics",
            period: "2023 — present",
          },
          plainEnglish:
            "Anderson leads quality for Boston Dynamics' robot software. He tests it on real robots, in simulation and in the Android app — then automates those checks so every build runs them.",
          describeLabel: "what he does",
          bullets: [
            "QA lead across HIL, Gazebo simulation and Appium Android app testing",
            "Built a Python, SSH-based monitoring tool for real-time robot metrics",
            "Integrated automated tests into CI/CD with stage-based reporting",
            "Onboarded non-SQA engineers through QA training",
          ],
          glossary: [
            "HIL = hardware-in-the-loop: software tested against real robot hardware.",
            "Gazebo = a robotics simulator, for testing without a physical robot.",
          ],
        },
      },
      {
        id: "sharkninja",
        name: "SharkNinja — cloud & mobile app QA, 2019–2023",
        ms: 198,
        status: "pass",
        detail: {
          metadata: {
            role: "SQA Engineer I/II",
            company: "SharkNinja",
            period: "2019 — 2023",
          },
          plainEnglish:
            "Tested SharkNinja's cloud services and consumer mobile apps before they reached customers.",
          describeLabel: "what he did",
          bullets: [
            "Manual testing for cloud services and consumer mobile apps",
            "Mentored junior engineers",
            "Standups, defect triage and release coordination",
          ],
        },
      },
      {
        id: "mentors-juniors",
        name: "mentors junior engineers",
        ms: 96,
        status: "pass",
        detail: {
          plainEnglish:
            "Anderson regularly mentors junior engineers on test design, automation patterns, and how to communicate quality risks to the team.",
        },
      },
      {
        id: "trains-non-sqa",
        name: "trains non-SQA engineers in QA",
        ms: 143,
        status: "pass",
        detail: {
          plainEnglish:
            "He runs QA training for developers and other non-SQA engineers so quality practices spread beyond the QA team — used at Boston Dynamics.",
        },
      },
    ],
  },
  {
    file: "automation.spec.ts",
    tests: [
      {
        id: "appium",
        name: "Appium mobile automation",
        ms: 188,
        status: "pass",
        detail: {
          plainEnglish:
            "Builds and maintains Appium-based mobile test suites for Android apps — used daily at Boston Dynamics for the robot control app.",
        },
      },
      {
        id: "cicd",
        name: "CI/CD pipeline integration",
        ms: 231,
        status: "pass",
        detail: {
          plainEnglish:
            "Integrates automated tests into CI/CD pipelines with stage-based reporting so failures surface at the right build stage — used at Boston Dynamics.",
        },
      },
      {
        id: "hil-gazebo",
        name: "HIL + Gazebo simulation testing",
        ms: 305,
        status: "pass",
        detail: {
          plainEnglish:
            "Tests robot software in hardware-in-the-loop setups and Gazebo simulation before and alongside real-robot validation — core work at Boston Dynamics.",
          glossary: [
            "HIL = hardware-in-the-loop: software tested against real robot hardware.",
            "Gazebo = a robotics simulator, for testing without a physical robot.",
          ],
        },
      },
      {
        id: "python-ssh-monitor",
        name: "Python SSH robot-metrics monitor",
        ms: 167,
        status: "pass",
        detail: {
          plainEnglish:
            "Built a Python tool that connects over SSH to collect real-time robot metrics during test runs — created at Boston Dynamics.",
        },
      },
      {
        id: "stage-reporting",
        name: "stage-based test reporting",
        ms: 122,
        status: "pass",
        detail: {
          plainEnglish:
            "Designed reporting that groups test results by pipeline stage so teams know exactly where a build broke — used in Boston Dynamics CI/CD.",
        },
      },
    ],
  },
  {
    file: "tooling.spec.ts",
    tests: [
      {
        id: "selenium",
        name: "Selenium web automation",
        ms: 154,
        status: "pass",
        detail: {
          plainEnglish:
            "Uses Selenium for web UI automation — applied across prior roles for cloud service and internal tool testing.",
        },
      },
      {
        id: "jenkins-buildkite",
        name: "Jenkins + Buildkite pipelines",
        ms: 88,
        status: "pass",
        detail: {
          plainEnglish:
            "Configures and maintains Jenkins and Buildkite pipelines to run automated test suites on every commit.",
        },
      },
      {
        id: "jira-zephyr",
        name: "Jira · Zephyr · X-Ray test management",
        ms: 71,
        status: "pass",
        detail: {
          plainEnglish:
            "Manages test cases, execution results, and traceability in Jira with Zephyr and X-Ray — used throughout his QA career.",
        },
      },
      {
        id: "linux-bash",
        name: "Linux / Bash",
        ms: 64,
        status: "pass",
        detail: {
          plainEnglish:
            "Comfortable on Linux with Bash scripting for test tooling, log analysis, and CI environment setup.",
        },
      },
    ],
  },
  {
    file: "personality.spec.ts",
    tests: [
      {
        id: "flaky-test",
        name: "ability to ignore a flaky test",
        ms: null,
        status: "fail",
      },
    ],
  },
];

export const failureDetail: FailureDetail = {
  title: "● personality › ability to ignore a flaky test",
  expected: "true",
  received: '"rerun it, reproduce it, find the root cause, file the ticket"',
  stack: "at Object.<anonymous> (personality.spec.ts:1:1)",
  statusComment: "// Status: won't fix. Working as intended.",
};

export const allTests = suites.flatMap((s) => s.tests);

export function getTestById(id: string) {
  return allTests.find((t) => t.id === id);
}

export function getNextTestId(currentId: string): string | null {
  const idx = allTests.findIndex((t) => t.id === currentId);
  if (idx === -1 || idx >= allTests.length - 1) return null;
  return allTests[idx + 1].id;
}

export function getSuiteForTest(testId: string) {
  return suites.find((s) => s.tests.some((t) => t.id === testId));
}

export function computeSummary() {
  const passed = allTests.filter((t) => t.status === "pass").length;
  const failed = allTests.filter((t) => t.status === "fail").length;
  const totalMs = allTests.reduce((sum, t) => sum + (t.ms ?? 0), 0);
  const timeSeconds = (totalMs / 1000).toFixed(2);
  return {
    passed,
    failed,
    skipped: 0,
    coverage: 98,
    timeSeconds,
  };
}

/** Animation reveal delays in seconds (from DESIGN_SPEC) */
export const animationSchedule: Record<string, number> = {
  jest: 0.35,
  "suite-career": 0.7,
  "qa-experience": 0.9,
  "boston-dynamics": 1.05,
  sharkninja: 1.2,
  "mentors-juniors": 1.3,
  "trains-non-sqa": 1.4,
  "suite-automation": 1.6,
  appium: 1.75,
  cicd: 1.9,
  "hil-gazebo": 2.05,
  "python-ssh-monitor": 2.2,
  "stage-reporting": 2.3,
  "suite-tooling": 2.5,
  selenium: 2.6,
  "jenkins-buildkite": 2.7,
  "jira-zephyr": 2.8,
  "linux-bash": 2.9,
  "suite-personality": 3.1,
  "flaky-test": 3.3,
  summary: 3.6,
  comment: 3.9,
  cursor: 4.1,
};
