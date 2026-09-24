import { describe, expect, it } from "vitest";
import {
  MOTD,
  applyEffects,
  createContext,
  formatPrompt,
  runCommandLine,
  HOME,
} from "../index";

describe("createContext", () => {
  it("defaults to home directory", () => {
    const ctx = createContext();
    expect(ctx.cwd).toBe(HOME);
    expect(ctx.username).toBe("anderson");
  });
});

describe("formatPrompt", () => {
  it("formats home prompt", () => {
    expect(formatPrompt(createContext())).toBe("anderson@portfolio:~$ ");
  });

  it("formats nested path", () => {
    const ctx = createContext({ cwd: `${HOME}/experience` });
    expect(formatPrompt(ctx)).toBe("anderson@portfolio:~/experience$ ");
  });
});

describe("MOTD", () => {
  it("includes welcome and tutorial hint", () => {
    const text = MOTD.flatMap((l) => l.segments.map((s) => s.text)).join("");
    expect(text).toContain("tutorial");
    expect(text).toContain("pytest");
  });
});

describe("applyEffects", () => {
  it("updates cwd on cd effect", () => {
    const ctx = createContext();
    const next = applyEffects(ctx, [{ type: "cd", path: `${HOME}/projects` }]);
    expect(next.cwd).toBe(`${HOME}/projects`);
    expect(next.prevCwd).toBe(HOME);
  });
});

describe("runCommandLine", () => {
  it("appends output and history", () => {
    const state = { ...createContext(), output: [...MOTD] };
    const next = runCommandLine("pwd", state);
    expect(next.history).toContain("pwd");
    expect(next.output.length).toBeGreaterThan(MOTD.length);
  });

  it("clears output on clear command", () => {
    const state = { ...createContext(), output: [...MOTD] };
    const next = runCommandLine("clear", state);
    expect(next.output).toHaveLength(0);
  });
});
