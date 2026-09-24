import {
  allTests,
  computeSummary,
  failureDetail,
  pytestSuites,
} from "@/content/tests";
import type { PytestTest } from "@/content/types";
import {
  line,
  text,
  type CommandResult,
  type OutputLine,
  type SegmentStyle,
} from "./types";

export type PytestOptions = {
  verbose?: boolean;
  quiet?: boolean;
  keyword?: string;
  marker?: string;
  path?: string;
  lastFailed?: boolean;
  stopOnFirst?: boolean;
  html?: boolean;
};

function matchesKeyword(test: PytestTest, expr: string): boolean {
  const lower = expr.toLowerCase();
  return (
    test.name.toLowerCase().includes(lower) ||
    test.docstring.toLowerCase().includes(lower) ||
    test.id.toLowerCase().includes(lower)
  );
}

function matchesPath(test: PytestTest, pathArg: string): boolean {
  const normalized = pathArg
    .replace(/^tests\//, "")
    .replace(/\.py$/, "")
    .toLowerCase();
  return (
    test.file.toLowerCase().includes(normalized) ||
    `tests/${test.file}`.toLowerCase().includes(pathArg.toLowerCase()) ||
    test.name.toLowerCase().includes(normalized)
  );
}

export function collectTests(options: PytestOptions): PytestTest[] {
  let tests = [...allTests];

  if (options.path) {
    tests = tests.filter((t) => matchesPath(t, options.path!));
  }

  if (options.keyword) {
    tests = tests.filter((t) => matchesKeyword(t, options.keyword!));
  }

  if (options.marker) {
    tests = tests.filter((t) => t.marker === options.marker);
  }

  if (options.lastFailed) {
    tests = tests.filter((t) => t.status === "failed");
  }

  if (options.stopOnFirst) {
    const result: PytestTest[] = [];
    for (const t of tests) {
      result.push(t);
      if (t.status === "failed") break;
    }
    return result;
  }

  return tests;
}

function pct(index: number, total: number): string {
  const p = Math.round(((index + 1) / total) * 100);
  return `[${String(p).padStart(3)}%]`;
}

function statusLabel(test: PytestTest): SegmentStyle {
  return test.status === "passed" ? "success" : test.status === "failed" ? "error" : "warning";
}

function testResumePath(test: PytestTest): string {
  const ref = test.resumeRef;
  if (ref.startsWith("experience/")) return `${ref}.md`;
  if (ref.startsWith("projects/")) return `${ref}.md`;
  if (ref === "about") return "about.md";
  if (ref.startsWith("skills/")) return "README.md";
  return "README.md";
}

function renderVerbose(tests: PytestTest[], totalCollected: number): OutputLine[] {
  const lines: OutputLine[] = [];
  const deselected = totalCollected - tests.length;

  lines.push(
    plainBanner("test session starts"),
    line(text("platform linux -- Python 3.12.4, pytest-8.3.2, pluggy-1.5.0")),
    line(text("rootdir: /home/anderson")),
    line(text("configfile: pytest.ini")),
    line(
      text(
        `collected ${totalCollected} item${totalCollected === 1 ? "" : "s"}${deselected > 0 ? ` / ${deselected} deselected` : ""}`,
      ),
    ),
    line(text("")),
  );

  let currentFile = "";
  let index = 0;

  for (const test of tests) {
    if (test.file !== currentFile) {
      currentFile = test.file;
      lines.push(
        line(
          text(`== ${test.file} — ${fileSectionTitle(test.file)} ==`, "accent"),
        ),
      );
    }

    const status = test.status === "passed" ? "PASSED" : "FAILED";
    const resumePath = testResumePath(test);
    const catCmd = `cat ${resumePath}`;

    lines.push(
      line(
        text(`tests/${test.file}::${test.name} `, "default"),
        text(status, statusLabel(test)),
        text(`   [${test.marker}]  ${pct(index, tests.length)}`),
      ),
      line(
        text("    ↳ ", "dim"),
        text(test.docstring, "dim"),
      ),
      line(
        text("    ", "dim"),
        text(resumePath, "accent", { run: catCmd }),
      ),
    );
    index++;
  }

  const failed = tests.filter((t) => t.status === "failed");
  if (failed.length > 0) {
    lines.push(line(text("")), plainBanner("FAILURES"));
    for (const test of failed) {
      lines.push(
        line(text("_".repeat(26) + test.name + "_".repeat(26), "error")),
        line(text(`    def ${test.name}(anderson, flaky_test):`)),
        line(text(`>       assert anderson.ignore(flaky_test) is True`, "error")),
        line(
          text(
            `E       AssertionError: assert '${failureDetail.received.replace(/^"|"$/g, "")}' is True`,
            "error",
          ),
        ),
        line(text(failureDetail.stack, "dim")),
      );
    }
  }

  lines.push(...renderSummary(tests));
  lines.push(...renderRecap(tests));
  return lines;
}

function renderQuiet(tests: PytestTest[], totalCollected: number): OutputLine[] {
  const lines: OutputLine[] = [];
  const deselected = totalCollected - tests.length;

  lines.push(
    plainBanner("test session starts"),
    line(text("platform linux -- Python 3.12.4, pytest-8.3.2, pluggy-1.5.0")),
    line(text("rootdir: /home/anderson")),
    line(text("configfile: pytest.ini")),
    line(
      text(
        `collected ${totalCollected} item${totalCollected === 1 ? "" : "s"}${deselected > 0 ? ` / ${deselected} deselected` : ""}`,
      ),
    ),
    line(text("")),
  );

  let currentFile = "";
  let fileDots = "";
  let fileIndex = 0;
  const fileGroups: { file: string; dots: string; pct: string }[] = [];

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i]!;
    if (test.file !== currentFile) {
      if (currentFile) {
        fileGroups.push({
          file: currentFile,
          dots: fileDots,
          pct: pct(fileIndex, tests.length),
        });
      }
      currentFile = test.file;
      fileDots = "";
    }
    fileDots += test.status === "passed" ? "." : test.status === "failed" ? "F" : "s";
    fileIndex = i;
  }
  if (currentFile) {
    fileGroups.push({
      file: currentFile,
      dots: fileDots,
      pct: pct(fileIndex, tests.length),
    });
  }

  for (const group of fileGroups) {
    const padding = " ".repeat(Math.max(1, 48 - group.dots.length));
    lines.push(
      line(
        text(`tests/${group.file} ${group.dots}${padding}${group.pct}`),
      ),
    );
  }

  const failed = tests.filter((t) => t.status === "failed");
  if (failed.length > 0) {
    lines.push(line(text("")), plainBanner("FAILURES"));
    lines.push(
      line(text("_".repeat(26) + "test_can_ignore_flaky_test" + "_".repeat(26), "error")),
      line(text("    def test_can_ignore_flaky_test(anderson, flaky_test):")),
      line(text(">       assert anderson.ignore(flaky_test) is True", "error")),
      line(
        text(
          `E       AssertionError: assert '${failureDetail.received.replace(/^"|"$/g, "")}' is True`,
          "error",
        ),
      ),
      line(text(failureDetail.stack, "dim")),
    );
  }

  lines.push(...renderSummary(tests));
  if (failed.length > 0) {
    lines.push(
      line(text(failureDetail.statusComment, "comment")),
      line(
        text("→  cat KNOWN_ISSUES.md", "accent", { run: "cat KNOWN_ISSUES.md" }),
      ),
    );
  }
  return lines;
}

