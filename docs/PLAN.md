# Plan: GUI-first portfolio with a pytest/Linux terminal drawer

## Context
The current site (`test-runner-terminal-portfolio`, Next.js 15 + React 19, one commit) *is* a Jest-style terminal: the homepage is an animated `npm test anderson` run and the test rows are the navigation. Feedback from a non-technical reviewer: it's too code-forward. Anderson wants:

1. **A normal, readable GUI portfolio shown first**, with the terminal as an opt-in experience you open on top of it.
2. **Linux + Python/pytest flavor** instead of Jest/npm (`.py` test files, `pytest` output, `conftest.py`, markers).
3. **A lightweight but real-feeling shell**: `cd`, `ls`, `cat`, `pwd`, `tree`, tab completion, history, a short `help` for experienced users and a verbose `tutorial`/`help -v` for everyone else.
4. **Content from resume V5.0** (Boston Dynamics Staff/Senior SQA, SharkNinja, two projects, skills, BU).
5. **Tests for the site itself** using pytest + Playwright (Anderson's stack) plus unit tests for the terminal engine.

Decisions already made: the terminal is a **resizable bottom drawer** (VS Code style; full-screen sheet on mobile). The animated test run becomes the **`pytest` command**, and the GUI shows a clickable teaser for it. The GUI uses **sans-serif body text with mono accents**. The site is tested with **pytest + Playwright (e2e) and Vitest (engine)**.

---

## Architecture overview

```
src/
  content/            ← single source of truth (GUI and terminal both read it)
    resume.ts         profile, experience[], projects[], skills, education, contact
    tests.ts          REWRITE: pytest suites/tests (ids link to resume entries)
    glossary.ts       HIL, Gazebo, Appium, CI/CD, fixture, smoke/sanity/regression
    known-issues.ts   keep as is
    types.ts          extend
  terminal/           ← PURE TypeScript, no React; fully unit-testable
    types.ts          OutputLine, Segment, Effect, Command, CommandContext
    fs.ts             virtual filesystem built from content; resolvePath, list, read
    files/            content → file text renderers (markdown.ts, python.ts, ini.ts…)
    parser.ts         tokenize (quotes, escapes), flag parsing
    commands/         one file per command + index.ts registry
    pytest.ts         collect / filter (-k -m path --lf) / render pytest-format output
    complete.ts       tab completion (commands + paths)
    suggest.ts        "did you mean" (Levenshtein ≤ 2)
    highlight.ts      tiny regex highlighter for .py / .md / .ini / .txt
    __tests__/        Vitest
  components/
    gui/              SiteHeader, Hero, PytestTeaser, Experience, RoleCard, Projects,
                      Skills, About (Known Issues), Education, Contact, Footer, GlossaryTerm
    terminal/         TerminalProvider, useTerminal, TerminalDrawer, TerminalOutput,
                      TerminalInput, QuickCommands, TerminalLauncher
    Button.tsx, Cursor.tsx   (keep and reuse)
  hooks/useReducedMotion.ts  (keep), useAnimationSkip.ts (reuse for pytest animation)
  styles/tokens.css   (copied from portfolio-handoff/tokens.css + new sans/GUI tokens)
e2e/                  pytest + Playwright suite (Python)
.github/workflows/ci.yml
```

**Core rule:** commands are pure functions `run(argv, ctx) → { lines: OutputLine[], effects?: Effect[] }`. Side effects (`cd`, `clear`, `close`, `scrollTo(sectionId)`, `openUrl`, `download`) are returned as data and applied by `useTerminal`. That keeps the engine testable without a DOM.

`Segment` can carry an `action` (`{run: "cat README.md"}`, `{href}`, `{scroll: "experience"}`), so filenames in `ls` output and examples in `tutorial` can be clicked. This matters for mouse and touch users who never type.

### Contracts (lets workstreams run in parallel)
- **Section ids** on the GUI: `hero`, `experience`, `projects`, `skills`, `about`, `education`, `contact`.
- **data-testids**: `terminal-toggle`, `terminal-drawer`, `terminal-close`, `terminal-resize-handle`, `terminal-input`, `terminal-output`, `terminal-line`, `quick-command`, `pytest-teaser`, `view-in-terminal`, `section-<id>`.
- **TerminalProvider API** (React context): `isOpen`, `open(cmd?: string)`, `close()`, `toggle()`, `run(cmd: string)`.
- **Styling**: use CSS Modules co-located with components (`*.module.css`), so parallel agents don't collide in the 918-line `globals.css`. `globals.css` keeps only the reset, base and tokens import.

---

## Content (from resume V5.0)

`src/content/resume.ts` holds everything below. **Never publish the street address or phone number.** The public contact info is email, LinkedIn and GitHub (github.com/avanegas95, already on the current contact page).

- **Profile:** Anderson Vanegas · Framingham / Boston, MA · Staff SQA Engineer at Boston Dynamics. Summary: QA → automation (pytest, Appium, CI/CD, HIL). Bilingual English/Spanish.
- **Boston Dynamics, Staff SQA Engineer (Mar 2026 – present):** reorganized a 700+ case library into Smoke/Sanity/Regression tiers (targets a 3-month → 1-month regression cycle); grew Appium UI automation from 16 → 33 tests; owns nightly HIL triage, root-cause summaries and hotfixes; Confluence best-practice docs and TestRail onboarding; code reviews.
- **Boston Dynamics, Senior SQA Engineer (Sep 2023 – Mar 2026):** Python robot-metrics monitor over SSH (standalone or as a **pytest fixture**, live plots, CSV export); Appium on emulated Android tablets, including parametrized language tests merged into nightly HIL; CI/CD integration with stage-based reporting and failure notifications; Gazebo sim worlds; training plan for non-SQA staff; QA point of contact and lead for a product refresh, with weekly leadership reporting.
- **SharkNinja:** SQA Engineer II (Apr 2022 – ?), SQA Engineer (Nov 2019 – ?), Product Development Intern (Apr – Nov 2019). Bullets as in the resume.
- **Projects:** *State of Ecosystems 2026* (React + Vite 6 report for HubSpot; Figma MCP; 17 hash-driven filter variants; JSON content layer; WCAG 2.1 AA; ~50 KB JS budget; handed off to HubSpot) · *Finance Forecast* (full-stack SaaS for Datalily; React 18 / Vite / Tailwind on Vercel, FastAPI + Pydantic on Render, Supabase; PandaDoc sync, AI chat; automated PR checks with Gemini Code Assist + CodeRabbit and a deploy-status gate).
- **Skills (grouped):** Testing & Automation (pytest, Appium, Selenium, X-Ray, TestRail) · Languages (Python, TypeScript, C, C++, C#, ASP.NET, HTML, CSS) · Dev tools (Git, VS Code, Cursor, Android emulation) · AI-assisted dev (Claude Code, Copilot, Gemini Code Assist, CodeRabbit, MCP) · OS (Ubuntu, macOS, Windows, Android/iOS) · Programs (Jira, Confluence) · Spoken (English, Spanish).
- **Education:** Boston University, BS Computer Engineering, 2017.
- **Known Issues:** keep `known-issues.ts` as is.

**Confirm with Anderson before launch** (agents: use the defaults and leave a `// TODO(confirm)` comment):
- SharkNinja end dates. The resume says "Present" for both roles. Default: SQA Engineer Nov 2019 – Apr 2022; SQA II Apr 2022 – Sep 2023.
- The years-of-experience headline. Default: "6+ years" (Nov 2019 → now is about 7).
- Jenkins, Buildkite, Zephyr and Linux/Bash are on the current site but not on the resume. Default: drop Jenkins, Buildkite and Zephyr, and keep Linux under OS.
- Project URLs (live or repo). Default: no links.
- Resume PDF: Anderson exports it to `public/Anderson_Vanegas_Resume.pdf`.

---

## Virtual filesystem (`src/terminal/fs.ts`)
Built at runtime from content. Prompt: `anderson@portfolio:~/experience$`. `/` → `home/` → `anderson/` (`~`). `cd /`, `cd ..`, `cd -`, `cd ~`, absolute and relative paths all work.

```
~/
├── README.md              welcome, what's here, "try: ls, cat, pytest, tutorial"
├── about.md               summary, location, languages
├── contact.txt            email / LinkedIn / GitHub (clickable)
├── KNOWN_ISSUES.md        hobbies table (rendered like the current table)
├── resume.pdf             `cat` → "binary file — try `open resume.pdf`"
├── requirements.txt       skills as pinned packages: pytest==8.3, appium-python-client, selenium…
├── pytest.ini             markers: smoke, sanity, regression, hil  (nod to the tiering work)
├── .bashrc                hidden; `ls -a`; aliases (ll, la) + a joke comment
├── experience/
│   ├── boston_dynamics/   staff_sqa_engineer.md, senior_sqa_engineer.md
│   └── sharkninja/        sqa_engineer_ii.md, sqa_engineer.md, product_dev_intern.md
├── projects/              state_of_ecosystems.md, finance_forecast.md
├── education/             boston_university.md
├── reports/               anderson_report.html  (→ opens /report)
└── tests/
    ├── conftest.py        fixtures: anderson, robot (scope="session", marker hil), flaky_test
    ├── test_career.py
    ├── test_automation.py
    ├── test_tooling.py
    └── test_personality.py   the flaky-test joke
```

Test files are **real-looking, readable pytest**: markers, fixtures, docstrings as plain-English summaries, `@pytest.mark.parametrize` for languages or tablets. For example:
```python
@pytest.mark.regression
def test_reorganized_700_case_library_into_tiers(anderson):
    """Smoke / Sanity / Regression tiers; targets a 3-month → 1-month cycle."""
    assert anderson.at("boston_dynamics").regression_cycle_months <= 1
```
Rewrite `src/content/tests.ts` into about 15 pytest tests across these 4 files. Each test has an `id`, `marker`, `durationMs`, `status` and `resumeRef`, so it links back to a GUI card and a file.

---

## Commands (`src/terminal/commands/`)
Each `Command` has `name`, `aliases`, `summary` (one line), `usage`, `details` (plain-English paragraph), `examples[]` and `run`. `help`, `man` and `tutorial` are all generated from this metadata, so docs can't drift.

| Group | Commands |
|---|---|
| Navigate | `ls [-a] [-l] [path]` (dirs get a trailing `/`, colored, clickable), `cd [path]`, `pwd`, `tree [path]` |
| Read | `cat <file…>` (syntax-highlighted), `open <file\|section\|url>` (scrolls the GUI behind the drawer, opens the PDF or mailto) |
| Run | `pytest [path] [-v] [-q] [-k expr] [-m marker] [--lf] [-x]` |
| Info | `whoami`, `help [cmd]`, `help -v`, `tutorial`, `man <cmd>`, `history`, `echo` |
| Session | `clear` (also Ctrl+L), `exit` (closes the drawer) |
| Easter eggs (small) | `sudo …` → "anderson is not in the sudoers file. This incident will be reported (to QA)." · `rm -rf` → read-only filesystem · `vim` → "…how do I exit?" · `python` → prints a Zen-of-QA line |

**Input behavior:** ↑/↓ history (persisted in sessionStorage) · Tab completes a command or path (longest common prefix; a second Tab lists options) · Ctrl+C cancels the line or skips the pytest animation · Ctrl+L clears · unknown command → `bash: foo: command not found` plus a did-you-mean and a hint to type `help`.

**Guidance layers:**
- **On open (motd):** 3 lines: welcome · "New to terminals? Type `tutorial` (or click it)" · "Know your way around? `help`, `ls`, `pytest`".
- **`help`:** compact, grouped table for experienced users (like the table above).
- **`help -v` / `tutorial`:** written for non-technical visitors. Explain what a terminal is and that a directory is a folder. Walk through each command in plain English with a clickable "▸ try it" example in the order `ls` → `cat README.md` → `cd experience` → `ls` → `cd ..` → `pytest` → `cat KNOWN_ISSUES.md` → `exit`. End with "you can close this anytime; everything is also on the page above."
- **`help <cmd>` / `man <cmd>`:** usage, details and examples for one command.
- **Quick-command chips** (`QuickCommands.tsx`): shown on mobile always and on desktop until the first typed command: `tutorial`, `ls`, `cat README.md`, `pytest`, `help`, `exit`.

## `pytest` command (`src/terminal/pytest.ts`)
**Requirement: the results must be readable by a non-technical person, not just authentic.** So:
- **Default `pytest` is the verbose, human-friendly view.** One colored line per test (green `PASSED`, coral `FAILED`, amber marker tags like `[regression]`), each followed by an indented, dim, plain-English line taken from the test's docstring. For example:
  ```
  tests/test_career.py::test_staff_sqa_engineer_boston_dynamics PASSED   [regression]  [  6%]
      ↳ Leads QA for Boston Dynamics robot software, Mar 2026 – present.
  ```
  Section banners (`== test_career.py — Career ==`) group the output. Color is never the only signal: the PASSED/FAILED words and glyphs always appear.
- **`pytest -q`** gives the classic compact dots view (below) for people who know pytest.
- **Every run ends with a plain-English recap**, e.g. "14 of 15 checks passed. The one failure is on purpose: see KNOWN_ISSUES.md." Then a clickable line: `📄 Report generated: reports/anderson_report.html  ▸ open`.

### Report artifact = the resume (`/report`)
- Running `pytest --html` (or plain `pytest`, via the closing link) opens **`/report`**, a Next.js page styled like a **pytest-html report** that *is* the resume. The page is built from `resume.ts` + `tests.ts`, so it shares a source with everything else.
  - **Header "Environment" table:** name, title, location, email, LinkedIn, GitHub, education.
  - **Summary bar:** 14 passed · 1 failed · 0 skipped · 2.51s, with pass/fail filter toggles like the real pytest-html.
  - **Results table:** one row per test (Result · Test · Marker · Duration). Rows expand to show the role, dates and full resume bullets. The FAILED row expands to the Known Issues section.
  - **Print stylesheet (`@media print`):** light theme, rows auto-expanded, no chrome. Print → PDF produces a clean one- to two-page resume, and the page has a "Download as PDF" button that calls `window.print()`.
- The report is also reachable from the GUI (the Resume dropdown offers "Resume (PDF)" and "Test report view") and in the terminal filesystem as `~/reports/anderson_report.html` (`open` it; `cat` prints "HTML report — try `open reports/anderson_report.html`").
- Owner: workstream **C** (the page) plus **B** (the `--html` flag and closing link). **F** adds `e2e/tests/test_report.py` (renders, filters, expands, print media emulation shows every section) [sanity].

Classic `-q` format, revealed line by line (reuse the `useAnimationSkip` and `useReducedMotion` pattern; reduced motion → instant):
```
============================= test session starts ==============================
platform linux -- Python 3.12.4, pytest-8.3.2, pluggy-1.5.0
rootdir: /home/anderson
configfile: pytest.ini
collected 15 items

tests/test_career.py .....                                               [ 33%]
tests/test_automation.py .....                                           [ 66%]
tests/test_tooling.py ....                                               [ 93%]
tests/test_personality.py F                                              [100%]

=================================== FAILURES ===================================
__________________________ test_can_ignore_flaky_test __________________________
    def test_can_ignore_flaky_test(anderson, flaky_test):
>       assert anderson.ignore(flaky_test) is True
E       AssertionError: assert 'rerun it, reproduce it, find the root cause, file the ticket' is True
tests/test_personality.py:9: AssertionError
=========================== short test summary info ============================
FAILED tests/test_personality.py::test_can_ignore_flaky_test - AssertionError
========================= 1 failed, 14 passed in 2.51s =========================
# Status: won't fix. Working as intended.  →  cat KNOWN_ISSUES.md
```
- In the default and `-v` views, each test name is clickable and runs `cat` on the matching resume file.
- `-k` and `-m` filter; a path limits collection; `--lf` runs only the flaky test; `-x` stops on the first failure. Zero matches → `collected 15 items / 15 deselected`.
- Status keeps a glyph/word as well as color (PASSED/FAILED, `.`/`F`), per the existing accessibility rule.

---

## GUI (`src/components/gui/`, `src/app/page.tsx`)
A single page with anchored sections, keeping the dark amber aesthetic. Add a sans font (Inter via `next/font`, `--font-sans` token) for body text; JetBrains Mono stays for headings, labels, dates and code-ish accents.

- **SiteHeader** (sticky): name mark · anchor nav (Experience, Projects, Skills, About, Contact) · **Resume** (primary, opens the PDF) · **`>_ Terminal`** button with a `Ctrl + \`` hint. On mobile it becomes a compact bar with a menu plus the terminal button.
- **Hero:** location, name, title @ Boston Dynamics, 2-line summary, CTAs (Resume, Contact), and the **PytestTeaser**: `$ pytest → 14 passed, 1 failed in 2.51s  ▸ run it`. Clicking it opens the drawer and runs `pytest`. Under it: "Prefer the command line? Open the terminal."
- **Experience:** a timeline grouped by company. Each RoleCard has the role, dates, a plain-English one-liner, bullets, and `GlossaryTerm` (an accessible `<abbr>`/popover) for jargon like HIL, Gazebo and fixture. Each card also has a subtle `view-in-terminal` link (`$ cat experience/boston_dynamics/staff_sqa_engineer.md`) that opens the drawer and runs that command. This is how GUI users discover the terminal.
- **Projects** (2 cards with stack chips) · **Skills** (grouped chips) · **About** (Known Issues table, reusing the styling from `KnownIssuesBlock.tsx`, plus the flaky-test joke) · **Education** · **Contact** (email, LinkedIn, GitHub) · **Footer** ("Tested with pytest + Playwright", with a CI badge if the repo is public).
- Keep the accessibility bar from `portfolio-handoff/DESIGN_SPEC.md` §5: contrast ≥ 4.5:1, 44px targets, visible focus, landmarks.

## Terminal UI (`src/components/terminal/`)
- **TerminalProvider** wraps the page in `layout.tsx` or `page.tsx`. It owns the drawer state and the `useTerminal` reducer (lines, cwd, prevCwd, history, running animation).
- **TerminalDrawer:** fixed to the bottom, default 45vh, drag handle to resize (min 200px, max 90vh; height persisted in sessionStorage), and a maximize button. The title bar reads `bash — ~/experience` (reuse the dots/titlebar look from the current `TerminalWindow.tsx`). Opening adds bottom padding to the page so content isn't hidden. Mobile (< 640px): a 100dvh sheet that uses `visualViewport` to stay above the keyboard.
- **Opening it:** header button, hero teaser, `view-in-terminal` links, `Ctrl+\`` toggle, and deep links `/?terminal` or `/?cmd=pytest`.
- **Closing it:** ✕ button, `exit`, `Ctrl+\``, or Esc when the input is empty and nothing is animating.
- **Accessibility:** non-modal `<section aria-label="Terminal">` (no focus trap). Focus moves to the input on open and returns to the opener on close. The output is `role="log"`. During a pytest animation, only the final summary is announced. The input has `aria-label`, `autocapitalize="off"`, `autocorrect="off"`, `spellcheck={false}` and `enterKeyHint="send"`. Clicking in the output focuses the input.
- **Bridge:** the `scrollTo` effect smooth-scrolls the GUI section (instantly under reduced motion) and briefly highlights it.

## Routing and cleanup
- `next.config.ts` redirects: `/projects` → `/#projects`, `/contact` → `/#contact`, `/known-issues` → `/#about`, `/resume` → `/Anderson_Vanegas_Resume.pdf`. Map the old test-id hashes (`#boston-dynamics`, `#sharkninja`…) client-side to the new section anchors.
- Delete the retired Jest-view pieces: `PortfolioPage`, `TestRun`, `TestRow`, `SuiteHeader`, `SummaryBlock`, `DetailPanel`, `FailurePanel`, `MobileHero`, `IdentityAside`, `IdentityNav`, `TerminalWindow`, and the `src/app/{projects,resume,contact,known-issues}` pages. Strip the unused rules from `globals.css`.
- Update `layout.tsx` metadata (title/description say pytest, not Jest; add OpenGraph) and update `README.md`.
- Add `docs/PLAN.md` (a copy of this plan) and a short `CLAUDE.md` with the contracts above, so each agent has shared context.

---

## Workstreams for agent handoff

| # | Workstream | Owns (files) | Depends on |
|---|---|---|---|
| **A** | Content layer | `src/content/**`, `public/` PDF placeholder, `CLAUDE.md`, `docs/PLAN.md` | — |
| **B** | Terminal engine + Vitest | `src/terminal/**`, `vitest.config.ts`, package.json devDeps | A |
| **C** | GUI page + fonts/tokens | `src/components/gui/**`, `src/styles/**`, `src/app/page.tsx`, `layout.tsx` fonts | A |
| **D** | Terminal UI + bridge | `src/components/terminal/**`, wiring in `page.tsx`/`layout.tsx` | B, C (header slot) |
| **E** | Routing, cleanup, SEO, README | `next.config.ts`, deletions, `globals.css`, `README.md` | C, D |
| **F** | pytest + Playwright e2e + CI | `e2e/**`, `.github/workflows/ci.yml` | contracts only (scaffold early); finish after D |

Run A first. Then run B and C in parallel. Start F's scaffolding (page objects built on the testid contract) in parallel with them. Then run D, and finally E and the finish of F.

**Acceptance criteria per workstream**
- **A:** `resume.ts` covers every resume section; phone and address are absent; `tests.ts` has about 15 pytest tests, each with a `resumeRef`; `tsc` passes.
- **B:** every command in the table works; `help`, `man` and `tutorial` are generated from command metadata; path resolution handles `~ . .. - /` and trailing slashes; `pytest` output matches the sample format; Vitest coverage ≥ 90% for `src/terminal`.
- **C:** all sections render from content; it's fully usable with the terminal never opened; the layout works at 390, 768 and 1440; Lighthouse accessibility ≥ 95.
- **D:** every open/close path works; history, tab completion, clickable segments and chips work; the drawer resizes and persists its height; `open <section>` scrolls the GUI; the mobile sheet stays usable with the keyboard up.
- **E:** old URLs redirect; there's no dead code (`next lint` is clean); `next build` succeeds.
- **F:** `pytest e2e` passes locally against `next start` and runs in CI.

---

## Site test suite (workstream F): pytest + Playwright
```
e2e/
  pyproject.toml / requirements-dev.txt   pytest, pytest-playwright, pytest-html, axe-playwright-python
  pytest.ini          markers: smoke, sanity, regression, mobile, a11y; base_url
  conftest.py         base_url fixture, `terminal` and `home` page-object fixtures,
                      parametrized viewport fixture (desktop 1440, tablet 768, mobile 390),
                      reduced-motion context fixture (instant pytest output)
  pages/              home_page.py, terminal.py  (Page Object Model on the testid contract)
  tests/
    test_gui_smoke.py         sections render, nav anchors, resume link, mailto   [smoke]
    test_terminal_open_close.py  button, Ctrl+`, exit, Esc, focus return         [smoke]
    test_terminal_commands.py @parametrize over ls/cd/pwd/cat/tree/unknown/help   [regression]
    test_terminal_input.py    history ↑↓, tab completion, Ctrl+C, Ctrl+L          [regression]
    test_pytest_command.py    summary line, -v, -k, -m, --lf, reduced motion      [regression]
    test_bridge.py            `open experience` scrolls; view-in-terminal runs cat [sanity]
    test_mobile.py            sheet, chips, keyboard-safe input                    [mobile]
    test_a11y.py              axe scan with drawer open and closed                 [a11y]
    test_redirects.py         legacy routes and hashes                              [sanity]
```
The smoke/sanity/regression markers deliberately mirror the tiering work on the resume.

**CI (`.github/workflows/ci.yml`):** job 1 runs `npm ci` → lint → `tsc --noEmit` → `vitest run` → `next build`. Job 2 builds, starts `next start`, runs `pip install -r e2e/requirements-dev.txt`, `playwright install --with-deps chromium`, then `pytest e2e -m "smoke or sanity or regression"`, and uploads the pytest-html report and Playwright traces on failure. A scheduled nightly job runs the full suite on chromium, firefox and webkit, a nod to nightly HIL runs.

Optional stretch (not required): a single Selenium smoke test (`e2e/tests/selenium/test_smoke_selenium.py`, marker `selenium`) to show both frameworks.

---

## Verification (end to end)
1. Run `npm run lint && npx tsc --noEmit && npx vitest run && npm run build`. All must pass.
2. Start the dev preview (`.claude/launch.json` → `dev`, port 3000) and check:
   - The page loads GUI-first with every resume section; there's no phone or address anywhere (grep the build output for `857` and `Salmi`).
   - Click `>_ Terminal` → the drawer opens and the input has focus → run `tutorial`, `ls`, `cd experience/boston_dynamics`, `cat staff_sqa_engineer.md`, `cd -`, `tree`, `pytest` (colored output, plain-English lines, recap, report link), `pytest -q`, `pytest -k appium`, `pytest --lf`, then open the report → `/report` filters and expands, and print preview looks like a clean resume, `cat KNOWN_ISSUES.md`, `open projects` (the page scrolls), `foo` (did-you-mean), Tab completion, ↑ history, `exit` (focus returns to the button).
   - The hero teaser and a `view-in-terminal` link each open the drawer and run their command.
   - Resize to 390 wide: the full-screen sheet and chips work. Emulate reduced motion: pytest output is instant and the cursor is static.
   - `/projects`, `/known-issues`, `/#boston-dynamics` and `/resume` redirect correctly.
3. Run `cd e2e && pytest -m "smoke or sanity or regression"` against `npm run build && npm start`. Everything must be green.
