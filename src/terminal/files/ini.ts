export function renderPytestIni(): string {
  return [
    "[pytest]",
    "testpaths = tests",
    "python_files = test_*.py",
    "python_classes = Test*",
    "python_functions = test_*",
    "",
    "markers =",
    "    smoke: fast checks on every build",
    "    sanity: core paths before release",
    "    regression: full coverage suite",
    "    hil: hardware-in-the-loop (session fixture)",
  ].join("\n");
}
