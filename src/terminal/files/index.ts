import {
  renderAbout,
  renderEducation,
  renderExperienceRole,
  renderKnownIssues,
  renderProject,
  renderReadme,
} from "./markdown";
import { renderConftest, renderTestFile } from "./python";
import { renderPytestIni } from "./ini";
import {
  renderBashrc,
  renderContact,
  renderRequirements,
} from "./txt";

export type FileKind =
  | "markdown"
  | "python"
  | "ini"
  | "txt"
  | "html"
  | "pdf"
  | "binary";

export type VirtualFile = {
  kind: FileKind;
  /** Lazy content generator */
  render: () => string;
  /** Message when cat tries to read binary/non-text */
  catMessage?: string;
};

const FILE_REGISTRY: Record<string, VirtualFile> = {
  "README.md": { kind: "markdown", render: renderReadme },
  "about.md": { kind: "markdown", render: renderAbout },
  "contact.txt": { kind: "txt", render: renderContact },
  "KNOWN_ISSUES.md": { kind: "markdown", render: renderKnownIssues },
  "requirements.txt": { kind: "txt", render: renderRequirements },
  "pytest.ini": { kind: "ini", render: renderPytestIni },
  ".bashrc": { kind: "txt", render: renderBashrc },
  "resume.pdf": {
    kind: "pdf",
    render: () => "",
    catMessage: "resume.pdf: binary file — try `open resume.pdf`",
  },
  "reports/anderson_report.html": {
    kind: "html",
    render: () => "",
    catMessage:
      "reports/anderson_report.html: HTML report — try `open reports/anderson_report.html`",
  },
  "experience/boston_dynamics/staff_sqa_engineer.md": {
    kind: "markdown",
    render: () => renderExperienceRole("staff_sqa_engineer"),
  },
  "experience/boston_dynamics/senior_sqa_engineer.md": {
    kind: "markdown",
    render: () => renderExperienceRole("senior_sqa_engineer"),
  },
  "experience/sharkninja/sqa_engineer_ii.md": {
    kind: "markdown",
    render: () => renderExperienceRole("sqa_engineer_ii"),
  },
  "experience/sharkninja/sqa_engineer.md": {
    kind: "markdown",
    render: () => renderExperienceRole("sqa_engineer"),
  },
  "experience/sharkninja/product_dev_intern.md": {
    kind: "markdown",
    render: () => renderExperienceRole("product_dev_intern"),
  },
  "projects/state_of_ecosystems.md": {
    kind: "markdown",
    render: () => renderProject("state_of_ecosystems"),
  },
  "projects/finance_forecast.md": {
    kind: "markdown",
    render: () => renderProject("finance_forecast"),
  },
  "education/boston_university.md": {
    kind: "markdown",
    render: renderEducation,
  },
  "tests/conftest.py": { kind: "python", render: renderConftest },
  "tests/test_career.py": {
    kind: "python",
    render: () => renderTestFile("test_career.py"),
  },
  "tests/test_automation.py": {
    kind: "python",
    render: () => renderTestFile("test_automation.py"),
  },
  "tests/test_tooling.py": {
    kind: "python",
    render: () => renderTestFile("test_tooling.py"),
  },
  "tests/test_personality.py": {
    kind: "python",
    render: () => renderTestFile("test_personality.py"),
  },
};

export function getVirtualFile(relativePath: string): VirtualFile | undefined {
  return FILE_REGISTRY[relativePath.replace(/^\.\//, "")];
}

export function getFileContent(relativePath: string): string | null {
  const file = getVirtualFile(relativePath);
  if (!file) return null;
  if (file.catMessage) return file.catMessage;
  return file.render();
}

export function getFileKind(relativePath: string): FileKind | null {
  return getVirtualFile(relativePath)?.kind ?? null;
}

/** Directory entries for the virtual FS tree */
export const VIRTUAL_DIRS: Record<string, string[]> = {
  "": [
    "README.md",
    "about.md",
    "contact.txt",
    "KNOWN_ISSUES.md",
    "resume.pdf",
    "requirements.txt",
    "pytest.ini",
    ".bashrc",
    "experience",
    "projects",
    "education",
    "reports",
    "tests",
  ],
  experience: ["boston_dynamics", "sharkninja"],
  "experience/boston_dynamics": [
    "staff_sqa_engineer.md",
    "senior_sqa_engineer.md",
  ],
  "experience/sharkninja": [
    "sqa_engineer_ii.md",
    "sqa_engineer.md",
    "product_dev_intern.md",
  ],
  projects: ["state_of_ecosystems.md", "finance_forecast.md"],
  education: ["boston_university.md"],
  reports: ["anderson_report.html"],
  tests: [
    "conftest.py",
    "test_career.py",
    "test_automation.py",
    "test_tooling.py",
    "test_personality.py",
  ],
};

export function isHidden(name: string): boolean {
  return name.startsWith(".");
}
