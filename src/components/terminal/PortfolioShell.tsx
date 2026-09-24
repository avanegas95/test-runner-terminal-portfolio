"use client";

import { Suspense, type ReactNode } from "react";
import { TerminalProvider } from "./TerminalProvider";
import { TerminalDrawer } from "./TerminalDrawer";
import { TerminalLauncher } from "./TerminalLauncher";

export function PortfolioShell({ children }: { children: ReactNode }) {
  return (
    <TerminalProvider>
      <Suspense fallback={null}>
        <TerminalLauncher />
      </Suspense>
      {children}
      <TerminalDrawer />
    </TerminalProvider>
  );
}
