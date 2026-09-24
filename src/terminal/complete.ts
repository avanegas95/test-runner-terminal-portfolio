import { displayPath, listDirectory, resolvePath } from "./fs";
import { getAllCommandNames, getCommandByName } from "./commands";
import { tokenize } from "./parser";

export type CompletionResult = {
  /** Full replacement for the current word, or null if listing options */
  completion: string | null;
  /** Options to display on double-tab */
  options: string[];
};

function longestCommonPrefix(strings: string[]): string {
  if (strings.length === 0) return "";
  if (strings.length === 1) return strings[0]!;
  let prefix = strings[0]!;
  for (const s of strings.slice(1)) {
    while (!s.startsWith(prefix) && prefix.length > 0) {
      prefix = prefix.slice(0, -1);
    }
  }
  return prefix;
}

function getCurrentWord(input: string): { prefix: string; word: string; isFirst: boolean } {
  const trimmed = input.endsWith(" ") ? input : input;
  const endsWithSpace = input.endsWith(" ");
  const parts = trimmed.split(/\s+/).filter(Boolean);

  if (parts.length === 0 || (endsWithSpace && parts.length >= 1)) {
    return { prefix: input, word: endsWithSpace ? "" : parts[parts.length - 1] ?? "", isFirst: endsWithSpace ? false : parts.length <= 1 };
  }

  const word = parts[parts.length - 1] ?? "";
  const prefix = input.slice(0, input.length - word.length);
  return { prefix, word, isFirst: parts.length === 1 };
}

const PATH_COMMANDS = new Set([
  "cd",
  "ls",
  "cat",
  "tree",
  "open",
  "man",
  "help",
]);

export function complete(
  input: string,
  ctx: { cwd: string; home: string },
): CompletionResult {
  const tokens = tokenize(input.trim());
  const endsWithSpace = input.endsWith(" ");
  const cmdName = tokens[0]?.toLowerCase() ?? "";
  const completingCommand = tokens.length <= 1 && !endsWithSpace;

  if (completingCommand) {
    const partial = cmdName;
    const matches = getAllCommandNames().filter((n) =>
      n.startsWith(partial),
    );
    const unique = [...new Set(matches)].sort();

    if (unique.length === 0) {
      return { completion: null, options: [] };
    }

    const lcp = longestCommonPrefix(unique);
    if (unique.length === 1) {
      return { completion: unique[0]! + " ", options: unique };
    }

    if (lcp.length > partial.length) {
      return { completion: lcp, options: unique };
    }

    return { completion: null, options: unique };
  }

  const cmd = getCommandByName(cmdName);
  const { word } = getCurrentWord(input);

  if (!cmd || !PATH_COMMANDS.has(cmd.name)) {
    return { completion: null, options: [] };
  }

  const basePath = word.includes("/")
    ? word.slice(0, word.lastIndexOf("/") + 1)
    : "";
  const partialName = word.includes("/") ? word.slice(word.lastIndexOf("/") + 1) : word;

  const dirPath = basePath
    ? resolvePath(basePath, ctx.cwd, ctx.home)
    : ctx.cwd;

  const entries = listDirectory(dirPath, ctx.home, { all: cmd.name === "ls" });
  const matches = entries
    .filter((e) => e.name.startsWith(partialName))
    .map((e) => {
      const rel = displayPath(e.path, ctx.home);
      const suffix = e.isDir ? "/" : "";
      return basePath ? basePath + e.name + suffix : rel.replace(/^~\/?/, "") + (e.isDir && !rel.includes("/") ? "/" : e.isDir ? suffix : "");
    });

  if (matches.length === 0) {
    return { completion: null, options: [] };
  }

  const displayMatches = entries
    .filter((e) => e.name.startsWith(partialName))
    .map((e) => {
      const shown = basePath ? basePath + e.name : displayPath(e.path, ctx.home);
      return e.isDir ? `${shown}/` : shown;
    });

  if (matches.length === 1) {
    const m = displayMatches[0]!;
    const replaceWord = basePath
      ? m
      : m;
    const before = input.slice(0, input.length - word.length);
    return { completion: before + replaceWord + (replaceWord.endsWith("/") ? "" : " "), options: displayMatches };
  }

  const lcp = longestCommonPrefix(
    entries.filter((e) => e.name.startsWith(partialName)).map((e) => e.name),
  );

  if (lcp.length > partialName.length) {
    const before = input.slice(0, input.length - word.length);
    return { completion: before + basePath + lcp, options: displayMatches };
  }

  return { completion: null, options: displayMatches };
}
