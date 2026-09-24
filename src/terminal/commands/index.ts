import { lsCommand } from "./ls";
import { cdCommand } from "./cd";
import { pwdCommand } from "./pwd";
import { treeCommand } from "./tree";
import { catCommand } from "./cat";
import { openCommand } from "./open";
import { pytestCommand } from "./pytest";
import { whoamiCommand } from "./whoami";
import { helpCommand } from "./help";
import { tutorialCommand } from "./tutorial";
import { manCommand } from "./man";
import { historyCommand } from "./history";
import { echoCommand } from "./echo";
import { clearCommand } from "./clear";
import { exitCommand } from "./exit";
import {
  sudoCommand,
  rmCommand,
  vimCommand,
  pythonCommand,
} from "./easter-eggs";
import type { Command, CommandMeta } from "../types";

const COMMANDS: Command[] = [
  lsCommand,
  cdCommand,
  pwdCommand,
  treeCommand,
  catCommand,
  openCommand,
  pytestCommand,
  whoamiCommand,
  helpCommand,
  tutorialCommand,
  manCommand,
  historyCommand,
  echoCommand,
  clearCommand,
  exitCommand,
  sudoCommand,
  rmCommand,
  vimCommand,
  pythonCommand,
];

const byName = new Map<string, Command>();

for (const cmd of COMMANDS) {
  byName.set(cmd.name, cmd);
  for (const alias of cmd.aliases ?? []) {
    byName.set(alias, cmd);
  }
}

export function getAllCommands(): CommandMeta[] {
  return COMMANDS.map(({ run: _run, aliases: _aliases, ...meta }) => meta);
}

export function getCommandByName(name: string): Command | undefined {
  return byName.get(name.toLowerCase());
}

export function getCommandNames(): string[] {
  return COMMANDS.map((c) => c.name);
}

export function getAllCommandNames(): string[] {
  const names: string[] = [];
  for (const cmd of COMMANDS) {
    names.push(cmd.name);
    for (const alias of cmd.aliases ?? []) {
      names.push(alias);
    }
  }
  return names;
}

export { COMMANDS };
