"use client";

import { useTerminalContext } from "./TerminalProvider";
import shared from "@/components/gui/shared.module.css";
import styles from "@/components/gui/RoleCard.module.css";

type ViewInTerminalButtonProps = {
  cmd: string;
};

export function ViewInTerminalButton({ cmd }: ViewInTerminalButtonProps) {
  const { open } = useTerminalContext();

  return (
    <button
      type="button"
      className={`${shared.btn} ${shared.btnGhost} ${styles.terminalLink}`}
      data-testid="view-in-terminal"
      data-cmd={cmd}
      aria-label={`View in terminal: ${cmd}`}
      onClick={() => open(cmd)}
    >
      $ {cmd}
    </button>
  );
}
