# Pixelbits UI kit: brief

Decisions from 2026-10-19. Demo 4 in notes/demos.md (UI kit). Built in the public
repo `ali-moradi-design/pixelbits` (to be created by the user) in its own sessions;
this file is the handoff and is safe to make public.

## How the build session starts

1. Check the prerequisites (below) and report before writing code.
2. Copy this brief into the repo as `docs/brief.md`.
3. Design first: the logo (see "Logo"), then mockups as images (HTML/CSS rendered to PNG with Playwright) of
   the tokens page, the core components and two or three signature components,
   in dark and light. Show them to the user; no library code before approval.
4. Split the scope into versions with the user, then build step by step in small
   PRs (branch → PR → CI → squash merge), explaining each step.

Language rules: explain in Persian, every English term inside parentheses and
backticks, never start a line with an English word, repo files in English.

## Prerequisites to check first

- `git`, `node` (current LTS), `pnpm`.
- The folder is a clone of `ali-moradi-design/pixelbits`, on `main`, clean; report
  what is already in it.
- GitHub fetch/push works; the public `ali-moradi-design/portfolio` repo is
  readable (the pixel effects to start from live there).
- npm account; check that `pixelbits` is still free (or choose a scope, the
  same one as the form builder packages if one was chosen already).
- Playwright runs locally (mockups, visual regression).
- Read the current docs of Tailwind v4, Radix primitives, the shadcn registry
  format and Motion before coding.

## Inspiration

- KokonutUI (kokonutui.com): animated, eye-catching components distributed as a
  shadcn registry (the CLI copies the component source into the user's project),
  built with Tailwind v4, shadcn, Motion and lucide icons. Take the idea and
  quality bar only; write everything from scratch.
- The user's own portfolio (`ali-moradi-design/portfolio`, `src/shared/ui/pixels`
  and `src/shared/ui/button`, used by the header menu):
  - `Pixels`: on hover or keyboard focus a grid of ~9 px squares switches on left
    to right with some deterministic noise (~0.4 s), then the label switches to the
    ink color. Squares are created only on the host's first hover/focus (they were
    about half of all nodes on the home page otherwise); `@starting-style` lets the
    first dissolve run like the later ones. Host sets `--px-fill` and `--px-ink`.
  - `RollLabel`: the label rolls up and a copy comes in from below.
  - Buttons: uppercase, letter spacing 0.06em, 2 px radius; primary uses the accent.
  These are the starting point and the signature of the kit (the user's own code).

## Logo

- Needed for the docs site, npm/GitHub (README header, social preview), favicon.
- Direction: a monogram built from square pixels (for example "PA", or an "A"
  whose strokes are pixel squares), with the wordmark "Pixelbits" in the kit's
  type; refined, not retro-game.
- Must stay readable at 16 px (favicon) on a pixel grid; versions: mark only,
  mark + wordmark, light and dark, one-color.
- Deliver as SVG; the docs hero may animate it with the kit's own pixel dissolve.
- Show 3 concepts as images first; the user picks one before it is finalized.

## Identity

- Name: Pixelbits: pixels, crafted with care.
- Luxurious and modern: calm, minimal base (few, deliberate colors; dark theme by
  default plus light; precise typography; generous spacing); the pixel effects
  appear only at moments of interaction (hover, focus, open, loading), so they
  stay elegant and never noisy.

## Contents

1. Foundations (tokens): color, typography, spacing, radius, shadow, motion
   (durations and easings), as CSS variables with light/dark and several accent
   themes; exposed as a Tailwind v4 theme.
2. Core components (each with a pixel variant of its interactive states where it
   fits): Button, IconButton, Link, Badge/Tag, Input, Textarea, Select, Combobox,
   Checkbox, Radio, Switch, Slider, Tabs, Accordion, Dialog, Sheet/Drawer, Popover,
   Tooltip, Dropdown menu, Command palette, Toast, Card, Avatar, Skeleton, Table,
   Pagination, Breadcrumb, Progress.
3. Signature components (KokonutUI-style): pixel button, full-screen menu with
   rolling labels (from the portfolio), pixel image reveal (mosaic to sharp), text
   scramble/decrypt, pixel page transition, pixel loader, spotlight card, magnetic
   button, number ticker, marquee, cursor trail (from the portfolio).
4. Blocks: hero, pricing, feature grid, header with menu, footer.

## Architecture

```
packages/
  tokens     CSS variables + Tailwind v4 theme (light/dark, accents)
  ui         components: Radix primitives + cva variants + Motion;
             pixel effects as reusable primitives
apps/
  docs       Next.js docs site: live demos, code tabs, props tables, install
             commands; also serves the shadcn registry JSON
  storybook  development, interaction tests, visual regression
```

- Turborepo monorepo.
- Two ways to distribute (both decided):
  - npm package: simple install and updates; the other demos install it (proves
    the CV claim "used across all products").
  - shadcn registry: `shadcn add <url>` copies a component's source into the
    user's project (KokonutUI style). Registry items are generated from the same
    source as the package, never maintained twice.
- The docs site is the public demo on `pixelbits.ali-moradi-develop.com`. Prefer a
  static export so it deploys through roadmap phase 7. Storybook is published too
  (it is on the CV), for example under `/storybook`.
- Accessibility: Radix handles keyboard and ARIA; every effect also runs on
  keyboard focus, not only on hover; `prefers-reduced-motion` turns the pixel
  dissolve into a plain color fill; logical CSS for RTL; WCAG AA contrast.
- Performance: lazy creation of effect nodes on first interaction (the portfolio
  trick) is a rule for every component; large effects (image reveal, page
  transition) use canvas or CSS masks instead of hundreds of elements; Motion
  only where CSS cannot do it.
- Tests: Vitest + Testing Library, Storybook interaction tests, Playwright
  screenshot comparison (visual regression), axe accessibility checks; all in CI.
- Releases: Changesets for versions and changelogs; publish to npm from GitHub
  Actions (with provenance).
- License: MIT.

## Decided

- Docs in English, with one Persian demo page to show RTL.
- What happens after the first release (for example the portfolio using the kit)
  is decided later by the user; do not plan it now.
- Name: Pixelbits (renamed from "Pixel Atelier" on 2026-10-27: easier to
  type; small pixel pieces). Repo `ali-moradi-design/pixelbits`, subdomain
  `pixelbits.ali-moradi-develop.com`. npm: `pixelbits` was free unscoped
  on 2026-10-27; check again before the first publish.
