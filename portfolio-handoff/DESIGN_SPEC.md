# Design spec: Test Runner Terminal

All values come from the mockups (`mockups-source/`). Token names refer to `tokens.css`.

## 1. Visual principles
- Dark theme, **one font** (JetBrains Mono, weights 400/500/700), **one accent** (amber `--accent`).
- A test runner that's tasteful, not a "hacker" cliché: generous line height (1.75), calm contrast, lots of space.
  No scanlines, glow, green-on-black or matrix effects.
- Green (`--pass`) and coral (`--fail`) are used only for test status. Status is **never shown by
  color alone**: it always has a glyph (✓ / ✗), a badge label (PASS / FAIL) and screen-reader text.

## 2. Layout

### Desktop (≥ 1024px; mocked at 1440)
- Page padding 72px top/bottom, 80px sides. Two columns with a 64px gap:
  - **Left identity column**, 360px fixed. Top-aligned in the mockup; making it `position: sticky; top: 72px` is recommended.
    Contents, stacked with 24px gaps:
    `// Boston, MA` (14px, `--dim`) → h1 name (40px/700, -0.02em tracking) → role line (17px; "Boston Dynamics" in accent)
    → summary (15px, `--muted`) → nav: three full-width buttons, 10px gap (Resume is primary)
    → hint text (13px, `--dim`, home only).
  - **Terminal window**, which fills the remaining width (~856px at 1440).
- Terminal window: `--surface`, 1px `--border`, radius 12, overflow hidden.
  - Title bar: 1px bottom border, padding 8/12/8/20. Left: three 10px decorative dots (`--dot`, gap 8) + `~/anderson — test run` (13px, `--muted`).
    Right: **Skip animation** button on home, **← All results** on expanded states.
  - Body: padding 32/40/40, 16px text, line height 1.75.

### Tablet (640–1023px)
- One column: the identity block goes on top (nav buttons in a 3-up row), with the terminal below at full width.

### Mobile (< 640px; mocked at 390)
- Hero padding 40px top, 20px sides; h1 30px; summary 14px.
- Nav: 3-column grid, 8px gap, buttons 48px tall, placed **directly under the hero**.
  On expanded / Known Issues screens the nav also appears **after the terminal**, and the header is compact
  (name on the left, "← All results" on the right).
- Terminal: 12px side margin, body padding 20/16/24, 13px text, line height 1.7. The title bar drops the dots.
- Test rows drop the trailing chevron; timings are 12px. Long names wrap under the text column, not under the ✓.

## 3. Components

### Prompt line
`$` in `--accent`, followed by the command in `--text`. Commands per state:
- home: `$ npm test anderson`, then `> jest --verbose` in `--dim`
- expanded: `$ npm test anderson -t "Boston Dynamics"`
- known issues: `$ npm test anderson --onlyFailures`, later `$ cat KNOWN_ISSUES.md`
- final line: `$` + cursor

### Cursor
An inline block 0.55em × 1.1em in `--accent`, 6px left margin. **Subtle blink:** opacity eases from 0.9 to 0.25
over a 1.4s ease-in-out loop (not a hard on/off). Reduced motion: static at 0.9 opacity.

### Suite header
Badge + file name, 12px gap, 20px top margin.
Badge: 13px/700, padding 0 8px, radius 4. PASS = `--pass` background / `--on-pass` text; FAIL = `--fail` / `--on-fail`.

### Test row (the core component)
- A real `<button>` (it expands inline) or an `<a>` when it goes to a route.
- Grid: `1.5em | 1fr | auto | 1em` → glyph · name · timing · chevron `›`, with a 12px column gap and baseline alignment.
- Padding 4px 10px with a -10px side margin, so the hover background bleeds past the text. Radius 6.
- Rows are indented 28px under their suite header, with a 6px top gap.
- Glyph: ✓ `--pass` or ✗ `--fail` (both `aria-hidden`), plus visually hidden text "Passed: " / "Failed: " before the name.
- Timing: 14px, `--dim`. The failing row shows "see Known Issues" (desktop) or "open ›" (mobile) in `--muted`, and its name is `--fail-text`.
- **States:**
  - hover: background `--row-hover`, text `#FFF`, chevron turns `--accent`
  - focus-visible: 2px `--accent` outline, 2px offset
  - expanded: background `--row-hover` (fail: `--fail-row`), chevron replaced by `▾` in accent (fail: `--fail`), `aria-expanded="true"`
  - active on mobile = hover
- Minimum height on mobile is 44px (padding 10px 8px).

### Detail panel (expanded passing test)
- Sits directly under its row, indented 34px (desktop) or full width (mobile). Background `--surface-2`, 1px `--border-panel`, radius 10,
  padding 28/32 (mobile 20/16), sections separated by 24px gaps.
