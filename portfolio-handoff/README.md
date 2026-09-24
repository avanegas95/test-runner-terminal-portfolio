# Handoff: avanegas.com — "Test Runner Terminal" portfolio

**Owner:** Anderson Vanegas (Staff SQA Engineer, Boston Dynamics)
**Status:** Design approved for implementation. These are hi-fi mockups, not production code.
**Hosting:** the site is on GitHub today and is moving to Vercel.

## The concept (one paragraph)
The homepage runs a test suite *about Anderson*. The output shows up line by line, like a real
Jest run. Each passing test opens into part of his story. The one failing test,
"ability to ignore a flaky test", opens a playful "Known Issues" about-me section.
**The terminal output is the navigation.** Plain buttons (Projects / Resume / Contact) are always
visible too, so recruiters who aren't engineers never get stuck.

## What's in this folder
| Path | What it is | Use it for |
|---|---|---|
| `README.md` | This file | Start here |
| `DESIGN_SPEC.md` | Layout, components, states, motion, accessibility, responsive rules | Building the UI |
| `CONTENT.md` | Every piece of copy, the full test list, timings, Known Issues | Data and copy (put it in one content file) |
| `tokens.css` | Color, type, spacing and radius tokens | Theme setup |
| `screenshots/*.png` | Full-page renders of all six screens at @2x | Visual target |
| `previews/*.html` | Static HTML exports you can open in a browser; the links between screens work | Checking hover, focus and animation |
| `mockups-source/*.dc.html` | Original design-canvas source files | Exact values if something is unclear |

Screens (desktop 1440 wide, mobile 390 wide):
1. `home-*` is the homepage test run (hero, animated output, summary).
2. `expanded-*` shows one test (Boston Dynamics) expanded inline into a detail panel.
3. `known-issues-*` shows the failed test expanded, plus the `KNOWN_ISSUES.md` about-me section.

> Note: the screenshots were rendered without network access, so they use a fallback monospace
> font. The real design uses **JetBrains Mono** (Google Fonts). The previews load it when you're online.

## Implementation guidance
- **Stack:** not decided yet. Next.js + TypeScript on Vercel is a natural fit. Confirm with Anderson before scaffolding.
- **Build it as one page, not three.** The mockups show three separate screens, but in production
  "expanded" is a *state* of the homepage. Clicking a test expands it inline; it doesn't navigate away.
  Give each expanded test a URL hash or route (e.g. `/#boston-dynamics`, `/known-issues`) so it can
  be deep-linked and shared.
- **The mockups are fixed-width artboards.** Make the real layout fluid: see the breakpoints in DESIGN_SPEC.md.
- **Put the content in data** (e.g. `content/tests.ts`) from CONTENT.md. Don't hard-code 15 rows of markup.
- **Don't copy the mockup markup as-is.** It uses inline styles for the design editor. Use the tokens and components instead.

## Still open (ask Anderson)
- Destinations and content for **Projects**, **Resume** (PDF?) and **Contact** (email / LinkedIn / form?).
- Expanded-detail copy for the 13 tests besides Boston Dynamics and the flaky test. Only those two are written.
  A reasonable first pass: SharkNinja gets a full panel like Boston Dynamics; skill tests get a short
  2–3 line panel (plain-English line + where it was used).
- Whether the animation should replay on every visit or only the first (a sessionStorage flag is suggested).
- Known Issues entries are drafts based on Anderson's hobbies. He should review them before launch.

## Definition of done
- [ ] All three states match the screenshots at 1440 and 390 widths
- [ ] Line-by-line reveal, a visible "Skip animation" control, and full `prefers-reduced-motion` support
- [ ] Every test row is a real `<button>` or `<a>`; keyboard- and screen-reader-operable (see spec)
- [ ] Projects / Resume / Contact visible on every screen, at every width
- [ ] Text contrast ≥ 4.5:1; touch targets ≥ 44px
- [ ] Deployed on Vercel
