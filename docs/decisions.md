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
