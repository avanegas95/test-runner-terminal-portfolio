# Test Runner Terminal Portfolio

Portfolio for [avanegas.com](https://avanegas.com). The homepage runs a Jest-style test suite about Anderson Vanegas — each passing test expands into part of his story, and the one failing test opens a playful "Known Issues" about-me section.

Built with **Next.js + TypeScript**, designed for deployment on **Vercel**.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Project structure

| Path | Purpose |
|---|---|
| `src/content/` | All copy and test data (from `portfolio-handoff/CONTENT.md`) |
| `src/components/` | UI components matching `portfolio-handoff/DESIGN_SPEC.md` |
| `src/app/globals.css` | Layout and component styles using `portfolio-handoff/tokens.css` |
| `portfolio-handoff/` | Design handoff: spec, tokens, previews, mockups |

## Routes

- `/` — Homepage test run (expand tests via hash, e.g. `/#boston-dynamics`)
- `/known-issues` — Failed test + KNOWN_ISSUES.md section
- `/projects`, `/resume`, `/contact` — Plain nav destinations (content TBD)
