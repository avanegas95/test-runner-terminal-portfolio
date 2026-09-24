import { describe, expect, it } from "vitest";
import { getFileContent } from "../files";
import { renderConftest, renderTestFile } from "../files/python";

describe("file renderers", () => {
  it("renders README", () => {
    expect(getFileContent("README.md")).toContain("Quick start");
  });

  it("renders experience role", () => {
    const content = getFileContent("experience/boston_dynamics/staff_sqa_engineer.md");
    expect(content).toContain("Staff SQA Engineer");
    expect(content).toContain("Boston Dynamics");
  });

  it("renders conftest.py", () => {
    const content = renderConftest();
    expect(content).toContain("@pytest.fixture");
    expect(content).toContain("flaky_test");
  });

  it("renders test files from content", () => {
    const content = renderTestFile("test_personality.py");
    expect(content).toContain("test_can_ignore_flaky_test");
    expect(content).toContain("flaky_test");
  });

  it("renders KNOWN_ISSUES table", () => {
    const content = getFileContent("KNOWN_ISSUES.md");
    expect(content).toContain("| Issue |");
    expect(content).toContain("Raspberry Pi");
  });
});