- Sections, in order:
  1. `<dl>` metadata: 96px label column (`--dim`), for role / company / period
  2. **Plain-English paragraph** in `--text-2`, starting with a `// In plain English:` prefix in `--dim`. *Every panel must have one;
     it's what makes the site readable for non-engineers.*
  3. `describe('what he does')` in accent, with a ✓ list below it (indent 24px, 6px gaps)
  4. Glossary comments (14px, `--dim`) that define any jargon (HIL, Gazebo, …)
  5. Actions: **▴ Collapse**, **Next: {next test} →**, **Full resume →** (primary). On mobile: Full resume on its own row, then Collapse and Next side by side.
- Other suites collapse into a single row: `+ 3 more suites · 9 passed, 1 failed` (`--muted`), which restores the full run.

### Failure panel (flaky test)
Same shape as the detail panel, with `--fail-surface` background and `--border-fail` border, 16px gaps:
title `● personality › ability to ignore a flaky test` (`--fail-text`, 500) → the `expect(...)` line →
an Expected / Received grid (112px label column) → stack line (14px, `--dim`) → a `// Status: won't fix. Working as intended.` comment.

### Known Issues block
- Preceded by the `$ cat KNOWN_ISSUES.md` prompt (32px above it). Panel styled like the detail panel.
- Title: h2 24px/700 with a `#` prefix in `--dim` at 400 weight; the subtitle is in `--muted`.
- Desktop: a real `<table>` with columns ID (72px) | Issue | Severity (120px) | Status (120px). Cell padding 12/16,
  row dividers `--divider`, header cells 13px/500 in `--dim`.
- Mobile: a `<ul>` of stacked items. Each has a meta line (ID · severity chip · status, 12px) above the issue text, with 14px padding and a top divider.
- Severity chip: 13px, padding 2px 8px, radius 4, 1px border:
  low = `--border-ctl` border / `--text-2` text; medium = `--border-medium` / `--accent`; cosmetic = **dashed** `--border-ctl` / `--muted`.
- Footer: "Found another one?" + primary button **Report it — Contact →**.

### Buttons
- Height 44px minimum (48 on mobile), padding 0 18px, radius 8, 14px/500, 1px `--border-ctl`, transparent.
  Hover: border `--accent`, text white. Primary: `--accent` background, `--on-accent` text, hover `--accent-hover`.
- Desktop sidebar buttons are full width with the label on the left and `→` on the right.

### Summary block (home)
A grid with a 112px label column: `Tests:` → **14 passed** (`--pass`, bold), **1 failed** (`--fail`, bold), `0 skipped — coverage 98%`;
`Coverage:` → a 240×8 bar (track `--border`, fill `--accent` at 98%, `role="img" aria-label="98 percent coverage"`) + `98%`;
`Time:` → `2.51s`. Then the comment `// 14 of 15 checks pass. The failing one is the fun part.` (the link opens Known Issues), then the final prompt with the cursor.

## 4. Motion
- **Line-by-line reveal** on the home run: every output line after the first prompt is hidden, then appears instantly (a step, not a fade)
  at a staggered delay. Mockup schedule (seconds): jest .35 · suite1 .7, rows .9/1.05/1.2/1.3/1.4 · suite2 1.6, rows 1.75/1.9/2.05/2.2/2.3 ·
  suite3 2.5, rows 2.6/2.7/2.8/2.9 · suite4 3.1, row 3.3 · summary 3.6 · comment 3.9 · final prompt 4.1. The whole run takes about 4s.
- Implement with CSS (`animation: reveal .01s steps(1,end) both; animation-delay: …`) or JS. Content must be **in the DOM from the start**
  (SEO, screen readers, no layout shift), so hide it visually only.
- **Skip animation** button (always visible in the title bar during the run): reveals everything at once, and its label changes to
  "Animation skipped". A click anywhere on the terminal or pressing Esc may also skip. Remember the choice for the session.
- **`prefers-reduced-motion: reduce`**: no reveal at all (everything shows immediately) and the cursor stops blinking.
- Expand/collapse: an optional height transition of 150–200ms or less; none under reduced motion. Move focus to the panel heading when it expands,
  and back to the row when it collapses.

## 5. Accessibility checklist
- Landmarks: `<aside>` identity, `<nav aria-label="Main">`, `<section aria-label="Test results">`, `role="region"` + label on each panel.
- Each test row is a `<button aria-expanded aria-controls>`, or an `<a>` for routes. No clickable divs.
- Decorative glyphs (✓ ✗ › ▾ → dots) are `aria-hidden`; status is conveyed by the sr-only "Passed:" / "Failed:" text.
- Don't make the reveal an `aria-live` region; screen readers should read the finished page.
- Contrast: all text tokens are ≥ 4.5:1 on their backgrounds (`--dim` is the lowest at about 5.4:1 on `--bg`). `--decor` is for non-text decoration only.
- Touch targets ≥ 44px. Visible focus rings on every interactive element.
- `<html lang="en">` and a descriptive `<title>` for each route or state.
