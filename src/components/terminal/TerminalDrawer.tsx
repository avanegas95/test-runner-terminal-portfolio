"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTerminalContext } from "./TerminalProvider";
import { TerminalInput } from "./TerminalInput";
import { TerminalOutput } from "./TerminalOutput";
import { QuickCommands } from "./QuickCommands";
import styles from "./TerminalDrawer.module.css";

const HEIGHT_KEY = "terminal-drawer-height";
const DEFAULT_VH = 45;
const MIN_PX = 200;
const MAX_VH = 90;
const MOBILE_BREAKPOINT = 640;

function loadHeight(): number {
  try {
    const raw = sessionStorage.getItem(HEIGHT_KEY);
    if (raw) {
      const n = Number(raw);
      if (!Number.isNaN(n) && n >= MIN_PX) return n;
    }
  } catch {
    /* ignore */
  }
  return (window.innerHeight * DEFAULT_VH) / 100;
}

function saveHeight(px: number) {
  try {
    sessionStorage.setItem(HEIGHT_KEY, String(Math.round(px)));
  } catch {
    /* ignore */
  }
}

export function TerminalDrawer() {
  const {
    isOpen,
    close,
    output,
    prompt,
    titlePath,
    inputValue,
    isAnimating,
    hasTyped,
    setInputValue,
    submitInput,
    handleTab,
    handleCtrlC,
    handleCtrlL,
    handleHistoryUp,
    handleHistoryDown,
    handleSegmentAction,
    run,
    focusInputRef,
    liveAnnouncement,
  } = useTerminalContext();

  const [height, setHeight] = useState(MIN_PX);
  const [isMobile, setIsMobile] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const drawerRef = useRef<HTMLElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);

  useEffect(() => {
    if (!isOpen) return;
    const mobile = window.innerWidth < MOBILE_BREAKPOINT;
    setIsMobile(mobile);
    if (!mobile) {
      setHeight(loadHeight());
    }
  }, [isOpen]);

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isOpen || !isMobile) return;

    function updateKeyboard() {
      const vv = window.visualViewport;
      if (!vv) {
        setKeyboardOffset(0);
        return;
      }
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setKeyboardOffset(offset);
    }

    updateKeyboard();
    window.visualViewport?.addEventListener("resize", updateKeyboard);
    window.visualViewport?.addEventListener("scroll", updateKeyboard);
    return () => {
      window.visualViewport?.removeEventListener("resize", updateKeyboard);
      window.visualViewport?.removeEventListener("scroll", updateKeyboard);
    };
  }, [isOpen, isMobile]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => focusInputRef.current?.focus());
    }
  }, [isOpen, focusInputRef]);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, isAnimating]);

  const handleResizeStart = useCallback(
    (clientY: number) => {
      if (isMobile) return;
      dragging.current = true;
      dragStartY.current = clientY;
      dragStartHeight.current = height;
    },
    [height, isMobile],
  );

  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      if (!dragging.current) return;
      const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
      const delta = dragStartY.current - clientY;
      const maxPx = (window.innerHeight * MAX_VH) / 100;
      const next = Math.min(maxPx, Math.max(MIN_PX, dragStartHeight.current + delta));
      setHeight(next);
      setMaximized(false);
    }

    function onUp() {
      if (!dragging.current) return;
      dragging.current = false;
      saveHeight(height);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, [height]);

  function handleMaximize() {
    const maxPx = (window.innerHeight * MAX_VH) / 100;
    setMaximized(true);
    setHeight(maxPx);
    saveHeight(maxPx);
  }

  function handleEscape() {
    if (!inputValue && !isAnimating) {
      close();
    }
  }

  if (!isOpen) return null;

  const drawerHeight = isMobile
    ? `calc(100dvh - ${keyboardOffset}px)`
    : maximized
      ? `${(window.innerHeight * MAX_VH) / 100}px`
      : `${height}px`;

  return (
    <section
      ref={drawerRef}
      className={`${styles.drawer} ${isMobile ? styles.drawerMobile : ""}`}
      data-testid="terminal-drawer"
      aria-label="Terminal"
      style={{ height: drawerHeight }}
    >
      <div
        className={styles.resizeHandle}
        data-testid="terminal-resize-handle"
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize terminal"
        onMouseDown={(e) => handleResizeStart(e.clientY)}
        onTouchStart={(e) => handleResizeStart(e.touches[0]?.clientY ?? 0)}
      />

      <div className={styles.titlebar}>
        <div className={styles.titlebarLeft}>
          <span className={styles.dots} aria-hidden="true">
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </span>
          <span className={styles.title}>bash — {titlePath}</span>
        </div>
        <div className={styles.titlebarActions}>
          {!isMobile && (
            <button
              type="button"
              className={styles.titleBtn}
              aria-label="Maximize terminal"
              onClick={handleMaximize}
            >
              ▢
            </button>
          )}
          <button
            type="button"
            className={styles.titleBtn}
            data-testid="terminal-close"
            aria-label="Close terminal"
            onClick={close}
          >
            ✕
          </button>
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.outputWrap} ref={outputRef}>
          <TerminalOutput
            lines={output}
            isAnimating={isAnimating}
            onSegmentAction={handleSegmentAction}
            onFocusInput={() => focusInputRef.current?.focus()}
          />
        </div>

        <QuickCommands onRun={run} showOnDesktop={!hasTyped} />

        <TerminalInput
          prompt={prompt}
          value={inputValue}
          disabled={isAnimating}
          inputRef={focusInputRef}
          onChange={setInputValue}
          onSubmit={submitInput}
          onTab={handleTab}
          onCtrlC={handleCtrlC}
          onCtrlL={handleCtrlL}
          onHistoryUp={handleHistoryUp}
          onHistoryDown={handleHistoryDown}
          onEscape={handleEscape}
        />
      </div>

      {liveAnnouncement ? (
        <div className="sr-only" aria-live="polite">
          {liveAnnouncement}
        </div>
      ) : null}
    </section>
  );
}
