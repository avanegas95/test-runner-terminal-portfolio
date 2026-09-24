import type { KnownIssue } from "./types";

export const knownIssuesMeta = {
  title: "Known Issues",
  subtitle: "The person behind the test plans, filed like a bug report.",
  footerPrompt: "Found another one?",
  footerAction: "Report it — Contact",
  footerHref: "/contact",
} as const;

export const knownIssues: KnownIssue[] = [
  {
    id: "KI-01",
    issue: "Can't walk past a Raspberry Pi or ESP32 without starting a project.",
    severity: "low",
    status: "won't fix",
  },
  {
    id: "KI-02",
    issue: "Runs a self-hosted homelab server and takes its uptime personally.",
    severity: "medium",
    status: "by design",
  },
  {
    id: "KI-03",
    issue: "Carries a Fujifilm X100VI everywhere. Expect photos.",
    severity: "low",
    status: "by design",
  },
  {
    id: "KI-04",
    issue: "The 3D printer queue is never empty.",
    severity: "low",
    status: "open",
  },
  {
    id: "KI-05",
    issue: "Does his own wiring and plumbing, then regression-tests the house.",
    severity: "medium",
    status: "by design",
  },
  {
    id: "KI-06",
    issue: "Streams games, always in 16:9 for the viewers.",
    severity: "cosmetic",
    status: "won't fix",
  },
  {
    id: "KI-07",
    issue: "Mows the lawn in straight, reproducible lines.",
    severity: "cosmetic",
    status: "closed",
  },
  {
    id: "KI-08",
    issue: "Cannot resist a pun.",
    severity: "low",
    status: "won't fix",
  },
];
