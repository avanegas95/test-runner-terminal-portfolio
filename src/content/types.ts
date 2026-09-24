// ── Pytest test model (canonical; used by terminal + report) ─────────────────

export type PytestMarker = "smoke" | "sanity" | "regression" | "hil";

export type PytestStatus = "passed" | "failed" | "skipped";

export type PytestTest = {
  id: string;
  /** pytest function name, e.g. test_staff_sqa_engineer_boston_dynamics */
  name: string;
  marker: PytestMarker;
  durationMs: number | null;
  status: PytestStatus;
  /** Virtual FS path or resume section key, e.g. experience/boston_dynamics/staff_sqa_engineer */
  resumeRef: string;
  /** Docstring shown as plain-English summary in pytest -v output */
  docstring: string;
  /** Relative path under tests/, e.g. test_career.py */
  file: string;
};

export type PytestSuite = {
  file: string;
  tests: PytestTest[];
};

export type FailureDetail = {
  title: string;
  expected: string;
  received: string;
  stack: string;
  statusComment: string;
};

export type TestSummary = {
  passed: number;
  failed: number;
  skipped: number;
  timeSeconds: string;
};

// ── Known issues ─────────────────────────────────────────────────────────────

export type KnownIssueSeverity = "low" | "medium" | "cosmetic";

export type KnownIssue = {
  id: string;
  issue: string;
  severity: KnownIssueSeverity;
  status: string;
};

// ── Resume model ─────────────────────────────────────────────────────────────

export type Profile = {
  name: string;
  location: string;
  title: string;
  company: string;
  summary: string;
  /** TODO(confirm): headline uses "6+ years" — Nov 2019 → now is ~7 */
  yearsExperience: string;
  languages: string[];
};

export type ExperienceBullet = {
  text: string;
  glossaryTerms?: string[];
};

export type ExperienceRole = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  oneLiner: string;
  bullets: ExperienceBullet[];
  /** Virtual FS markdown path under ~/experience/ */
  terminalPath: string;
};

export type CompanyExperience = {
  id: string;
  company: string;
  roles: ExperienceRole[];
};

export type Project = {
  id: string;
  name: string;
  summary: string;
  stack: string[];
  highlights: string[];
  /** TODO(confirm): no live or repo URLs yet */
  url?: string;
  repoUrl?: string;
  terminalPath: string;
};

export type SkillGroup = {
  id: string;
  label: string;
  items: string[];
};

export type Education = {
  institution: string;
  degree: string;
  year: number;
  terminalPath: string;
};

export type Contact = {
  email: string;
  linkedIn: string;
  github: string;
  githubHandle: string;
};

export type Resume = {
  profile: Profile;
  experience: CompanyExperience[];
  projects: Project[];
  skills: SkillGroup[];
  education: Education;
  contact: Contact;
};

// ── Glossary ─────────────────────────────────────────────────────────────────

export type GlossaryEntry = {
  id: string;
  term: string;
  shortDefinition: string;
  longDefinition?: string;
};

export type Glossary = Record<string, GlossaryEntry>;
