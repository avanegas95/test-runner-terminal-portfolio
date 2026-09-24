import { describe, expect, it } from "vitest";
import { complete } from "../complete";
import { HOME } from "../fs";

const ctx = { cwd: HOME, home: HOME };

describe("complete", () => {
  it("completes command names", () => {
    const result = complete("py", ctx);
    expect(result.options).toContain("pytest");
  });

  it("lists command options on partial match", () => {
    const result = complete("c", ctx);
    expect(result.options.some((o) => o.startsWith("c"))).toBe(true);
  });

  it("completes paths for cd", () => {
    const result = complete("cd exp", ctx);
    expect(result.options.some((o) => o.includes("experience"))).toBe(true);
  });

  it("completes paths for ls", () => {
    const result = complete("ls ex", ctx);
    expect(result.options.length).toBeGreaterThan(0);
  });
});
