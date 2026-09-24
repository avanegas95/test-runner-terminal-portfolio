import { resume } from "@/content/resume";
import { knownIssues, knownIssuesMeta } from "@/content/known-issues";
import type { ExperienceRole, Project } from "@/content/types";

function roleMarkdown(role: ExperienceRole, company: string): string {
  const lines = [
    `# ${role.title}`,
    `**${company}** · ${role.startDate} – ${role.endDate}`,
    "",
    role.oneLiner,
    "",
    ...role.bullets.map((b) => `- ${b.text}`),
  ];
  return lines.join("\n");
}

export function renderExperienceRole(roleId: string): string {
  for (const co of resume.experience) {
    const role = co.roles.find((r) => r.id === roleId);
    if (role) return roleMarkdown(role, co.company);
  }
  return `# Not found\nRole "${roleId}" does not exist.`;
}

export function renderProject(projectId: string): string {
  const project = resume.projects.find((p) => p.id === projectId);
  if (!project) return `# Not found\nProject "${projectId}" does not exist.`;
  return renderProjectContent(project);
}

function renderProjectContent(project: Project): string {
  return [
    `# ${project.name}`,
    "",
    project.summary,
    "",
    "## Stack",
    ...project.stack.map((s) => `- ${s}`),
    "",
    "## Highlights",
    ...project.highlights.map((h) => `- ${h}`),
  ].join("\n");
}

export function renderEducation(): string {
  const { education } = resume;
  return [
    `# ${education.institution}`,
    "",
    `**${education.degree}** · ${education.year}`,
  ].join("\n");
}

export function renderReadme(): string {
  return [
    "# Anderson Vanegas — Portfolio",
    "",
    "Welcome to my interactive portfolio terminal.",
    "",
    "This virtual filesystem mirrors my resume, projects, and pytest test suite.",
    "",
    "## Quick start",
    "",
    "- `ls` — list files in the current directory",
    "- `cat README.md` — you are here",
    "- `cd experience` — browse work history",
    "- `pytest` — run the resume test suite (14 passed, 1 failed on purpose)",
    "- `tutorial` — guided walkthrough for terminal newcomers",
    "",
    "Everything here is also visible on the page above — the terminal is optional.",
  ].join("\n");
}

export function renderAbout(): string {
  const { profile } = resume;
  return [
    `# About ${profile.name}`,
    "",
    `**${profile.title}** @ ${profile.company}`,
    "",
    profile.summary,
    "",
    `- **Location:** ${profile.location}`,
    `- **Experience:** ${profile.yearsExperience}`,
    `- **Languages:** ${profile.languages.join(", ")}`,
  ].join("\n");
}

export function renderKnownIssues(): string {
  const header = [
    `# ${knownIssuesMeta.title}`,
    "",
    knownIssuesMeta.subtitle,
    "",
    "| Issue | Severity | Status |",
    "| --- | --- | --- |",
  ];
  const rows = knownIssues.map(
    (ki) => `| ${ki.issue} | ${ki.severity} | ${ki.status} |`,
  );
  return [...header, ...rows].join("\n");
}
