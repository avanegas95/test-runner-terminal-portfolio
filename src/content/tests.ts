import type { FailureDetail, PytestSuite, PytestTest, TestSummary } from "./types";

// ── Canonical pytest test data (~15 tests, 4 files) ──────────────────────────

export const pytestSuites: PytestSuite[] = [
  {
    file: "test_career.py",
    tests: [
      {
        id: "staff-sqa-bd",
        name: "test_staff_sqa_engineer_boston_dynamics",
        marker: "regression",
        durationMs: 186,
        status: "passed",
        resumeRef: "experience/boston_dynamics/staff_sqa_engineer",
        docstring:
          "Leads QA for Boston Dynamics robot software, Mar 2026 – present — tiered libraries, Appium growth, nightly HIL triage.",
        file: "test_career.py",
      },
      {
        id: "senior-sqa-bd",
        name: "test_senior_sqa_engineer_boston_dynamics",
        marker: "regression",
        durationMs: 224,
        status: "passed",
        resumeRef: "experience/boston_dynamics/senior_sqa_engineer",
        docstring:
          "Built Python SSH metrics as a pytest fixture, CI/CD stage reporting, Gazebo sim worlds, and led a product refresh.",
        file: "test_career.py",
      },
      {
        id: "sqa-ii-sn",
        name: "test_sqa_engineer_ii_sharkninja",
        marker: "sanity",
        durationMs: 142,
        status: "passed",
        resumeRef: "experience/sharkninja/sqa_engineer_ii",
        docstring:
          "Senior SQA for SharkNinja cloud and mobile apps — automation, mentoring, and release coordination, Apr 2022 – Sep 2023.",
        file: "test_career.py",
      },
      {
        id: "sqa-sn",
        name: "test_sqa_engineer_sharkninja",
        marker: "sanity",
        durationMs: 198,
        status: "passed",
        resumeRef: "experience/sharkninja/sqa_engineer",
        docstring:
          "Manual and automated QA for SharkNinja cloud services and consumer mobile apps, Nov 2019 – Apr 2022.",
        file: "test_career.py",
      },
      {
        id: "intern-sn",
        name: "test_product_dev_intern_sharkninja",
        marker: "smoke",
        durationMs: 87,
        status: "passed",
        resumeRef: "experience/sharkninja/product_dev_intern",
        docstring:
          "Product development intern — test execution, documentation, and early automation, Apr – Nov 2019.",
        file: "test_career.py",
      },
    ],
  },
  {
    file: "test_automation.py",
    tests: [
      {
        id: "appium-growth",
        name: "test_appium_ui_automation_growth",
        marker: "regression",
        durationMs: 188,
        status: "passed",
        resumeRef: "skills/testing_automation",
        docstring:
          "Grew Appium UI automation from 16 → 33 tests for the Boston Dynamics robot control Android app.",
        file: "test_automation.py",
      },
      {
        id: "cicd-reporting",
        name: "test_cicd_stage_based_reporting",
        marker: "regression",
        durationMs: 231,
        status: "passed",
        resumeRef: "experience/boston_dynamics/senior_sqa_engineer",
        docstring:
          "Integrated automated tests into CI/CD with stage-based reporting and failure notifications.",
        file: "test_automation.py",
      },
      {
        id: "hil-triage",
        name: "test_hil_nightly_triage",
        marker: "hil",
        durationMs: 305,
        status: "passed",
        resumeRef: "experience/boston_dynamics/staff_sqa_engineer",
        docstring:
          "Owns nightly hardware-in-the-loop triage — root-cause summaries, hotfixes, and release escalation.",
        file: "test_automation.py",
      },
      {
        id: "gazebo-sim",
        name: "test_gazebo_simulation_worlds",
        marker: "regression",
        durationMs: 176,
        status: "passed",
        resumeRef: "experience/boston_dynamics/senior_sqa_engineer",
        docstring:
          "Created and maintained Gazebo simulation worlds for pre-robot software validation.",
        file: "test_automation.py",
      },
      {
        id: "ssh-fixture",
        name: "test_python_ssh_metrics_fixture",
        marker: "regression",
        durationMs: 167,
        status: "passed",
        resumeRef: "experience/boston_dynamics/senior_sqa_engineer",
        docstring:
          "Python robot-metrics monitor over SSH — standalone tool or reusable pytest fixture with live plots and CSV export.",
        file: "test_automation.py",
      },
    ],
  },
  {
    file: "test_tooling.py",
    tests: [
      {
        id: "selenium",
        name: "test_selenium_web_automation",
        marker: "sanity",
        durationMs: 154,
        status: "passed",
        resumeRef: "skills/testing_automation",
        docstring:
          "Selenium web UI automation for cloud services and internal tools across prior roles.",
        file: "test_tooling.py",
      },
      {
        id: "pytest-framework",
        name: "test_pytest_test_framework",
        marker: "smoke",
        durationMs: 98,
        status: "passed",
        resumeRef: "skills/testing_automation",
        docstring:
          "pytest as primary test framework — fixtures, markers, parametrization, and CI integration.",
        file: "test_tooling.py",
      },
      {
        id: "test-management",
        name: "test_jira_xray_testrail",
        marker: "sanity",
        durationMs: 71,
        status: "passed",
        resumeRef: "skills/programs",
        docstring:
          "Test case management and traceability in Jira with X-Ray and TestRail.",
        file: "test_tooling.py",
      },
      {
        id: "linux",
        name: "test_linux_environment",
        marker: "smoke",
        durationMs: 64,
        status: "passed",
        resumeRef: "skills/os",
        docstring:
          "Comfortable on Linux — Bash scripting for test tooling, log analysis, and CI environment setup.",
        file: "test_tooling.py",
      },
    ],
  },
  {
    file: "test_personality.py",
    tests: [
      {
        id: "flaky-test",
        name: "test_can_ignore_flaky_test",
        marker: "sanity",
        durationMs: null,
        status: "failed",
        resumeRef: "about",
        docstring:
          "Ability to ignore a flaky test and move on — intentionally fails; see KNOWN_ISSUES.md.",
        file: "test_personality.py",
      },
    ],
  },
];

export const allTests: PytestTest[] = pytestSuites.flatMap((s) => s.tests);

export function getPytestTestById(id: string): PytestTest | undefined {
  return allTests.find((t) => t.id === id);
}

export function getPytestSuiteForTest(testId: string): PytestSuite | undefined {
  return pytestSuites.find((s) => s.tests.some((t) => t.id === testId));
}

export function getNextTestId(currentId: string): string | null {
  const idx = allTests.findIndex((t) => t.id === currentId);
  if (idx === -1 || idx >= allTests.length - 1) return null;
  return allTests[idx + 1]!.id;
}

export function computeSummary(): TestSummary {
  const passed = allTests.filter((t) => t.status === "passed").length;
  const failed = allTests.filter((t) => t.status === "failed").length;
  const skipped = allTests.filter((t) => t.status === "skipped").length;
  const totalMs = allTests.reduce((sum, t) => sum + (t.durationMs ?? 0), 0);
  return {
    passed,
    failed,
    skipped,
    timeSeconds: (totalMs / 1000).toFixed(2),
  };
}

export const failureDetail: FailureDetail = {
  title: "tests/test_personality.py::test_can_ignore_flaky_test",
  expected: "True",
  received: '"rerun it, reproduce it, find the root cause, file the ticket"',
  stack: "tests/test_personality.py:9: AssertionError",
  statusComment: "// Status: won't fix. Working as intended.",
};
