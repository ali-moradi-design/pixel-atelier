# Session notes (handoff)

Last session: 2026-10-29 (deploy-kit switch; before that 2026-10-27). Read this first, then `docs/decisions.md`.

## Next session: start here

0. Open from 2026-10-27 (the big redesign session, see decisions.md):
   - English UI font: Manrope (chosen by the owner).
   - Done (2026-10-27, later): visual baselines re-rendered on GitHub's runner
     with the "Update visual baselines" workflow.
   - Done: the GitHub repo is now `ali-moradi-design/pixelbits`; all URLs
     updated. Old URLs redirect, but local clones should run
     `git remote set-url origin https://github.com/ali-moradi-design/pixelbits.git`.
1. The owner wants a **walkthrough of the code from the beginning**, step by
   step, before going further. Do not explain everything at once; go in this
   order and wait for questions after each part:
   1. Monorepo: `package.json`, `pnpm-workspace.yaml` (supply-chain policies),
      `turbo.json`, `tsconfig.base.json`, `biome.json`.
   2. Tokens: `packages/tokens/src/tokens.ts` → `scripts/build.ts` →
      `dist/tokens.css` / `theme.css`; contrast tests.
   3. Package build: `packages/ui/tsdown.config.ts`, `package.json` exports,
      `scripts/build-css.ts`, size budgets.
   4. Pixel primitives: `src/pixels/*` and `src/styles/pixels.css`.
   5. `Slot`, `Button` and the cva pattern; TSDoc rule and its test.
   6. Forms (Field, native inputs, Select/Combobox with the popover API).
   7. Overlays (native `<dialog>`, `usePopup`), data display, signature
      effects (CSS vs canvas), blocks.
   8. Tests: Vitest + Testing Library + axe, security and guard tests,
      Storybook and the Playwright browser checks.
   9. Docs site (`apps/docs`): API extraction, registry, CSP.
   10. CI/CD: workflows, Changesets release, security.
2. Then fix the open CI items below.

## Done

