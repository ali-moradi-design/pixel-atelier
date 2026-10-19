# Decisions

Decisions made after the brief (`brief.md`). Newer entries win.

## 2026-10-19

- Logo: concept P1, a tile with a cut-out "P" whose corner dissolves
  (an earlier "A" tile was rejected). Files in `brand/`.
- Accent "gold" uses the ramp `#ffe169 #edc531 #c9a227 #a47e1b #805b10`:
  dark theme accent `#c9a227` (hover `#edc531`), light theme accent `#805b10`
  (hover `#6b4c0d`). All pass WCAG AA on the background and with on-accent text.
- Type: Geist and Geist Mono for now (may be revisited).
- Everything is written from scratch. Other kits (KokonutUI, shadcn/ui) are
  studied for ideas and quality bar only; no code is copied from them.
- Performance and bundle size are first-class requirements:
  - ESM only, one entry point per component (`pixel-atelier/button`),
    `"sideEffects"` limited to CSS files, so bundlers tree-shake everything
    that is not imported.
  - CSS first; Motion only where CSS cannot do it, and then with `LazyMotion`
    and `m` (or `motion/mini`) instead of the full `motion` component.
  - Effect nodes are created on first interaction; canvas effects pause when
    off screen or in a hidden tab, cap the device pixel ratio, and honor
    `prefers-reduced-motion`.
  - Size budget per component, checked in CI (for example `size-limit`).
- Strong TypeScript docs: every component, variant helper and prop has a TSDoc
  comment (description, allowed values with their meaning, `@default`, and an
  `@example` on components), so editors show it on hover. Prop types are
  written out explicitly instead of `VariantProps`, which drops comments.
  `packages/ui/test/docs.test.ts` fails when a doc is missing.
- No `tailwind-merge` (about 7 kB): `className` is appended to the component's
  classes. Our own `Slot` replaces `@radix-ui/react-slot` (saves about 0.8 kB per
  component).
- Tailwind utilities from the kit are prefixed `pa-` (`bg-pa-surface`) so they
  never clash with an app's own theme (for example shadcn's `accent`).
- Platform primitives before Radix: checkbox, radio, switch and slider are styled
  native inputs; popups (Select, Combobox, later menus and popovers) use the
  popover API (top layer, never clipped) with a small positioning helper;
  dialogs will use `<dialog>`. Radix only where the platform has no answer.
  Result: Select 3.9 kB, all 14 components of v0.2 7 kB (brotli).
- Variants must never emit two utilities for the same property (no
  tailwind-merge to resolve them); `test/class-conflicts.test.ts` checks every
  combination.
- Tests: unit tests (jsdom) for behavior; a quick real-browser look (Playwright
  screenshots of Storybook) only for visual or browser-only behavior.

