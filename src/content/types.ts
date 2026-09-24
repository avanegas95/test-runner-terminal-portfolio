export type TestStatus = "pass" | "fail";

export type DetailMetadata = {
  role: string;
  company: string;
  period: string;
};

export type Detail = {
  metadata?: DetailMetadata;
  plainEnglish: string;
  describeLabel?: string;
  bullets?: string[];
  glossary?: string[];
};

export type Test = {
  id: string;
  name: string;
  ms: number | null;
  status: TestStatus;
  detail?: Detail;
};

export type Suite = {
  file: string;
  tests: Test[];
};

export type KnownIssueSeverity = "low" | "medium" | "cosmetic";

export type KnownIssue = {
  id: string;
  issue: string;
  severity: KnownIssueSeverity;
  status: string;
};

export type FailureDetail = {
  title: string;
  expectLine: string;
  expected: string;
  received: string;
  stack: string;
  statusComment: string;
};

export type AnimationDelay = {
  id: string;
  delay: number;
};
