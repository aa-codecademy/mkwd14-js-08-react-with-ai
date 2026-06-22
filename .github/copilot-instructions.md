# Copilot Instructions — React Training Repo

## What this repo is

A step-by-step React training course. Each `class_XX/` folder contains:

- **`pantry-pal/`** — the main project (a pantry/ingredient management app) that grows across every class.
- **`examples/`** — isolated side-demos that introduce one new concept at a time, used for live coding during lectures.

React is the **first frontend framework** students encounter. Prioritize clarity and explicitness over cleverness or brevity in every suggestion.

## Tech stack

| Tool | Version | Notes |
|---|---|---|
| React | 19 | Functional components only |
| TypeScript | ~6 | Strict; explicit prop types |
| Tailwind CSS | v4 | Utility-first, via `className` |
| Vite | latest | Dev server (`npm run dev`) |
| ESLint | latest | react-hooks + react-refresh plugins |

## Detailed rules by topic

See the files in `.github/instructions/` — Copilot applies them automatically based on the file you are editing:

| File | Applies to |
|---|---|
| `react-components.instructions.md` | All `.tsx` files |
| `typescript.instructions.md` | All `.ts` and `.tsx` files |
| `styling.instructions.md` | All `.tsx` and `.css` files |
| `examples.instructions.md` | Everything inside `examples/` |
| `pantry-pal.instructions.md` | Everything inside `pantry-pal/` |