- Brief copied to `docs/brief.md`; logo P1 (`brand/`); mockups (`design/mockups/`).
- v0.1–v1.0 merged (PRs #1–#10): tokens; 39 components and 5 blocks in
  `pixelbits`; Storybook; docs site with generated API, shadcn registry
  (verified with `shadcn add`) and Persian RTL page; Playwright axe + visual
  tests; Changesets release pipeline; security hardening (see
  `docs/security.md`).
- Numbers at the end: 274 unit tests, 31 browser tests, `pnpm audit` 0
  vulnerabilities, all components 18.2 kB brotli, CSS 9.7 kB gzip,
  `zizmor --persona=pedantic` clean.

## Open: CI on GitHub (found at the end, not fixed yet)

Local checks all pass; these are GitHub-only:

- [x] `ci.yml` was invalid YAML; now `scripts/check-workflows.mjs` checks
      every workflow file in `pnpm lint` and in the Security workflow (which
      still runs when `ci.yml` is broken).
- [x] `browser` job: only one visual test failed (hovered button 117px wide
      instead of 119px, from the Manrope font change). Baselines re-rendered
      with the "Update visual baselines" workflow.
- [x] `Release` workflow: `changesets/action` v2 renamed its inputs
      (`publish-script`, `version-script`, `pr-title`, `commit-message`).
      Fixed; later runs are green and 1.0.1 shipped through it, so no extra
      repository setting was needed.
- [x] Windows/macOS build jobs: green on main (required checks).
- Local note: in the cloud session `turbo` cannot spawn tasks ("Exec format
  error"); run `pnpm -r run build|typecheck|test` instead there.
- [ ] Watch the first CodeQL results in the Security tab.

## Open: owner actions (account settings)

- [x] npm: account `ali-moradi-dev` with 2FA (security key; the owner turned
      it off once, then had to turn it back on to set up trusted publishing).
- [x] `pixelbits@1.0.0` published (2026-10-27) with an npm token. npm staged
      the first publish: placeholder `0.0.0-stage`, then 1.0.0 a few minutes
      later without a manual approval.
- [x] Trusted publishing: npmjs.com → pixelbits → Settings → Trusted
      Publisher (`ali-moradi-design/pixelbits`, `release.yml`, environment
      `npm`, allowed: npm publish). `release.yml` passes no npm token;
      `pnpm publish` (pnpm 12) uses the OIDC token. 1.0.1 was published this
      way by "GitHub Actions" with provenance.
- [x] Owner deleted the npm token and the `NPM_TOKEN` secret (2026-10-27).
      Trusted publisher status: Valid. Publishing access: "Require two-factor
      authentication and disallow bypass 2fa tokens", so only `release.yml`
      (or the owner with 2FA) can publish.
- [x] Owner (2026-10-27): `0.0.0-stage`
      deprecated; GitHub 2FA, private vulnerability reporting, secret
      scanning with push protection, required reviewer on the `npm`
      environment; social preview uploaded.
- `shadcn add` works only after the docs deploy: the registry is served from
  `https://pixelbits.ali-moradi-develop.com/r/*.json`.
- [x] Docs live at https://pixelbits.ali-moradi-develop.com (roadmap 7.1-7.2,
      2026-10-27): first upload by hand, Nginx config from `deploy/nginx/`,
      own certbot certificate. Server-wide gzip for JS/CSS/JSON added in
      `/etc/nginx/conf.d/gzip.conf` (Ubuntu gzips only HTML by default).
- [x] Deploy from CI (roadmap 7.3, 2026-10-27): `deploy-docs.yml` builds on
      Linux and rsyncs `apps/docs/out` to `/srv/static/pixelbits` on every
      push to main (first green run: build 33 s, deploy 16 s). Never upload a Windows build: Next 16 writes the
      prefetch files (`__next.*.txt`) as nested folders there, so the browser
      gets 404s for them.
- Storybook: changing the theme or accent on a DOCS page reloads the whole
  preview iframe (Storybook 10.6 behavior, also without our docs container;
  story pages switch in ~150 ms). Hence the immutable cache for
  `/storybook/assets/` (now in `apps/docs/next.config.ts`).
- [ ] Storybook flash on docs pages: the reloaded iframe paints white before
      the CSS loads. Idea: `.storybook/preview-head.html` with a tiny inline
      script that reads `globals=theme:...` from the iframe URL and sets
      `data-theme` plus a background color before anything renders.
- Deploy workflow `deploy-docs.yml` (push to main): build job without
  secrets → artifact → deploy job in environment `docs` → rsync. The key
  `gha_pixelbits` is forced to `rrsync /srv/static/pixelbits` on the server
  (it cannot run any other command).
- [x] 2026-10-29: `deploy-docs.yml` now calls the shared
      `ali-moradi-design/deploy-kit` workflow `deploy-static.yml` (PR #36,
      pinned to the commit of tag v1.0.0, `secrets: inherit` needed for the
      `docs` environment's SSH secrets). Same build, rsync and smoke tests;
      first run green (~54 s). Dependabot bumps the deploy-kit SHA like any
      other action.
- [x] 2026-10-29: the docs site runs as a Next.js `standalone` container
      (PR #37; decision: every Next.js site runs as a server). Image
      `ghcr.io/ali-moradi-design/pixelbits-docs:<sha>` holds only
      `.next/standalone`; `/srv/apps/pixelbits`, port 3102, read-only,
      256 MB. `deploy-docs.yml` builds, pushes and calls deploy-kit's
      `deploy-app.yml`; the `docs` key is now forced to
      `deploy-app pixelbits` (no rrsync). CSP: per-request nonce in
      `apps/docs/proxy.ts` (the Next.js guide's SRI option was tried: Next's
      inline scripts were blocked), so pages render per request (~20 ms).
      Headers (HSTS, cache, `/r/` CORS, Storybook CSP) are in
      `next.config.ts`; Nginx only proxies (GET/HEAD, 1k body). The old
      rsync notes above are history; `/srv/static/pixelbits` was removed.
- English UI font is Manrope (decided); the new logo is in `brand/`.

- [x] Ruleset `protect-main` on the default branch (2026-10-27): PR required
      (0 approvals), no force push or deletion, branch must be up to date,
      required checks: "Lint, types, unit tests, build, size", "Browser: axe
      and visual regression", "Build on windows-latest", "Build on
      macos-latest", "Workflow files are valid", "CodeQL", "Dependency
      review". Not `pnpm audit` (a new advisory would block every PR).
      Renaming a job means updating the ruleset. "Version packages" PR: close
      and reopen it so the checks run (GITHUB_TOKEN events start no workflows).

## Ideas (not planned yet)

- Keep `workspace:*` for `pixelbits` in the docs and Storybook apps (they show
  the code that is about to ship). To test what npm users really get, add a
  CI check on the packed tarball: `pnpm pack`, then publint and
  are-the-types-wrong, then install it into a small Next app and build it.

- Refactor Select/Combobox onto `usePopup` (smaller, one popup code path).
- Run Storybook `play` interaction tests in CI (they exist, CI does not run them).
- Visual tests in the light theme and at phone width.
- Positioning helper: collision handling beyond flip and clamp.
- Server-side security tests for the demo apps that have a database
  (see "Forms in apps with a server and a database" in `docs/security.md`).

## Working rules (from the owner)

- Explain in Persian with the language rules in `CLAUDE.md`.
- graphify for code lookup (`graphify query`, `graphify update .`).
- PRs: check locally, wait for the required checks (ruleset `protect-main`),
  then squash-merge.
- Browser/e2e tests only where needed.
- If the usage limit is reached, wait for the reset and continue.
