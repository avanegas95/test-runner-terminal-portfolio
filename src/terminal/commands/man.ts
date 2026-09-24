import { line, text, type Command } from "../types";
import { getCommandByName } from "./index";

export const manCommand: Command = {
  name: "man",
  summary: "Manual page for a command",
  usage: "man <command>",
  details: "Shows detailed usage, description, and examples for one command.",
  examples: ["man ls", "man pytest"],
  group: "Info",
  run(argv) {
    const target = argv[0];
    if (!target) {
      return {
        lines: [line(text("What manual page do you want?", "error"))],
      };
    }

    const cmd = getCommandByName(target);
    if (!cmd) {
      return {
        lines: [line(text(`No manual entry for ${target}`, "error"))],
      };
    }

    const lines = [
      line(text(`${cmd.name.toUpperCase()}(1)`, "bold")),
      line(text("")),
      line(text("NAME"), text(`     ${cmd.name} - ${cmd.summary}`)),
      line(text("")),
      line(text("SYNOPSIS"), text(`     ${cmd.usage}`)),
      line(text("")),
      line(text("DESCRIPTION"), text(`     ${cmd.details}`)),
    ];

    if (cmd.examples.length) {
      lines.push(line(text("")), line(text("EXAMPLES")));
      for (const ex of cmd.examples) {
        lines.push(
          line(text("     "), text(ex, "accent", { run: ex })),
        );
      }
    }

    return { lines };
  },
};
