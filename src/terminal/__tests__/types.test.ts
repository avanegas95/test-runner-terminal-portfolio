import { describe, expect, it } from "vitest";
import { line, plain, text } from "../types";
import { formatCdEffect } from "../commands/cd";
import { getFileContent, VIRTUAL_DIRS } from "../files";

describe("output helpers", () => {
  it("builds lines and segments", () => {
    expect(line(text("hi", "bold")).segments[0]?.text).toBe("hi");
    expect(plain("dim", "dim").segments[0]?.style).toBe("dim");
    expect(text("go", "accent", { run: "ls" }).action).toEqual({ run: "ls" });
  });

  it("formatCdEffect displays path", () => {
    expect(formatCdEffect("/home/anderson", "/home/anderson/experience")).toBe(
      "~/experience",
    );
  });
});

describe("all virtual files render", () => {
  function collectFiles(dir: string): string[] {
    const key = dir.replace(/\/$/, "");
    const entries = VIRTUAL_DIRS[key] ?? [];
    const files: string[] = [];
    for (const name of entries) {
      const child = dir ? `${dir}/${name}` : name;
      if (VIRTUAL_DIRS[child] || Object.keys(VIRTUAL_DIRS).includes(child)) {
        files.push(...collectFiles(child));
      } else {
        files.push(child);
      }
    }
    return files;
  }

  it("renders every registered file without error", () => {
    for (const path of collectFiles("")) {
      const content = getFileContent(path);
      expect(content).not.toBeNull();
    }
  });
});
