import { pytestSuites } from "@/content/tests";

export function renderConftest(): string {
  return [
    '"""Shared pytest fixtures for the Anderson portfolio test suite."""',
    "",
    "import pytest",
    "",
    "",
    '@pytest.fixture(scope="session")',
    "def anderson():",
    '    """Resume profile and career history fixture."""',
    "    ...",
    "",
    "",
    '@pytest.fixture(scope="session")',
    '@pytest.mark.hil',
    "def robot():",
    '    """Hardware-in-the-loop robot fixture (session-scoped)."""',
    "    ...",
    "",
    "",
    "@pytest.fixture",
    "def flaky_test():",
    '    """Intentionally unreliable fixture — see KNOWN_ISSUES.md."""',
    "    return False",
  ].join("\n");
}

export function renderTestFile(fileName: string): string {
  const suite = pytestSuites.find((s) => s.file === fileName);
  if (!suite) return `# File not found: ${fileName}`;

  const lines: string[] = [
    '"""',
    `Test suite: ${fileName.replace(".py", "").replace("test_", "")}`,
    '"""',
    "",
    "import pytest",
    "",
  ];

  for (const test of suite.tests) {
    lines.push(`@pytest.mark.${test.marker}`);
    lines.push(`def ${test.name}(anderson):`);
    lines.push(`    """${test.docstring}"""`);
    if (test.status === "failed") {
      lines.push("    assert anderson.ignore(flaky_test) is True");
    } else {
      lines.push("    assert True");
    }
    lines.push("");
  }

  return lines.join("\n");
}
