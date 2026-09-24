import { describe, expect, it } from "vitest";
import { formatSuggestion, levenshtein, suggest } from "../suggest";

describe("levenshtein", () => {
  it("returns 0 for identical strings", () => {
    expect(levenshtein("help", "help")).toBe(0);
  });

  it("counts single edits", () => {
    expect(levenshtein("help", "helo")).toBe(1);
    expect(levenshtein("pytest", "pyest")).toBe(1);
  });

  it("is case-insensitive in suggest", () => {
    expect(suggest("Hel", ["help", "ls"])).toContain("help");
  });
});

describe("suggest", () => {
  const commands = ["ls", "cd", "cat", "pytest", "help", "tutorial"];

  it("finds close matches within distance 2", () => {
    expect(suggest("pyest", commands)).toContain("pytest");
    expect(suggest("hel", commands)).toContain("help");
  });

  it("excludes exact matches", () => {
    expect(suggest("help", commands)).toEqual([]);
  });

  it("returns empty when too far", () => {
    expect(suggest("zzzzzzz", commands)).toEqual([]);
  });
});

describe("formatSuggestion", () => {
  it("formats single suggestion", () => {
    expect(formatSuggestion("pyest", ["pytest"])).toContain("Did you mean 'pytest'?");
  });

  it("formats multiple suggestions", () => {
    const msg = formatSuggestion("x", ["ls", "cd"]);
    expect(msg).toContain("Did you mean:");
  });

  it("formats not found without suggestions", () => {
    expect(formatSuggestion("foo", [])).toBe("bash: foo: command not found");
  });
});
