import { describe, expect, it } from "vitest";
import { createContext, runCommand, HOME } from "../index";
import { getFlag, hasFlag } from "../parser";
import { allPaths } from "../fs";
import { complete } from "../complete";

function out(input: string, ctx = createContext()) {
  return runCommand(input, ctx).result.lines
    .flatMap((l) => l.segments.map((s) => s.text))
    .join("");
}

describe("additional command coverage", () => {
  it("ls -l long format", () => {
    expect(out("ls -l")).toContain("rwxr-xr-x");
  });

  it("ls missing path error", () => {
    expect(out("ls missing_dir")).toContain("No such file");
  });

  it("cd with no args goes home", () => {
    const ctx = createContext({ cwd: `${HOME}/experience` });
    const { effects } = runCommand("cd", ctx).result;
    expect(effects).toEqual([{ type: "cd", path: HOME }]);
  });

  it("cd to missing path", () => {
    expect(out("cd nowhere")).toContain("No such file");
  });

  it("cd to file fails", () => {
    expect(out("cd README.md")).toContain("Not a directory");
  });

  it("cd - without OLDPWD", () => {
    expect(out("cd -")).toContain("OLDPWD not set");
  });

  it("cat directory error", () => {
    expect(out("cat experience")).toContain("Is a directory");
  });

  it("cat missing operand", () => {
    expect(out("cat")).toContain("missing file operand");
  });

  it("cat binary and html messages", () => {
    expect(out("cat resume.pdf")).toContain("binary file");
    expect(out("cat reports/anderson_report.html")).toContain("HTML report");
  });

  it("cat text files from renderers", () => {
    expect(out("cat contact.txt")).toContain("avanegas95@gmail.com");
    expect(out("cat requirements.txt")).toContain("pytest==8.3.2");
    expect(out("cat .bashrc")).toContain("alias ll");
    expect(out("cat pytest.ini")).toContain("[pytest]");
    expect(out("cat about.md")).toContain("Anderson Vanegas");
    expect(out("cat tests/conftest.py")).toContain("flaky_test");
    expect(out("cat tests/test_career.py")).toContain("test_staff_sqa");
  });

  it("cat experience and project markdown", () => {
    expect(out("cat experience/boston_dynamics/senior_sqa_engineer.md")).toContain(
      "Senior SQA Engineer",
    );
    expect(out("cat projects/finance_forecast.md")).toContain("Finance Forecast");
    expect(out("cat education/boston_university.md")).toContain("Boston University");
  });

  it("open http url", () => {
    const { effects } = runCommand("open https://example.com", createContext()).result;
    expect(effects?.[0]).toEqual({ type: "openUrl", url: "https://example.com" });
  });

  it("open contact.txt mailto", () => {
    const { effects } = runCommand("open contact.txt", createContext()).result;
    expect(effects?.some((e) => e.type === "openUrl" && e.url.startsWith("mailto:"))).toBe(true);
  });

  it("open missing operand and unknown target", () => {
    expect(out("open")).toContain("missing operand");
    expect(out("open unknown.xyz")).toContain("No such file");
  });

  it("man missing and unknown", () => {
    expect(out("man")).toContain("What manual page");
    expect(out("man notacommand")).toContain("No manual entry");
  });

  it("help unknown command", () => {
    expect(out("help notacommand")).toContain("no help topics");
  });

  it("history empty", () => {
    expect(out("history", createContext({ history: [] }))).toContain("no history yet");
  });

  it("tree with path", () => {
    expect(out("tree experience")).toContain("boston_dynamics");
  });

  it("rm without -rf", () => {
    expect(out("rm file.txt")).toContain("read-only");
  });

  it("pytest -v and -m and -x", () => {
    expect(out("pytest -v")).toContain("PASSED");
    expect(out("pytest -m smoke")).toContain("smoke");
    expect(out("pytest -x")).toContain("FAILED");
    expect(out("pytest --html")).toContain("Report generated");
  });

  it("pytest path filter", () => {
    expect(out("pytest tests/test_tooling.py")).toContain("test_tooling.py");
  });
});

describe("parser flag helpers", () => {
  it("hasFlag and getFlag", () => {
    const flags = new Map<string, string | boolean>([
      ["v", true],
      ["k", "linux"],
    ]);
    expect(hasFlag(flags, "v")).toBe(true);
    expect(getFlag(flags, "k")).toBe("linux");
  });
});

describe("fs allPaths", () => {
  it("lists all virtual paths", () => {
    const paths = allPaths();
    expect(paths).toContain(`${HOME}/README.md`);
    expect(paths).toContain(`${HOME}/tests/test_career.py`);
  });
});

describe("complete edge cases", () => {
  it("returns empty for unknown partial", () => {
    expect(complete("zzzz", { cwd: HOME, home: HOME }).options).toEqual([]);
  });

  it("completes cat paths", () => {
    const result = complete("cat README", { cwd: HOME, home: HOME });
    expect(result.options.length + (result.completion ? 1 : 0)).toBeGreaterThan(0);
  });
});
