"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useTerminalContext } from "./TerminalProvider";

export function TerminalLauncher() {
  const { isOpen, open, toggle } = useTerminalContext();
  const searchParams = useSearchParams();
  const deepLinkHandled = useRef(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.key === "`") {
        e.preventDefault();
        toggle();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [toggle]);

  useEffect(() => {
    if (deepLinkHandled.current) return;
    const wantsTerminal = searchParams.has("terminal");
    const cmd = searchParams.get("cmd");
    if (wantsTerminal || cmd) {
      deepLinkHandled.current = true;
      open(cmd ?? undefined);
    }
  }, [searchParams, open]);

  useEffect(() => {
    document.body.classList.toggle("terminal-body-pad", isOpen);
    return () => document.body.classList.remove("terminal-body-pad");
  }, [isOpen]);

  return null;
}
