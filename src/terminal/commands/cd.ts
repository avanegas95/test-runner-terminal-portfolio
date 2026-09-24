import { fileExists, pathIsDir, resolvePath } from "../fs";
import { displayPath } from "../fs";
import { line, text, type Command } from "../types";

export const cdCommand: Command = {
  name: "cd",
  summary: "Change directory",
  usage: "cd [path]",
  details:
    "Moves you into a folder. Use cd .. to go up, cd - for the previous directory, cd ~ for home, or cd / for root.",
  examples: ["cd experience", "cd ..", "cd -", "cd ~"],
  group: "Navigate",
  run(argv, ctx) {
    const arg = argv[0];

    if (!arg) {
      return {
        lines: [],
        effects: [{ type: "cd", path: ctx.home }],
      };
    }

    if (arg === "-") {
      if (!ctx.prevCwd) {
        return {
          lines: [line(text("cd: OLDPWD not set", "error"))],
        };
      }
      return {
        lines: [],
        effects: [{ type: "cd", path: ctx.prevCwd }],
      };
    }

    const target = resolvePath(arg, ctx.cwd, ctx.home);

    if (!fileExists(target, ctx.home)) {
      return {
        lines: [
          line(
            text(
              `cd: ${arg}: No such file or directory`,
              "error",
            ),
          ),
        ],
      };
    }

    if (!pathIsDir(target, ctx.home)) {
      return {
        lines: [
          line(text(`cd: ${arg}: Not a directory`, "error")),
        ],
      };
    }

    return {
      lines: [],
      effects: [{ type: "cd", path: target }],
    };
  },
};

export function formatCdEffect(currentCwd: string, newPath: string): string {
  return displayPath(newPath, currentCwd.includes("/home/") ? "/home/anderson" : currentCwd);
}
