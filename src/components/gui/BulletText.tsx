import type { ReactNode } from "react";
import { getGlossaryTerm } from "@/content/glossary";
import { GlossaryTerm } from "./GlossaryTerm";

type BulletTextProps = {
  text: string;
  glossaryTerms?: string[];
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function BulletText({ text, glossaryTerms }: BulletTextProps) {
  if (!glossaryTerms?.length) return text;

  const parts: ReactNode[] = [];
  let remaining = text;
  let key = 0;

  for (const termId of glossaryTerms) {
    const entry = getGlossaryTerm(termId);
    if (!entry) continue;

    const regex = new RegExp(escapeRegExp(entry.term), "i");
    const match = remaining.match(regex);
    if (!match || match.index === undefined) continue;

    const before = remaining.slice(0, match.index);
    const matched = match[0];
    const after = remaining.slice(match.index + matched.length);

    if (before) parts.push(before);
    parts.push(<GlossaryTerm key={`${termId}-${key++}`} termId={termId} />);
    remaining = after;
  }

  if (parts.length === 0) return text;
  if (remaining) parts.push(remaining);
  return <>{parts}</>;
}
