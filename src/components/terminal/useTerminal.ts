"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useAnimationSkip } from "@/hooks/useAnimationSkip";
import {
  MOTD,
  applyEffects,
  createContext,
  formatPrompt,
  runCommand,
  type CommandContext,
} from "@/terminal";
import { displayPath } from "@/terminal/fs";
import { complete } from "@/terminal/complete";
import { line, text, type Effect, type OutputLine, type SegmentAction } from "@/terminal/types";

const HISTORY_KEY = "terminal-command-history";

type State = {
  ctx: CommandContext;
  output: OutputLine[];
  isAnimating: boolean;
  hasTyped: boolean;
  inputValue: string;
  historyIndex: number;
  motdShown: boolean;
};

type Action =
  | { type: "SET_INPUT"; value: string }
  | { type: "SET_OUTPUT"; output: OutputLine[] }
  | { type: "APPEND_OUTPUT"; lines: OutputLine[] }
  | { type: "SET_CTX"; ctx: CommandContext }
  | { type: "SET_ANIMATING"; value: boolean }
  | { type: "SET_HAS_TYPED" }
  | { type: "SET_HISTORY_INDEX"; index: number }
  | { type: "SHOW_MOTD" }
  | { type: "CLEAR_OUTPUT" }
  | { type: "EXECUTE_RESULT"; echoLine: OutputLine; resultLines: OutputLine[]; clear: boolean };

function loadHistory(): string[] {
  try {
    const raw = sessionStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function saveHistory(history: string[]) {
  try {
    sessionStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-100)));
  } catch {
    /* sessionStorage unavailable */
  }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, inputValue: action.value };
    case "SET_OUTPUT":
      return { ...state, output: action.output };
    case "APPEND_OUTPUT":
      return { ...state, output: [...state.output, ...action.lines] };
    case "SET_CTX":
      return { ...state, ctx: action.ctx };
    case "SET_ANIMATING":
      return { ...state, isAnimating: action.value };
    case "SET_HAS_TYPED":
      return { ...state, hasTyped: true };
    case "SET_HISTORY_INDEX":
      return { ...state, historyIndex: action.index };
    case "SHOW_MOTD":
      return state.motdShown
        ? state
        : { ...state, output: [...state.output, ...MOTD], motdShown: true };
    case "CLEAR_OUTPUT":
      return { ...state, output: [] };
    case "EXECUTE_RESULT":
      if (action.clear) {
        return { ...state, output: action.resultLines };
      }
      return {
        ...state,
        output: [...state.output, action.echoLine, ...action.resultLines],
      };
    default:
      return state;
  }
}

function scrollToSection(sectionId: string, instant: boolean) {
  const el =
    document.querySelector(`[data-testid="section-${sectionId}"]`) ??
    document.getElementById(sectionId);
  if (!el) return;
  el.scrollIntoView({ behavior: instant ? "auto" : "smooth", block: "start" });
  el.classList.add("terminalSectionHighlight");
  window.setTimeout(() => el.classList.remove("terminalSectionHighlight"), 1500);
}

function applyDomEffects(effects: Effect[] | undefined, instantScroll: boolean) {
  if (!effects) return;
  for (const effect of effects) {
    switch (effect.type) {
      case "scrollTo":
        scrollToSection(effect.sectionId, instantScroll);
        break;
      case "openUrl":
        if (effect.url.startsWith("mailto:")) {
          window.location.href = effect.url;
        } else {
          window.open(effect.url, "_blank", "noopener,noreferrer");
        }
        break;
      case "download":
        window.open(effect.path, "_blank", "noopener,noreferrer");
        break;
      default:
        break;
    }
  }
}

function extractRecap(lines: OutputLine[]): string {
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const joined = lines[i]!.segments.map((s) => s.text).join("");
    if (joined.includes("passed") || joined.includes("checks")) {
      return joined.trim();
    }
  }
  const last = lines[lines.length - 1];
  return last ? last.segments.map((s) => s.text).join("").trim() : "";
}

