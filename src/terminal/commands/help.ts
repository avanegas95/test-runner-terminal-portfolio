import { line, text, type Command, type CommandMeta } from "../types";
import { getAllCommands, getCommandByName } from "./index";

function renderCompactHelp(commands: CommandMeta[]): import("../types").OutputLine[] {
  const groups = new Map<string, CommandMeta[]>();
  for (const cmd of commands) {
    const list = groups.get(cmd.group) ?? [];
    list.push(cmd);
    groups.set(cmd.group, list);
  }

  const lines = [
    line(text("Portfolio terminal — quick reference", "bold")),
    line(text("")),
  ];

  for (const [group, cmds] of groups) {
    lines.push(line(text(`${group}:`, "accent")));
    for (const cmd of cmds) {
      lines.push(
        line(
          text(`  ${cmd.name.padEnd(12)}`, "keyword"),
          text(cmd.summary, "dim"),
        ),
      );
    }
    lines.push(line(text("")));
  }

  lines.push(
    line(text("Type ", "dim"), text("help <cmd>", "accent"), text(" or ", "dim"), text("tutorial", "accent"), text(" for more.", "dim")),
  );

  return lines;
}

function renderVerboseHelp(commands: CommandMeta[]): import("../types").OutputLine[] {
  const lines = [
    line(text("Portfolio Terminal — verbose guide", "bold")),
    line(text("")),
    line(text("What is this?", "accent")),
    line(text("  A virtual Linux-style terminal built into Anderson's portfolio.")),
    line(text("  A directory is just a folder. Files hold resume content and pytest tests.")),
    line(text("")),
  ];

  for (const cmd of commands.filter((c) => c.group !== "Session")) {
    lines.push(line(text(`${cmd.name} — ${cmd.summary}`, "bold")));
    lines.push(line(text(`  Usage: ${cmd.usage}`, "dim")));
    lines.push(line(text(`  ${cmd.details}`)));
    if (cmd.examples[0]) {
      lines.push(
        line(
          text("  Example: ", "dim"),
          text(cmd.examples[0], "accent", { run: cmd.examples[0] }),
        ),
      );
    }
    lines.push(line(text("")));
  }

  lines.push(
    line(text("You can close the terminal anytime — everything is also on the page above.", "dim")),
  );

  return lines;
}

function renderCommandHelp(cmd: CommandMeta): import("../types").OutputLine[] {
  const lines = [
    line(text(`NAME`, "bold")),
    line(text(`    ${cmd.name} — ${cmd.summary}`)),
    line(text("")),
    line(text(`USAGE`, "bold")),
    line(text(`    ${cmd.usage}`)),
    line(text("")),
    line(text(`DESCRIPTION`, "bold")),
    line(text(`    ${cmd.details}`)),
  ];

  if (cmd.examples.length > 0) {
    lines.push(line(text("")), line(text(`EXAMPLES`, "bold")));
    for (const ex of cmd.examples) {
      lines.push(
        line(text("    "), text(ex, "accent", { run: ex })),
      );
    }
  }

  return lines;
}

export const helpCommand: Command = {
  name: "help",
  summary: "Show command reference",
  usage: "help [cmd] | help -v",
  details:
    "Compact grouped table by default. help -v gives plain-English details for every command. help <cmd> shows one command.",
  examples: ["help", "help -v", "help pytest"],
  group: "Info",
  run(argv) {
    const commands = getAllCommands();

    if (argv.includes("-v") || argv.includes("--verbose")) {
      return { lines: renderVerboseHelp(commands) };
    }

    const target = argv.find((a) => !a.startsWith("-"));
    if (target) {
      const cmd = getCommandByName(target);
      if (!cmd) {
        return {
          lines: [line(text(`help: no help topics match '${target}'`, "error"))],
        };
      }
      return { lines: renderCommandHelp(cmd) };
    }

    return { lines: renderCompactHelp(commands) };
  },
};
