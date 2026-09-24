import { describe, expect, it } from "vitest";
import {
  extensionFromPath,
  highlightContent,
  highlightLine,
} from "../highlight";

describe("highlightLine", () => {
  it("highlights python keywords", () => {
    const segs = highlightLine("def test_foo():", "py");
    expect(segs.some((s) => s.style === "keyword" && s.text === "def")).toBe(true);
  });

  it("highlights markdown headers", () => {
    const segs = highlightLine("# Title", "md");
    expect(segs.some((s) => s.style === "bold")).toBe(true);
  });

  it("highlights ini sections", () => {
    const segs = highlightLine("[pytest]", "ini");
    expect(segs.some((s) => s.style === "keyword")).toBe(true);
  });

  it("highlights urls in txt", () => {
    const segs = highlightLine("Visit https://example.com", "txt");
    expect(segs.some((s) => s.style === "accent")).toBe(true);
  });
});

describe("highlightContent", () => {
  it("highlights multiple lines", () => {
    const lines = highlightContent("# Hello\n\nBody", "README.md");
    expect(lines).toHaveLength(3);
  });
});

describe("extensionFromPath", () => {
  it("extracts extension", () => {
    expect(extensionFromPath("tests/test_career.py")).toBe("py");
    expect(extensionFromPath("README.md")).toBe("md");
  });
});
