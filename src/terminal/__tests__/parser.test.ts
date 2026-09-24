import { describe, expect, it } from "vitest";
import { getFlagString, hasFlag, parseArgs, tokenize } from "../parser";

describe("tokenize", () => {
  it("splits on whitespace", () => {
    expect(tokenize("ls -la experience")).toEqual(["ls", "-la", "experience"]);
  });

  it("respects double quotes", () => {
    expect(tokenize('echo "hello world"')).toEqual(["echo", "hello world"]);
  });

  it("respects single quotes", () => {
    expect(tokenize("echo 'hello world'")).toEqual(["echo", "hello world"]);
  });

  it("handles escapes outside single quotes", () => {
    expect(tokenize('echo hello\\ world')).toEqual(["echo", "hello world"]);
  });

  it("returns empty for blank input", () => {
    expect(tokenize("   ")).toEqual([]);
  });
});

describe("parseArgs", () => {
  it("parses short flags", () => {
    const { flags } = parseArgs(["-v", "-q"]);
    expect(hasFlag(flags, "v")).toBe(true);
    expect(hasFlag(flags, "q")).toBe(true);
  });

  it("parses combined short flags", () => {
    const { flags } = parseArgs(["-la"]);
    expect(hasFlag(flags, "l")).toBe(true);
    expect(hasFlag(flags, "a")).toBe(true);
  });

  it("parses long flags with values", () => {
    const { flags } = parseArgs(["-k", "appium"]);
    expect(getFlagString(flags, "k")).toBe("appium");
  });

  it("parses --flag=value", () => {
    const { flags } = parseArgs(["--html=true"]);
    expect(flags.get("html")).toBe("true");
  });

  it("collects positional args", () => {
    const { positional } = parseArgs(["tests/test_career.py"]);
    expect(positional).toEqual(["tests/test_career.py"]);
  });
});
