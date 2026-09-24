"use client";

import styles from "./TerminalInput.module.css";

type TerminalInputProps = {
  prompt: string;
  value: string;
  disabled?: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onTab: () => void;
  onCtrlC: () => void;
  onCtrlL: () => void;
  onHistoryUp: () => void;
  onHistoryDown: () => void;
  onEscape: () => void;
};

export function TerminalInput({
  prompt,
  value,
  disabled,
  inputRef,
  onChange,
  onSubmit,
  onTab,
  onCtrlC,
  onCtrlL,
  onHistoryUp,
  onHistoryDown,
  onEscape,
}: TerminalInputProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit();
      return;
    }
    if (e.key === "Tab") {
      e.preventDefault();
      onTab();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      onHistoryUp();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      onHistoryDown();
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      onEscape();
      return;
    }
    if (e.key === "c" && e.ctrlKey) {
      e.preventDefault();
      onCtrlC();
      return;
    }
    if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      onCtrlL();
    }
  }

  return (
    <div className={styles.inputRow}>
      <label className={styles.prompt} htmlFor="terminal-input">
        {prompt}
      </label>
      <input
        id="terminal-input"
        ref={inputRef}
        className={styles.input}
        data-testid="terminal-input"
        type="text"
        value={value}
        disabled={disabled}
        aria-label="Terminal command input"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="send"
        autoComplete="off"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
