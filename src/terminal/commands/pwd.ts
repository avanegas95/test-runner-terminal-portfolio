import { displayPath } from "../fs";
import { line, text, type Command } from "../types";

export const pwdCommand: Command = {
  name: "pwd",
  summary: "Print working directory",
  usage: "pwd",
  details: "Shows the full path of the folder you are in.",
  examples: ["pwd"],
  group: "Navigate",
  run(_argv, ctx) {
    return {
      lines: [line(text(displayPath(ctx.cwd, ctx.home)))],
    };
  },
};