export type TerminalApi = {
  output: OutputLine[];
  cwd: string;
  prompt: string;
  titlePath: string;
  inputValue: string;
  isAnimating: boolean;
  hasTyped: boolean;
  setInputValue: (value: string) => void;
  run: (cmd: string) => void;
  submitInput: () => void;
  handleTab: () => void;
  handleCtrlC: () => void;
  handleCtrlL: () => void;
  handleHistoryUp: () => void;
  handleHistoryDown: () => void;
  handleSegmentAction: (action: SegmentAction) => void;
  showMotdOnOpen: () => void;
  focusInputRef: React.RefObject<HTMLInputElement | null>;
  liveAnnouncement: string;
};

type UseTerminalOptions = {
  onClose: () => void;
};

export function useTerminal({ onClose }: UseTerminalOptions): TerminalApi {
  const reducedMotion = useReducedMotion();
  const initialHistory = useRef<string[] | null>(null);
  if (initialHistory.current === null) {
    initialHistory.current = loadHistory();
  }

  const [state, dispatch] = useReducer(reducer, {
    ctx: createContext({ history: initialHistory.current ?? [] }),
    output: [],
    isAnimating: false,
    hasTyped: false,
    inputValue: "",
    historyIndex: -1,
    motdShown: false,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const [liveAnnouncement, setLiveAnnouncement] = useState("");
  const { skip: skipAnimation } = useAnimationSkip(reducedMotion, state.isAnimating);
  const animationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingAnimation = useRef<OutputLine[]>([]);
  const animationIndex = useRef(0);
  const lastTabInput = useRef("");
  const focusInputRef = useRef<HTMLInputElement | null>(null);

  const clearAnimationTimer = useCallback(() => {
    if (animationTimer.current) {
      clearTimeout(animationTimer.current);
      animationTimer.current = null;
    }
  }, []);

  const finishAnimation = useCallback(
    (remaining?: OutputLine[]) => {
      clearAnimationTimer();
      const lines = remaining ?? pendingAnimation.current.slice(animationIndex.current);
      if (lines.length) {
        dispatch({ type: "APPEND_OUTPUT", lines });
        setLiveAnnouncement(extractRecap(lines));
      }
      pendingAnimation.current = [];
      animationIndex.current = 0;
      dispatch({ type: "SET_ANIMATING", value: false });
    },
    [clearAnimationTimer],
  );

  const startAnimation = useCallback(
    (lines: OutputLine[], delayMs: number) => {
      pendingAnimation.current = lines;
      animationIndex.current = 0;
      dispatch({ type: "SET_ANIMATING", value: true });

      if (reducedMotion) {
        finishAnimation(lines);
        return;
      }

      const tick = () => {
        if (animationIndex.current >= pendingAnimation.current.length) {
          finishAnimation([]);
          return;
        }
        const nextLine = pendingAnimation.current[animationIndex.current]!;
        animationIndex.current += 1;
        dispatch({ type: "APPEND_OUTPUT", lines: [nextLine] });
        animationTimer.current = setTimeout(tick, delayMs);
      };

      tick();
    },
    [reducedMotion, finishAnimation],
  );

  useEffect(() => () => clearAnimationTimer(), [clearAnimationTimer]);

  const executeCommand = useCallback(
    (input: string) => {
      const current = stateRef.current;
      const trimmed = input.trim();
      if (!trimmed) return;

      dispatch({ type: "SET_HAS_TYPED" });

      const echoLine = line(text(formatPrompt(current.ctx) + trimmed));
      const { result } = runCommand(trimmed, current.ctx);
      const updatedCtx = applyEffects(current.ctx, result.effects);
      const effects = result.effects ?? [];

      applyDomEffects(effects, reducedMotion);

      if (effects.some((e) => e.type === "close")) {
        onClose();
      }

      const clearEffect = effects.some((e) => e.type === "clear");
      const animationEffect = effects.find((e) => e.type === "runAnimation");

      const history =
        trimmed &&
        (current.ctx.history.length === 0 ||
          current.ctx.history[current.ctx.history.length - 1] !== trimmed)
          ? [...current.ctx.history, trimmed]
          : current.ctx.history;

      saveHistory(history);
      dispatch({
        type: "SET_CTX",
        ctx: { ...updatedCtx, history },
      });
      dispatch({ type: "SET_HISTORY_INDEX", index: history.length });
      dispatch({ type: "SET_INPUT", value: "" });

      if (clearEffect) {
        dispatch({ type: "SET_OUTPUT", output: result.lines });
      } else if (animationEffect) {
        dispatch({ type: "APPEND_OUTPUT", lines: [echoLine] });
        startAnimation(animationEffect.lines, animationEffect.delayMs ?? 35);
      } else {
        dispatch({
          type: "EXECUTE_RESULT",
          echoLine,
          resultLines: result.lines,
          clear: false,
        });
      }
    },
    [reducedMotion, onClose, startAnimation],
  );

  const run = useCallback(
    (cmd: string) => {
      executeCommand(cmd);
    },
    [executeCommand],
  );

  const submitInput = useCallback(() => {
    if (stateRef.current.isAnimating) return;
    executeCommand(stateRef.current.inputValue);
  }, [executeCommand]);

  const handleTab = useCallback(() => {
    const current = stateRef.current;
    if (current.isAnimating) return;

    const { completion, options } = complete(current.inputValue, {
      cwd: current.ctx.cwd,
      home: current.ctx.home,
    });

    if (completion !== null) {
      const value = completion.trimEnd();
      dispatch({ type: "SET_INPUT", value });
      lastTabInput.current = value;
      return;
    }

    if (options.length > 0 && lastTabInput.current === current.inputValue) {
      const optionLine = line(...options.map((o, i) => text(i > 0 ? `  ${o}` : o, "dim")));
      dispatch({ type: "APPEND_OUTPUT", lines: [optionLine] });
    }

    lastTabInput.current = current.inputValue;
  }, []);

  const handleCtrlC = useCallback(() => {
    if (stateRef.current.isAnimating) {
      skipAnimation();
      finishAnimation(pendingAnimation.current.slice(animationIndex.current));
      return;
    }
    dispatch({ type: "SET_INPUT", value: "" });
  }, [skipAnimation, finishAnimation]);

  const handleCtrlL = useCallback(() => {
    if (stateRef.current.isAnimating) return;
    dispatch({ type: "CLEAR_OUTPUT" });
  }, []);

  const handleHistoryUp = useCallback(() => {
    const current = stateRef.current;
    const history = current.ctx.history;
    if (history.length === 0) return;
    const nextIndex =
      current.historyIndex <= 0 ? history.length - 1 : current.historyIndex - 1;
    dispatch({ type: "SET_HISTORY_INDEX", index: nextIndex });
    dispatch({ type: "SET_INPUT", value: history[nextIndex] ?? "" });
  }, []);

  const handleHistoryDown = useCallback(() => {
    const current = stateRef.current;
    const history = current.ctx.history;
    if (history.length === 0) return;
    if (current.historyIndex >= history.length - 1) {
      dispatch({ type: "SET_HISTORY_INDEX", index: history.length });
      dispatch({ type: "SET_INPUT", value: "" });
      return;
    }
    const nextIndex = current.historyIndex + 1;
    dispatch({ type: "SET_HISTORY_INDEX", index: nextIndex });
    dispatch({ type: "SET_INPUT", value: history[nextIndex] ?? "" });
  }, []);

  const handleSegmentAction = useCallback(
    (action: SegmentAction) => {
      if ("run" in action) {
        run(action.run);
      } else if ("href" in action) {
        window.open(action.href, "_blank", "noopener,noreferrer");
      } else if ("scroll" in action) {
        scrollToSection(action.scroll, reducedMotion);
      }
    },
    [run, reducedMotion],
  );

  const showMotdOnOpen = useCallback(() => {
    dispatch({ type: "SHOW_MOTD" });
  }, []);

  const titlePath = displayPath(state.ctx.cwd, state.ctx.home);

  return {
    output: state.output,
    cwd: state.ctx.cwd,
    prompt: formatPrompt(state.ctx),
    titlePath,
    inputValue: state.inputValue,
    isAnimating: state.isAnimating,
    hasTyped: state.hasTyped,
    setInputValue: (value: string) => dispatch({ type: "SET_INPUT", value }),
    run,
    submitInput,
    handleTab,
    handleCtrlC,
    handleCtrlL,
    handleHistoryUp,
    handleHistoryDown,
    handleSegmentAction,
    showMotdOnOpen,
    focusInputRef,
    liveAnnouncement,
  };
}
