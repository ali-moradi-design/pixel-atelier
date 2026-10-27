# Project instructions

Pixelbits: a React UI kit (see docs/brief.md, docs/decisions.md, CONTRIBUTING.md).

Start every session by reading `docs/session-notes.md` (what is done, what is
open, and the plan for the next session). Update it at the end of the session.

## Language

Explain in Persian; every English term in parentheses and backticks; never start
a line with an English word. Repo files are in English.

## graphify

Use graphify in this repo to save tokens. `graphify-out/` (gitignored) holds a
code-only (AST) graph. Before reading files to find code, run
`graphify query "<question>" --budget 800`; after changing code, run
`graphify update .` (AST only, no LLM cost). Do not run semantic extraction on
the docs: they are few and small.

## Workflow

- Small PRs from the session branch: run `pnpm check` and
  `pnpm --filter pixelbits size` locally, then squash-merge right away;
  do not wait for GitHub CI. Reset the session branch onto `main` afterwards.
- End-to-end/visual tests (Playwright) only where needed: components with
  real browser behavior (layout, canvas, focus across portals) and releases.
  Unit tests (Vitest + Testing Library + axe) for everything else.
