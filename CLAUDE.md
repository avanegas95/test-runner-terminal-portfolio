# CLAUDE.md — shared contracts for parallel workstreams

This file captures the cross-workstream contracts from `docs/PLAN.md`. Every agent should read this before touching GUI, terminal, or e2e code.

## Content layer (`src/content/`)

Single source of truth for both the GUI and the virtual terminal filesystem.

| File | Exports |
|---|---|
| `resume.ts` | `resume`, `allRoles`, `getRoleById`, `getProjectById` |
| `tests.ts` | `pytestSuites`, `allTests`, `getPytestTestById`, `getPytestSuiteForTest`, `getNextTestId`, `computeSummary`, `failureDetail` |
| `glossary.ts` | `glossary`, `glossaryEntries`, `getGlossaryTerm` |
| `known-issues.ts` | `knownIssues`, `knownIssuesMeta` (unchanged) |
| `types.ts` | All shared TypeScript types |

**Privacy:** never publish street address or phone number. Public contact = email, LinkedIn, GitHub only.

**TODO(confirm) items** (defaults in code, confirm with Anderson before launch):
- SharkNinja end dates
- Years-of-experience headline ("6+ years")
- Project URLs (default: none)
- Replace `public/Anderson_Vanegas_Resume.pdf` placeholder with real export

## GUI section ids

Anchored sections on the single-page portfolio:

| id | Content |
|---|---|
| `hero` | Name, title, summary, CTAs, pytest teaser |
| `experience` | Timeline grouped by company |
| `projects` | Project cards |
| `skills` | Grouped skill chips |
| `about` | Known Issues table + flaky-test joke |
| `education` | BU degree |
| `contact` | Email, LinkedIn, GitHub |

## data-testids

Stable selectors for Playwright page objects:

- `terminal-toggle` — header button to open drawer
- `terminal-drawer` — drawer container
- `terminal-close` — close button
- `terminal-resize-handle` — drag handle
- `terminal-input` — command input
- `terminal-output` — output log region
- `terminal-line` — individual output line
- `quick-command` — chip buttons (tutorial, ls, pytest, …)
- `pytest-teaser` — hero "$ pytest → …" link
- `view-in-terminal` — per-card terminal deep link
- `section-<id>` — one per GUI section (`section-hero`, `section-experience`, …)

## TerminalProvider API

React context wrapping the page (`layout.tsx` or `page.tsx`):

```typescript
type TerminalContext = {
  isOpen: boolean;
  open: (cmd?: string) => void;
  close: () => void;
  toggle: () => void;
  run: (cmd: string) => void;
};
```

Effects returned by pure command functions (`scrollTo`, `openUrl`, `download`, `clear`, `close`) are applied by `useTerminal`, not inside command handlers.

## Styling conventions

- **CSS Modules** co-located with components (`Component.module.css`).
- Do not add GUI/terminal styles to `globals.css` — it keeps only reset, base, and token imports.
- **Fonts:** Inter (`--font-sans`) for body; JetBrains Mono for headings, labels, dates, code accents.
- **Tokens:** `src/styles/tokens.css` (from portfolio-handoff + new sans/GUI tokens).
- **A11y:** contrast ≥ 4.5:1, 44px touch targets, visible focus, semantic landmarks.

## Virtual filesystem prompt

```
anderson@portfolio:~/experience$
```

Root layout under `~/` mirrors `resume.ts`, `tests.ts`, and `known-issues.ts`. See `docs/PLAN.md` § Virtual filesystem for the full tree.

## Pytest command output contract

- Default `pytest` = verbose, human-friendly (colored PASSED/FAILED + indented docstring).
- `pytest -q` = compact dots view.
- Every run ends with plain-English recap + link to `reports/anderson_report.html`.
- 15 tests: 14 passed, 1 failed (`test_can_ignore_flaky_test`), ~2.51s total.

## Site testing (workstream F)

pytest + Playwright e2e in `e2e/`. Markers mirror resume tiering: `smoke`, `sanity`, `regression`, plus `mobile`, `a11y`, `hil`.
