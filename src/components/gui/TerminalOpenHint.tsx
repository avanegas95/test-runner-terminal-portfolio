"use client";

import { useTerminalContext } from "@/components/terminal/TerminalProvider";
import styles from "./Hero.module.css";

export function TerminalOpenHint() {
  const { toggle } = useTerminalContext();

  return (
    <button
      type="button"
      className={styles.terminalHintBtn}
      onClick={toggle}
    >
      Open the terminal
    </button>
  );
}
