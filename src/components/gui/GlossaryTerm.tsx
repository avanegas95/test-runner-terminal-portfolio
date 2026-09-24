"use client";

import { useId, useState } from "react";
import { getGlossaryTerm } from "@/content/glossary";
import styles from "./GlossaryTerm.module.css";

type GlossaryTermProps = {
  termId: string;
};

export function GlossaryTerm({ termId }: GlossaryTermProps) {
  const entry = getGlossaryTerm(termId);
  const popoverId = useId();
  const [open, setOpen] = useState(false);

  if (!entry) return null;

  return (
    <span className={styles.wrap}>
      <abbr
        title={entry.shortDefinition}
        className={styles.term}
        aria-describedby={open ? popoverId : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        tabIndex={0}
      >
        {entry.term}
      </abbr>
      {open && (
        <span id={popoverId} role="tooltip" className={styles.popover}>
          {entry.longDefinition ?? entry.shortDefinition}
        </span>
      )}
    </span>
  );
}
