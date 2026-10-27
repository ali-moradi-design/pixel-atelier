# Docs site (`@pixelbits/docs`)

The documentation site at <https://pixelbits.ali-moradi-develop.com>: a
Next.js static export (plain files in `out/`, served by Nginx). It uses the
kit like any app does, from the built `pixelbits` package.

```bash
pnpm --filter @pixelbits/docs dev     # http://localhost:3000 (run Storybook too for the Storybook link)
pnpm --filter @pixelbits/docs build   # out/
```

## Where is what

Rule of thumb: **routes in `app/`, everything they render in `components/`,
data and helpers in `lib/`.** A file name says what it renders.

```
apps/docs/
├── app/                     Routes only (layouts, pages, metadata files)
│   ├── (en)/                English site, its own root layout
│   │   ├── layout.tsx       <html lang="en">, header, footer, theme, metadata
│   │   ├── page.tsx         Home page  →  /
│   │   └── docs/
│   │       ├── layout.tsx   Sidebar + content grid
│   │       ├── page.tsx     Getting started  →  /docs/
│   │       ├── tokens/      Tokens page  →  /docs/tokens/
│   │       └── [slug]/      One page per component  →  /docs/button/ …
│   ├── (fa)/fa/             Persian (RTL) page, its own root layout  →  /fa/
│   │   └── _components/     Parts used only by this page
│   ├── robots.ts            /robots.txt
│   ├── sitemap.ts           /sitemap.xml
│   └── manifest.ts          /manifest.webmanifest
├── components/
│   ├── layout/              Site chrome: header, footer, docs sidebar, logo,
│   │                        "Made with love", smooth scrolling
│   ├── docs/                Building blocks of doc pages: code block, Markdown
│   ├── theme/               next-themes provider and the theme toggle
│   ├── search/              The ⌘K site search
│   └── ui/                  Small shared pieces (copy button)
├── demos/                   One file per component: the live example AND the
│                            code shown on its page (keep them short)
├── fonts/                   Font files (manrope/, persian-y/, story-script/) + index.ts
├── lib/
│   ├── site.ts              Name, URLs, links: change them here only
│   ├── seo.tsx              Page metadata helper and JSON-LD
│   ├── catalog.ts           The list of components (slug, title, group)
│   ├── demos.tsx            Lazy imports of the demos
│   └── highlight.ts         Shiki code highlighting (build time)
├── styles/                  globals.css (Tailwind, tokens, site styles), code.css
├── scripts/                 Build-time scripts (see below)
├── content/                 Generated: api.json (gitignored)
└── public/                  Static files; r/ and storybook/ are generated
```

Adding a component page: add it to `lib/catalog.ts`, write `demos/<slug>.tsx`
and register it in `lib/demos.tsx`. The props table comes from the kit's
TSDoc automatically.

## Scripts (`scripts/`)

| Script | When | What it does |
| --- | --- | --- |
| `gen.ts` | before `dev`, `build`, `typecheck` | Rebuilds the kit first when its build is missing or older than its sources, runs the two below, and copies the built Storybook into `public/storybook/` and the brand files into `public/`. |
| `api.ts` | from `gen.ts` | Reads `packages/ui/dist/**/*.d.ts` and writes `content/api.json`: every component's description, example and props (the props tables). |
| `registry.ts` | from `gen.ts` | Generates the shadcn registry in `public/r/` (see below). |
| `csp.ts` | after `next build` | Adds a strict Content-Security-Policy `<meta>` to every page in `out/`, allowing inline scripts only by their SHA-256 hash. |
| `check-csp.ts` | after `csp.ts` | Fails the build if a page has no CSP or runs an inline script the CSP does not allow. |

## `public/r/`

The **shadcn registry**: one JSON file per component (`button.json`,
`block-hero.json`, the shared `pixelbits-base.json`) and an index
(`registry.json`). With it, anyone can copy a component's source into their
own project:

```bash
npx shadcn add https://pixelbits.ali-moradi-develop.com/r/button.json
```

It has to be in `public/` so the static export serves it at `/r/…`. It is
generated from `packages/ui/src` on every build and gitignored, so it can
never drift from the code.

## Fonts

All fonts are files in `fonts/`, served from this site (no request to Google
or any other host):

- **Manrope** (`fonts/manrope/`, English UI, variable 200–800, SIL Open Font
  License).
- **Geist Mono** (code), from the `geist` package.
- **persian-y** (`fonts/persian-y/`, Persian page).
- **Story Script** (`fonts/story-script/`, the wordmark next to the logo, SIL
  Open Font License).

Change the fonts in `fonts/index.ts`.
