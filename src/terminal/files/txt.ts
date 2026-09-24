import { resume } from "@/content/resume";

export function renderContact(): string {
  const { contact } = resume;
  return [
    "Anderson Vanegas — Contact",
    "==========================",
    "",
    `Email:    ${contact.email}`,
    `LinkedIn: ${contact.linkedIn}`,
    `GitHub:   ${contact.github}`,
  ].join("\n");
}

export function renderRequirements(): string {
  const packages = [
    "pytest==8.3.2",
    "appium-python-client==4.0.0",
    "selenium==4.25.0",
    "playwright==1.48.0",
    "fastapi==0.115.0",
    "pydantic==2.9.0",
  ];

  const skills = resume.skills.flatMap((g) => g.items);
  const skillLines = skills.slice(0, 8).map((s) => {
    const pkg = s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    return `# ${s}`;
  });

  return [
    "# Anderson Vanegas — pinned dependencies",
    "# Skills mapped as packages for fun",
    "",
    ...packages,
    "",
    ...skillLines,
  ].join("\n");
}

export function renderBashrc(): string {
  return [
    "# Anderson's portfolio .bashrc",
    "# Aliases for the terminal drawer",
    "",
    "alias ll='ls -l'",
    "alias la='ls -a'",
    "",
    "# TODO: figure out how to exit vim",
    "# export EDITOR=vim  # you've been warned",
  ].join("\n");
}
