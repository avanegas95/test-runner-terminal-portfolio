import { line, text, type Command } from "../types";

export const historyCommand: Command = {
  name: "history",
  summary: "Show command history",
  usage: "history",
  details: "Lists commands from this session (newest last). Use ↑/↓ to recall them in the input.",
  examples: ["history"],
  group: "Info",
  run(_argv, ctx) {
    if (ctx.history.length === 0) {
      return { lines: [line(text("(no history yet)", "dim"))] };
    }

    return {
      lines: ctx.history.map((cmd, i) =>
        line(text(`  ${i + 1}  `, "dim"), text(cmd)),
      ),
    };
  },
};
