import type { ParsedArgs } from "./types";

/** Tokenize a command line respecting quotes and escapes */
export function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = "";
  let quote: "'" | '"' | null = null;
  let escaped = false;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i]!;

    if (escaped) {
      current += ch;
      escaped = false;
      continue;
    }

    if (ch === "\\" && quote !== "'") {
      escaped = true;
      continue;
    }

    if (quote) {
      if (ch === quote) {
        quote = null;
      } else {
        current += ch;
      }
      continue;
    }

    if (ch === "'" || ch === '"') {
      quote = ch;
      continue;
    }

    if (/\s/.test(ch)) {
      if (current) {
        tokens.push(current);
        current = "";
      }
      continue;
    }

    current += ch;
  }

  if (current) tokens.push(current);
  return tokens;
}

/** Parse argv into positional args and flags (-x, --long, --key=value) */
export function parseArgs(argv: string[]): ParsedArgs {
  const positional: string[] = [];
  const flags = new Map<string, string | boolean>();

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;

    if (arg.startsWith("--")) {
      const eq = arg.indexOf("=");
      if (eq !== -1) {
        flags.set(arg.slice(2, eq), arg.slice(eq + 1));
      } else {
        const name = arg.slice(2);
        const next = argv[i + 1];
        if (next && !next.startsWith("-")) {
          flags.set(name, next);
          i++;
        } else {
          flags.set(name, true);
        }
      }
    } else if (arg.startsWith("-") && arg.length > 1) {
      if (arg.length === 2) {
        const name = arg[1]!;
        const next = argv[i + 1];
        if (next && !next.startsWith("-")) {
          flags.set(name, next);
          i++;
        } else {
          flags.set(name, true);
        }
      } else {
        for (let j = 1; j < arg.length; j++) {
          flags.set(arg[j]!, true);
        }
      }
    } else {
      positional.push(arg);
    }
  }

  return { positional, flags };
}

export function hasFlag(
  flags: Map<string, string | boolean>,
  ...names: string[]
): boolean {
  return names.some((n) => flags.has(n));
}

export function getFlag(
  flags: Map<string, string | boolean>,
  name: string,
): string | boolean | undefined {
  return flags.get(name);
}

export function getFlagString(
  flags: Map<string, string | boolean>,
  name: string,
): string | undefined {
  const v = flags.get(name);
  return typeof v === "string" ? v : undefined;
}
