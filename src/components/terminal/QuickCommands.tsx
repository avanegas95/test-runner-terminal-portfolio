"use client";

import styles from "./QuickCommands.module.css";

const COMMANDS = [
  "tutorial",
  "ls",
  "cat README.md",
  "pytest",
  "help",
  "exit",
] as const;

type QuickCommandsProps = {
  onRun: (cmd: string) => void;
  showOnDesktop: boolean;
};

export function QuickCommands({ onRun, showOnDesktop }: QuickCommandsProps) {
  return (
    <div
      className={`${styles.chips} ${showOnDesktop ? styles.chipsDesktopVisible : ""}`}
      aria-label="Quick commands"
    >
      {COMMANDS.map((cmd) => (
        <button
          key={cmd}
          type="button"
          className={styles.chip}
          data-testid="quick-command"
          onClick={() => onRun(cmd)}
        >
          {cmd}
        </button>
      ))}
    </div>
  );
}
