import { describe, expect, it } from "vitest";
import {
  HOME,
  buildTree,
  displayPath,
  fileExists,
  listDirectory,
  normalizePath,
  readFile,
  relativeToHome,
  resolvePath,
} from "../fs";

const ctx = { cwd: HOME, home: HOME };

describe("path resolution", () => {
  it("resolves home tilde", () => {
    expect(resolvePath("~", ctx.cwd, HOME)).toBe(HOME);
    expect(resolvePath("~/experience", ctx.cwd, HOME)).toBe(
      `${HOME}/experience`,
    );
  });

  it("resolves parent directory", () => {
    expect(
      resolvePath("..", `${HOME}/experience/boston_dynamics`, HOME),
    ).toBe(`${HOME}/experience`);
  });

  it("resolves absolute paths", () => {
    expect(resolvePath("/home/anderson/projects", ctx.cwd, HOME)).toBe(
      `${HOME}/projects`,
    );
  });

  it("normalizes dot segments", () => {
    expect(normalizePath("./experience/./boston_dynamics", HOME, HOME)).toBe(
      `${HOME}/experience/boston_dynamics`,
    );
  });

  it("displays ~ for home", () => {
    expect(displayPath(HOME, HOME)).toBe("~");
    expect(displayPath(`${HOME}/experience`, HOME)).toBe("~/experience");
  });

  it("computes relative paths", () => {
    expect(relativeToHome(`${HOME}/tests`, HOME)).toBe("tests");
  });
});

describe("virtual filesystem", () => {
  it("lists home directory", () => {
    const entries = listDirectory(HOME, HOME);
    expect(entries.some((e) => e.name === "README.md")).toBe(true);
    expect(entries.some((e) => e.name === "experience" && e.isDir)).toBe(true);
  });

  it("hides dotfiles without -a", () => {
    const entries = listDirectory(HOME, HOME);
    expect(entries.some((e) => e.name === ".bashrc")).toBe(false);
  });

  it("shows dotfiles with all option", () => {
    const entries = listDirectory(HOME, HOME, { all: true });
    expect(entries.some((e) => e.name === ".bashrc")).toBe(true);
  });

  it("reads markdown files", () => {
    const content = readFile(`${HOME}/README.md`, HOME);
    expect(content).toContain("Anderson Vanegas");
  });

  it("returns binary message for pdf", () => {
    const content = readFile(`${HOME}/resume.pdf`, HOME);
    expect(content).toContain("binary file");
  });

  it("checks file existence", () => {
    expect(fileExists(`${HOME}/pytest.ini`, HOME)).toBe(true);
    expect(fileExists(`${HOME}/nope.txt`, HOME)).toBe(false);
  });

  it("builds tree output", () => {
    const lines = buildTree(HOME, HOME);
    expect(lines.length).toBeGreaterThan(5);
    expect(lines[0]).toContain("~");
  });
});
