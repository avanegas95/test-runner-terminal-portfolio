import type { Segment, SegmentStyle } from "./types";
import { text } from "./types";

type Token = { start: number; end: number; style: SegmentStyle };

function tokenizeLine(line: string, ext: string): Segment[] {
  const tokens: Token[] = [];

  const addMatches = (pattern: RegExp, style: SegmentStyle) => {
    const re = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      if (end === start) {
        re.lastIndex++;
        continue;
      }
      tokens.push({ start, end, style });
    }
  };

  if (ext === "py") {
    addMatches(/#.*$/, "comment");
    addMatches(
      /\b(import|from|def|class|return|assert|pytest|True|False|None)\b/,
      "keyword",
    );
    addMatches(/@pytest\.mark\.\w+/, "marker");
    addMatches(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/, "string");
  } else if (ext === "md") {
    addMatches(/^#{1,6}\s.+$/, "bold");
    addMatches(/\*\*[^*]+\*\*/, "bold");
    addMatches(/^\|.+\|$/, "accent");
  } else if (ext === "ini") {
    addMatches(/^\[[^\]]+\]/, "keyword");
    addMatches(/#.*$/, "comment");
    addMatches(/^\s+\w+:/, "accent");
  } else if (ext === "txt") {
    addMatches(/^#.*$/, "comment");
    addMatches(/https?:\/\/[^\s]+/, "accent");
    addMatches(/[\w.+-]+@[\w.-]+\.\w+/, "accent");
  }

  tokens.sort((a, b) => a.start - b.start || b.end - a.end);

  const segments: Segment[] = [];
  let pos = 0;

  for (const tok of tokens) {
    if (tok.start < pos) continue;
    if (tok.start > pos) segments.push(text(line.slice(pos, tok.start)));
    segments.push(text(line.slice(tok.start, tok.end), tok.style));
    pos = tok.end;
  }

  if (pos < line.length) segments.push(text(line.slice(pos)));
  return segments.length > 0 ? segments : [text(line)];
}

export function highlightLine(line: string, ext: string): Segment[] {
  return tokenizeLine(line, ext);
}

export function highlightContent(
  content: string,
  filePath: string,
): Segment[][] {
  const ext = extensionFromPath(filePath);
  return content.split("\n").map((line) => highlightLine(line, ext));
}

export function extensionFromPath(path: string): string {
  const base = path.split("/").pop() ?? path;
  const dot = base.lastIndexOf(".");
  return dot === -1 ? "" : base.slice(dot + 1).toLowerCase();
}
