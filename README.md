# Anderson Vanegas — Portfolio

GUI-first portfolio for [avanegas.com](https://avanegas.com). A readable resume layout is shown by default; an optional Linux-style terminal drawer lets visitors explore the same content with `ls`, `cat`, `cd`, and a pytest-themed test run.

Built with **Next.js 15 + React 19 + TypeScript**, deployed on **Vercel**.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build & test

```bash
npm run lint
npx tsc --noEmit
npm test          # Vitest — terminal engine unit tests
npm run build
npm start
```

E2e tests (pytest + Playwright) live in `e2e/`:

```bash
cd e2e
pip install -r requirements-dev.txt
playwright install chromium
pytest -m "smoke or sanity or regression"
```

## Project structure

| Path | Purpose |
|---|---|
| `src/content/` | Single source of truth — resume, pytest tests, glossary, known issues |
| `src/components/gui/` | GUI sections (Hero, Experience, Projects, Skills, About, …) |
| `src/terminal/` | Pure TypeScript terminal engine (commands, virtual FS, pytest output) |
| `src/app/page.tsx` | Single-page portfolio |
| `src/app/report/page.tsx` | Pytest-html styled resume report |
| `e2e/` | Playwright page objects and pytest e2e suite |
| `docs/PLAN.md` | Full architecture and workstream plan |

## Routes

- `/` — GUI portfolio with optional terminal drawer (`?_terminal` or `?cmd=pytest`)
- `/report` — Pytest-html resume report view
- `/projects`, `/contact`, `/known-issues` — redirect to `/#projects`, `/#contact`, `/#about`
- `/resume` — redirects to `/Anderson_Vanegas_Resume.pdf`
- Legacy hashes like `/#boston-dynamics` scroll to the matching GUI section

## Terminal quick start

Open the drawer from the header **`>_ Terminal`** button or the hero `$ pytest` teaser, then try:

```
tutorial
ls
cd experience/boston_dynamics
cat staff_sqa_engineer.md
pytest
open reports/anderson_report.html
```
