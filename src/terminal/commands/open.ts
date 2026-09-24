import { fileExists, pathIsDir, relativeToHome, resolvePath } from "../fs";
import { resume } from "@/content/resume";
import { line, text, type Command, type Effect } from "../types";

const SECTION_MAP: Record<string, string> = {
  experience: "experience",
  projects: "projects",
  skills: "skills",
  about: "about",
  education: "education",
  contact: "contact",
  hero: "hero",
};

export const openCommand: Command = {
  name: "open",
  summary: "Open a file, section, or URL",
  usage: "open <target>",
  details:
    "Opens resume PDF, HTML report, scrolls to a GUI section, or launches mailto/links.",
  examples: [
    "open resume.pdf",
    "open experience",
    "open reports/anderson_report.html",
  ],
  group: "Read",
  run(argv, ctx) {
    if (argv.length === 0) {
      return {
        lines: [line(text("open: missing operand", "error"))],
      };
    }

    const arg = argv[0]!;
    const effects: Effect[] = [];
    const lines = [];

    if (arg.startsWith("http://") || arg.startsWith("https://")) {
      effects.push({ type: "openUrl", url: arg });
      lines.push(line(text(`Opening ${arg}`, "accent")));
      return { lines, effects };
    }

    const sectionId = SECTION_MAP[arg.toLowerCase()] ?? SECTION_MAP[arg.split("/")[0]?.toLowerCase() ?? ""];
    if (sectionId && !arg.includes(".")) {
      effects.push({ type: "scrollTo", sectionId });
      lines.push(line(text(`Scrolling to #${sectionId} on the page above.`, "accent")));
      return { lines, effects };
    }

    const target = resolvePath(arg, ctx.cwd, ctx.home);
    const rel = relativeToHome(target, ctx.home);

    if (rel === "resume.pdf" || arg === "resume.pdf") {
      effects.push({ type: "download", path: "/Anderson_Vanegas_Resume.pdf" });
      lines.push(line(text("Opening resume.pdf…", "accent")));
      return { lines, effects };
    }

    if (rel === "reports/anderson_report.html") {
      effects.push({ type: "openUrl", url: "/report" });
      lines.push(line(text("Opening test report at /report", "accent")));
      return { lines, effects };
    }

    if (rel === "contact.txt") {
      effects.push({ type: "openUrl", url: `mailto:${resume.contact.email}` });
      lines.push(line(text(`Opening mailto:${resume.contact.email}`, "accent")));
      return { lines, effects };
    }

    if (fileExists(target, ctx.home) && !pathIsDir(target, ctx.home)) {
      return {
        lines: [line(text(`Opening ${arg} — try cat ${arg}`, "accent"))],
      };
    }

    return {
      lines: [line(text(`open: ${arg}: No such file or section`, "error"))],
    };
  },
};
