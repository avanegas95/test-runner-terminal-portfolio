import { getCommandByName, getAllCommands, getCommandNames } from "./commands";
import { tokenize } from "./parser";
import { formatSuggestion, suggest } from "./suggest";
import { complete } from "./complete";
import { displayPath, HOME, resolvePath } from "./fs";
import type {
  CommandContext,
  CommandResult,
  Effect,
  OutputLine,
} from "./types";
import { line, text } from "./types";

export const DEFAULT_USERNAME = "anderson";
export const DEFAULT_HOSTNAME = "portfolio";
export const LAST_FAILED_TEST_ID = "flaky-test";

export type TerminalState = CommandContext & {
  output: OutputLine[];
};

export function createContext(
  overrides: Partial<CommandContext> = {},
): CommandContext {
  return {
    cwd: HOME,
    prevCwd: null,
    home: HOME,
    history: [],
    username: DEFAULT_USERNAME,
    hostname: DEFAULT_HOSTNAME,
    lastFailedTestId: LAST_FAILED_TEST_ID,
    ...overrides,
  };
}

export function formatPrompt(ctx: CommandContext): string {
  const path = displayPath(ctx.cwd, ctx.home);
  return `${ctx.username}@${ctx.hostname}:${path}$ `;
}

export const MOTD: OutputLine[] = [
  line(text("Welcome to Anderson's portfolio terminal.", "accent")),
  line(
    text("New to terminals? Type "),
    text("tutorial", "accent", { run: "tutorial" }),
    text(" (or click it)."),
  ),
  line(
    text("Know your way around? "),
    text("help", "accent", { run: "help" }),
    text(", "),
    text("ls", "accent", { run: "ls" }),
    text(", "),
    text("pytest", "accent", { run: "pytest" }),
  ),
];

export function applyEffects(
  ctx: CommandContext,
  effects: Effect[] | undefined,
): CommandContext {
  if (!effects?.length) return ctx;

  let next = { ...ctx };

  for (const effect of effects) {
    switch (effect.type) {
      case "cd":
        next = {
          ...next,
          prevCwd: next.cwd,
          cwd: resolvePath(effect.path, next.cwd, next.home),
        };
        break;
      default:
        break;
    }
  }

  return next;
}

export function runCommand(
  input: string,
  ctx: CommandContext,
): { result: CommandResult; ctx: CommandContext } {
  const trimmed = input.trim();
  if (!trimmed) {
    return { result: { lines: [] }, ctx };
  }

  const tokens = tokenize(trimmed);
  const cmdName = tokens[0]?.toLowerCase() ?? "";
  const argv = tokens.slice(1);

  const cmd = getCommandByName(cmdName);
  if (!cmd) {
    const names = getCommandNames();
    const suggestions = suggest(cmdName, names);
    return {
      result: {
        lines: [
          line(text(formatSuggestion(cmdName, suggestions), "error")),
          line(
            text("Type "),
            text("help", "accent", { run: "help" }),
            text(" for available commands."),
          ),
        ],
      },
      ctx,
    };
  }

  const result = cmd.run(argv, ctx);
  const nextCtx = applyEffects(ctx, result.effects);

  return { result, ctx: nextCtx };
}

export function runCommandLine(
  input: string,
  state: TerminalState,
): TerminalState {
  const { result, ctx } = runCommand(input, state);
  const history =
    input.trim() && (state.history.length === 0 || state.history[state.history.length - 1] !== input.trim())
      ? [...state.history, input.trim()]
      : state.history;

  const cleared = result.effects?.some((e) => e.type === "clear");
  const output = cleared
    ? result.lines
    : [...state.output, ...result.lines];

  return {
    ...ctx,
    history,
    output,
  };
}

// Re-exports
export type {
  CommandContext,
  CommandResult,
  Effect,
  OutputLine,
  Segment,
  SegmentAction,
  SegmentStyle,
  Command,
  CommandMeta,
} from "./types";

export { tokenize, parseArgs, hasFlag, getFlag, getFlagString } from "./parser";
export { suggest, levenshtein, formatSuggestion } from "./suggest";
export { complete } from "./complete";
export {
  resolvePath,
  normalizePath,
  displayPath,
  relativeToHome,
  listDirectory,
  readFile,
  fileExists,
  pathIsDir,
  buildTree,
  allPaths,
  HOME,
} from "./fs";
export { highlightContent, highlightLine, extensionFromPath } from "./highlight";
export { collectTests, runPytest, parsePytestArgs } from "./pytest";
export { getAllCommands, getCommandByName, getCommandNames };
