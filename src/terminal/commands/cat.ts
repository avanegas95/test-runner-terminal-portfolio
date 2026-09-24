import { highlightContent } from "../highlight";
import { fileExists, pathIsDir, readFile, relativeToHome, resolvePath } from "../fs";
import { line, text, type Command, type OutputLine } from "../types";

export const catCommand: Command = {
  name: "cat",
  summary: "Display file contents",
  usage: "cat <file…>",
  details:
    "Prints the contents of one or more files with syntax highlighting for .py, .md, .ini, and .txt files.",
  examples: ["cat README.md", "cat experience/boston_dynamics/staff_sqa_engineer.md"],
  group: "Read",
  run(argv, ctx) {
    if (argv.length === 0) {
      return {
        lines: [line(text("cat: missing file operand", "error"))],
      };
    }

    const lines: OutputLine[] = [];

    for (const arg of argv) {
      const target = resolvePath(arg, ctx.cwd, ctx.home);

      if (!fileExists(target, ctx.home)) {
        lines.push(
          line(text(`cat: ${arg}: No such file or directory`, "error")),
        );
        continue;
      }

      if (pathIsDir(target, ctx.home)) {
        lines.push(line(text(`cat: ${arg}: Is a directory`, "error")));
        continue;
      }

      const content = readFile(target, ctx.home);
      if (content === null) {
        lines.push(line(text(`cat: ${arg}: No such file or directory`, "error")));
        continue;
      }

      const rel = relativeToHome(target, ctx.home);

      if (content.includes("binary file") || content.includes("HTML report")) {
        lines.push(line(text(content, "warning")));
        continue;
      }

      const highlighted = highlightContent(content, rel);
      for (const segs of highlighted) {
        lines.push(line(...segs));
      }
    }

    return { lines };
  },
};
