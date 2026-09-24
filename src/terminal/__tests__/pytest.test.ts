import { describe, expect, it } from "vitest";
import { allTests } from "@/content/tests";
import { collectTests, parsePytestArgs, runPytest } from "../pytest";
import { parseArgs } from "../parser";

describe("collectTests", () => {
  it("returns all tests by default", () => {
    expect(collectTests({})).toHaveLength(allTests.length);
  });

  it("filters by keyword", () => {
    const tests = collectTests({ keyword: "appium" });
    expect(tests.length).toBeGreaterThan(0);
    expect(tests.every((t) => t.name.includes("appium") || t.docstring.toLowerCase().includes("appium"))).toBe(true);
  });

  it("filters by marker", () => {
    const tests = collectTests({ marker: "smoke" });
    expect(tests.every((t) => t.marker === "smoke")).toBe(true);
  });

  it("filters by path", () => {
    const tests = collectTests({ path: "test_career.py" });
    expect(tests.every((t) => t.file === "test_career.py")).toBe(true);
  });

  it("filters last failed only", () => {
    const tests = collectTests({ lastFailed: true });
    expect(tests).toHaveLength(1);
    expect(tests[0]!.status).toBe("failed");
  });

  it("stops on first failure with -x", () => {
    const all = collectTests({});
    const stopped = collectTests({ stopOnFirst: true });
    const failIdx = all.findIndex((t) => t.status === "failed");
    expect(stopped.length).toBe(failIdx + 1);
  });
});

describe("runPytest", () => {
  it("renders default verbose output with recap", () => {
    const { lines } = runPytest({});
    const text = lines.flatMap((l) => l.segments.map((s) => s.text)).join("\n");
    expect(text).toContain("PASSED");
    expect(text).toContain("FAILED");
    expect(text).toContain("14 of 15 checks passed");
    expect(text).toContain("reports/anderson_report.html");
  });

  it("renders quiet dots format", () => {
    const { lines } = runPytest({ quiet: true });
    const text = lines.flatMap((l) => l.segments.map((s) => s.text)).join("\n");
    expect(text).toContain("test session starts");
    expect(text).toMatch(/\.+/);
    expect(text).toContain("F");
  });

  it("opens report with --html", () => {
    const { effects } = runPytest({ html: true });
    expect(effects?.some((e) => e.type === "openUrl" && e.url === "/report")).toBe(true);
  });

  it("shows deselected count when filtered", () => {
    const { lines } = runPytest({ keyword: "nonexistent_xyz" });
    const text = lines.flatMap((l) => l.segments.map((s) => s.text)).join("\n");
    expect(text).toContain("deselected");
  });
});

describe("parsePytestArgs", () => {
  it("maps argv flags", () => {
    const { positional, flags } = parseArgs(["-q", "-k", "linux"]);
    const opts = parsePytestArgs(positional, flags);
    expect(opts.quiet).toBe(true);
    expect(opts.keyword).toBe("linux");
  });
});
