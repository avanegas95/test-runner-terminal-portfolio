/** ANSI-style color tokens mapped to CSS in the React layer */
export type SegmentStyle =
  | "default"
  | "dim"
  | "bold"
  | "dir"
  | "file"
  | "success"
  | "error"
  | "warning"
  | "accent"
  | "comment"
  | "keyword"
  | "string"
  | "number"
  | "marker";

export type SegmentAction =
  | { run: string }
  | { href: string }
  | { scroll: string };

export type Segment = {
  text: string;
  style?: SegmentStyle;
  action?: SegmentAction;
};

export type OutputLine = {
  segments: Segment[];
};

export type Effect =
  | { type: "cd"; path: string }
  | { type: "clear" }
  | { type: "close" }
  | { type: "scrollTo"; sectionId: string }
  | { type: "openUrl"; url: string }
  | { type: "download"; path: string }
  | { type: "runAnimation"; lines: OutputLine[]; delayMs?: number };

export type CommandContext = {
  cwd: string;
  prevCwd: string | null;
  home: string;
  history: string[];
  username: string;
  hostname: string;
  /** Tracks last-failed test id for --lf */
  lastFailedTestId: string;
};

export type CommandResult = {
  lines: OutputLine[];
  effects?: Effect[];
};

export type CommandGroup =
  | "Navigate"
  | "Read"
  | "Run"
  | "Info"
  | "Session";

export type CommandMeta = {
  name: string;
  aliases?: string[];
  summary: string;
  usage: string;
  details: string;
  examples: string[];
  group: CommandGroup;
};

export type Command = CommandMeta & {
  run: (argv: string[], ctx: CommandContext) => CommandResult;
};

export type ParsedArgs = {
  positional: string[];
  flags: Map<string, string | boolean>;
};

/** Helpers for building output lines */
export function line(...segments: Segment[]): OutputLine {
  return { segments };
}

export function text(
  t: string,
  style?: SegmentStyle,
  action?: SegmentAction,
): Segment {
  return action ? { text: t, style, action } : style ? { text: t, style } : { text: t };
}

export function plain(t: string, style?: SegmentStyle): OutputLine {
  return line({ text: t, style });
}