function renderDefault(tests: PytestTest[], totalCollected: number): OutputLine[] {
  return renderVerbose(tests, totalCollected);
}

function renderSummary(tests: PytestTest[]): OutputLine[] {
  const passed = tests.filter((t) => t.status === "passed").length;
  const failed = tests.filter((t) => t.status === "failed").length;
  const skipped = tests.filter((t) => t.status === "skipped").length;
  const summary = computeSummary();

  const lines: OutputLine[] = [
    line(text("")),
    line(text("short test summary info", "bold")),
  ];

  if (failed > 0) {
    const failTest = tests.find((t) => t.status === "failed")!;
    lines.push(
      line(
        text("FAILED ", "error"),
        text(`tests/${failTest.file}::${failTest.name} - AssertionError`, "error"),
      ),
    );
  }

  lines.push(
    line(
      text(
        `${failed} failed, ${passed} passed${skipped ? `, ${skipped} skipped` : ""} in ${summary.timeSeconds}s`,
        failed > 0 ? "error" : "success",
      ),
    ),
  );

  return lines;
}

function renderRecap(tests: PytestTest[]): OutputLine[] {
  const passed = tests.filter((t) => t.status === "passed").length;
  const failed = tests.filter((t) => t.status === "failed").length;
  const total = tests.length;

  const lines: OutputLine[] = [line(text(""))];

  if (total === 0) {
    lines.push(line(text("No tests matched the filter.", "warning")));
    return lines;
  }

  if (failed === 0) {
    lines.push(
      line(
        text(`All ${passed} checks passed.`, "success"),
      ),
    );
  } else {
    lines.push(
      line(
        text(
          `${passed} of ${total} checks passed. The one failure is on purpose: see KNOWN_ISSUES.md.`,
          "default",
        ),
      ),
    );
  }

  lines.push(
    line(
      text("📄 Report generated: ", "default"),
      text("reports/anderson_report.html", "accent", {
        run: "open reports/anderson_report.html",
      }),
      text("  ▸ open", "dim", { run: "open reports/anderson_report.html" }),
    ),
  );

  return lines;
}

function plainBanner(title: string): OutputLine {
  const bar = "=".repeat(Math.max(29, title.length + 10));
  return line(text(`${bar} ${title} ${bar}`, "accent"));
}

function fileSectionTitle(file: string): string {
  const map: Record<string, string> = {
    "test_career.py": "Career",
    "test_automation.py": "Automation",
    "test_tooling.py": "Tooling",
    "test_personality.py": "Personality",
  };
  return map[file] ?? file.replace(".py", "");
}

export function runPytest(options: PytestOptions): CommandResult {
  const totalCollected = allTests.length;
  const tests = collectTests(options);
  const effects: import("./types").Effect[] = [];

  if (options.html) {
    effects.push({ type: "openUrl", url: "/report" });
  }

  let lines: OutputLine[];
  if (options.quiet) {
    lines = renderQuiet(tests, totalCollected);
    effects.push({ type: "runAnimation", lines, delayMs: 35 });
    return { lines, effects };
  } else if (options.verbose) {
    lines = renderVerbose(tests, totalCollected);
  } else {
    lines = renderDefault(tests, totalCollected);
  }

  return { lines, effects: effects.length ? effects : undefined };
}

/** Map pytest argv flags to PytestOptions */
export function parsePytestArgs(
  positional: string[],
  flags: Map<string, string | boolean>,
): PytestOptions {
  return {
    verbose: flags.has("v"),
    quiet: flags.has("q"),
    keyword: typeof flags.get("k") === "string" ? (flags.get("k") as string) : undefined,
    marker: typeof flags.get("m") === "string" ? (flags.get("m") as string) : undefined,
    path: positional[0],
    lastFailed: flags.has("lf") || flags.get("last-failed") === true,
    stopOnFirst: flags.has("x"),
    html: flags.has("html") || flags.get("html") === true,
  };
}

/** Exposed for tests */
export { pytestSuites };
