import { describe, expect, it } from "vitest";
import { createContext, runCommand, HOME } from "../index";

function run(input: string, ctx = createContext()) {
  return runCommand(input, ctx);
}

function outputText(result: ReturnType<typeof runCommand>["result"]): string {
  return result.lines.flatMap((l) => l.segments.map((s) => s.text)).join("");
}

describe("navigation commands", () => {
  it("ls lists home files", () => {
    const { result } = run("ls");
    expect(outputText(result)).toContain("README.md");
    expect(outputText(result)).toContain("experience/");
  });

  it("ls -a shows hidden files", () => {
    const { result } = run("ls -a");
    expect(outputText(result)).toContain(".bashrc");
  });

  it("cd changes directory via effect", () => {
    const { result, ctx } = run("cd experience");
    expect(result.effects).toEqual([{ type: "cd", path: `${HOME}/experience` }]);
    expect(ctx.cwd).toBe(`${HOME}/experience`);
  });

  it("cd .. goes up", () => {
    let ctx = createContext({ cwd: `${HOME}/experience` });
    ({ ctx } = run("cd ..", ctx));
    expect(ctx.cwd).toBe(HOME);
  });

  it("cd - uses previous directory", () => {
    let ctx = createContext();
    ({ ctx } = run("cd experience", ctx));
    ({ ctx } = run("cd ../projects", ctx));
    expect(ctx.prevCwd).toBe(`${HOME}/experience`);
    ({ ctx } = run("cd -", ctx));
    expect(ctx.cwd).toBe(`${HOME}/experience`);
  });

  it("pwd prints working directory", () => {
    const { result } = run("pwd");
    expect(outputText(result)).toBe("~");
  });

  it("tree renders hierarchy", () => {
    const { result } = run("tree");
    expect(outputText(result)).toContain("experience/");
  });
});

describe("read commands", () => {
  it("cat renders README", () => {
    const { result } = run("cat README.md");
    expect(outputText(result)).toContain("Anderson Vanegas");
  });

  it("cat errors on missing file", () => {
    const { result } = run("cat missing.txt");
    expect(outputText(result)).toContain("No such file");
  });

  it("open resume.pdf triggers download effect", () => {
    const { result } = run("open resume.pdf");
    expect(result.effects?.some((e) => e.type === "download")).toBe(true);
  });

  it("open experience scrolls GUI", () => {
    const { result } = run("open experience");
    expect(result.effects).toEqual([{ type: "scrollTo", sectionId: "experience" }]);
  });

  it("open report opens /report", () => {
    const { result } = run("open reports/anderson_report.html");
    expect(result.effects?.some((e) => e.type === "openUrl" && e.url === "/report")).toBe(true);
  });
});

describe("pytest command", () => {
  it("runs full suite", () => {
    const { result } = run("pytest");
    expect(outputText(result)).toContain("14 of 15 checks passed");
  });

  it("supports -q", () => {
    const { result } = run("pytest -q");
    expect(outputText(result)).toMatch(/\./);
  });

  it("supports -k filter", () => {
    const { result } = run("pytest -k appium");
    expect(outputText(result)).toContain("appium");
  });

  it("supports --lf", () => {
    const { result } = run("pytest --lf");
    expect(outputText(result)).toContain("test_can_ignore_flaky_test");
  });
});

describe("info commands", () => {
  it("whoami prints user", () => {
    const { result } = run("whoami");
    expect(outputText(result)).toContain("anderson");
  });

  it("help lists commands", () => {
    const { result } = run("help");
    expect(outputText(result)).toContain("Navigate");
    expect(outputText(result)).toContain("pytest");
  });

  it("help -v is verbose", () => {
    const { result } = run("help -v");
    expect(outputText(result)).toContain("What is this?");
  });

  it("help pytest shows one command", () => {
    const { result } = run("help pytest");
    expect(outputText(result)).toContain("USAGE");
  });

  it("tutorial has steps", () => {
    const { result } = run("tutorial");
    expect(outputText(result)).toContain("Step 1");
    expect(outputText(result)).toContain("pytest");
  });

  it("man ls works", () => {
    const { result } = run("man ls");
    expect(outputText(result)).toContain("LS(1)");
  });

  it("history shows session commands", () => {
    const ctx = createContext({ history: ["ls", "pwd"] });
    const { result } = run("history", ctx);
    expect(outputText(result)).toContain("ls");
    expect(outputText(result)).toContain("pwd");
  });

  it("echo prints args", () => {
    const { result } = run("echo hello world");
    expect(outputText(result)).toBe("hello world");
  });
});

describe("session commands", () => {
  it("clear returns clear effect", () => {
    const { result } = run("clear");
    expect(result.effects).toEqual([{ type: "clear" }]);
  });

  it("exit closes drawer", () => {
    const { result } = run("exit");
    expect(result.effects).toEqual([{ type: "close" }]);
  });
});

describe("easter eggs", () => {
  it("sudo is denied", () => {
    const { result } = run("sudo rm -rf /");
    expect(outputText(result)).toContain("sudoers");
  });

  it("rm -rf is read-only", () => {
    const { result } = run("rm -rf /");
    expect(outputText(result)).toContain("Read-only");
  });

  it("vim jokes about exiting", () => {
    const { result } = run("vim");
    expect(outputText(result)).toContain("how do I exit");
  });

  it("python prints zen", () => {
    const { result } = run("python");
    expect(outputText(result)).toContain("Zen of QA");
  });
});

describe("unknown command", () => {
  it("suggests similar commands", () => {
    const { result } = run("pyest");
    expect(outputText(result)).toContain("pytest");
  });

  it("handles empty input", () => {
    const { result } = run("   ");
    expect(result.lines).toHaveLength(0);
  });
});
