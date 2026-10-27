# Decisions

Decisions made after the brief (`brief.md`). Newer entries win.

## 2026-10-27 (later)

- English UI font: Manrope (variable, OFL, kept in the repo). Persian font
  files are named persian-y. Satoshi was dropped: its license forbids sharing
  the files in a public repository.
- `pnpm dev` (turbo) now builds the packages first, and the docs `gen.ts`
  rebuilds the kit when `packages/ui/dist` is missing or older than the
  sources, so the site never runs on stale CSS after a pull.

## 2026-10-27

- Renamed to **Pixelbits** (npm `pixelbits`, free on 2026-10-27; "Pixel
  Atelier" was hard to type). Utility and variable prefix `pb-` (`bg-pb-muted`,
  `--pb-accent`). Docs domain `pixelbits.ali-moradi-develop.com`. The GitHub
  repository keeps its name until the owner renames it.
- Colors are written in OKLCH. Accents: gold (default), platinum, emerald,
  sapphire, ruby, amethyst. Status colors are muted jewel tones. The token
  test parses OKLCH, checks WCAG AA and that every color fits in sRGB.
- Logo: a pixel gem (13 x 9, variant "E": facet lines cut out) in four gold
  tones; wordmark in Story Script. Replaces the P1 tile.
- `Link` is now `TextLink` (`pixelbits/text-link`) so it never clashes with
  Next.js `Link`.
- Button gets an `outline` variant; Card gets composable parts (CardMedia,
  CardHeader, CardEyebrow, CardTitle, CardDescription, CardContent,
  CardFooter) next to its shortcut props; Tabs gets `withPanels`.
- Every exported component accepts `className` (test/props.test.tsx checks all
  exports) and every `asChild` path is tested.
- Docs: next-themes for the theme (no flash, no transition blink), Lenis
  smooth scrolling, all fonts local (Manrope for the UI, Geist Mono for code, persian-y for Persian, Story Script for the wordmark), no
  Google Fonts. Code blocks are rendered to React elements (no
  dangerouslySetInnerHTML). Folder structure documented in apps/docs/README.md.
- SEO per the Next.js docs: per-page metadata helper (canonical, language
  alternates, Open Graph, Twitter), robots, sitemap, manifest, JSON-LD.
- Storybook: theme toggle with @storybook/addon-themes; docs pages follow it.
- Cross-platform: `.gitattributes` forces LF, scripts use `fileURLToPath`
  and POSIX paths for registry paths, Node >= 22.18 (type stripping) with
  `engineStrict`, and CI builds on Windows and macOS too.

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
  - ESM only, one entry point per component (`pixelbits/button`),
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
- Tailwind utilities from the kit are prefixed `pb-` (`bg-pb-surface`) so they
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
- React 19 is the minimum peer version (native `inert`, refs as props,
  `useSyncExternalStore` everywhere); `forwardRef` stays for now.
- Signature effects: CSS first (dissolve, roll, ticker, marquee, loaders,
  spotlight); canvas for large or per-frame effects (image reveal, page
  transition, cursor trail) that only animate while active and stop under
  reduced motion. No animation library: Motion was not needed.
- Docs site: Next.js static export (`apps/docs/out`, plain files for Nginx),
  using the kit from its built package like any app. Props tables are generated
  from the TSDoc in `dist/**/*.d.ts`; each demo file is both the live example
  and the code shown. Storybook is copied to `/storybook`.
- shadcn registry: `apps/docs/scripts/registry.ts` generates `/r/<name>.json`
  from `packages/ui/src` (base item with tokens, CSS and helpers; one item per
  component with its sibling dependencies). Verified with `shadcn add`.
- Persian RTL page at `/fa` with its own root layout (`lang="fa" dir="rtl"`,
  Vazirmatn).
- v1.0 adds five blocks (Hero, FeatureGrid, Pricing, SiteHeader, SiteFooter) as
  `pixelbits/blocks/*` and `block-*` registry items.
- Browser checks (`apps/storybook/browser`, Playwright on the built
  Storybook): axe with color contrast in both themes, and screenshot
  comparison of ten key stories plus one hover state. They found real light
  theme contrast failures (status badges, muted text on selected rows); status
  colors were darkened, badge tints made opaque, and the token tests now check
  colors on their tinted backgrounds too. Baselines are refreshed with the
  "Update visual baselines" workflow after intended changes.
- Releases: Changesets + `.github/workflows/release.yml` (npm provenance). The
  first changeset bumps `pixelbits` to 1.0.0; publishing waits for the
  `NPM_TOKEN` secret (see `docs/release.md`).
- Security (see docs/security.md): XSS test suite and banned-API guard for the
  package; pnpm supply-chain policies (minimumReleaseAge, trustPolicy,
  strictDepBuilds); actions pinned to SHAs and audited with zizmor; CodeQL,
  Dependency Review, weekly audit, Dependabot with cooldown; per-page
  hash-based CSP with form-action 'none' on the static site; Nginx read-only
  config with shared security headers; fonts self-hosted everywhere. The Tailwind
  CLI was replaced by the PostCSS plugin, removing the only (dev-only)
  vulnerable dependency.

