"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTerminal, type TerminalApi } from "./useTerminal";

export type TerminalContextValue = TerminalApi & {
  isOpen: boolean;
  open: (cmd?: string) => void;
  close: () => void;
  toggle: () => void;
};

const TerminalContext = createContext<TerminalContextValue | null>(null);

export function TerminalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const openerRef = useRef<HTMLElement | null>(null);
  const pendingCmdRef = useRef<string | null>(null);
  const terminal = useTerminal({ onClose: () => setIsOpen(false) });
  const runRef = useRef(terminal.run);
  const showMotdRef = useRef(terminal.showMotdOnOpen);
  runRef.current = terminal.run;
  showMotdRef.current = terminal.showMotdOnOpen;

  const open = useCallback(
    (cmd?: string) => {
      if (isOpen) {
        if (cmd) {
          runRef.current(cmd);
        }
        return;
      }
      openerRef.current = document.activeElement as HTMLElement | null;
      if (cmd) {
        pendingCmdRef.current = cmd;
      }
      setIsOpen(true);
    },
    [isOpen],
  );

  const close = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => {
      openerRef.current?.focus?.();
      openerRef.current = null;
    });
  }, []);

  const toggle = useCallback(() => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  }, [close, isOpen, open]);

  useEffect(() => {
    if (!isOpen) return;
    showMotdRef.current();
    const cmd = pendingCmdRef.current;
    if (cmd) {
      pendingCmdRef.current = null;
      requestAnimationFrame(() => runRef.current(cmd));
    }
  }, [isOpen]);

  const value = useMemo<TerminalContextValue>(
    () => ({
      ...terminal,
      isOpen,
      open,
      close,
      toggle,
    }),
    [terminal, isOpen, open, close, toggle],
  );

  return (
    <TerminalContext.Provider value={value}>{children}</TerminalContext.Provider>
  );
}

export function useTerminalContext(): TerminalContextValue {
  const ctx = useContext(TerminalContext);
  if (!ctx) {
    throw new Error("useTerminalContext must be used within TerminalProvider");
  }
  return ctx;
}
