# Session notes (handoff)

Last session: 2026-10-27. Read this first, then `docs/decisions.md`.

## Next session: start here

0. Open from 2026-10-27 (the big redesign session, see decisions.md):
   - The owner picks the English UI font from the shortlist given in chat
     (Geist stays until then); change it in `apps/docs/fonts/index.ts`
     (a local `next/font/local` file) and in `packages/tokens` `fonts`.
   - Visual baselines are outdated on purpose (new colors, logo, pagination,
     accordion): run the "Update visual baselines" workflow.
   - Owner: rename the GitHub repo to `pixelbits`, then replace
     `ali-moradi-design/pixel-atelier` (package.json, site.ts, changesets).
   - Owner: confirm the Yekan Bakh license allows shipping it in a public
     repository (it is a commercial font).
   - Check the new Windows/macOS CI job on the first push.
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

- [x] `ci.yml` was invalid YAML (unquoted colon in a job name); fixed in the
      last PR. Add a YAML validity check to CI so this cannot happen again.
- [ ] `browser` job failed on main (step `test:browser`, since v1.0). Most
      likely the visual baselines were rendered locally and differ slightly
      on GitHub's runner. Check the uploaded `playwright-report` artifact; if
      it is only rendering differences, run the "Update visual baselines"
      workflow. If axe failed, fix the component instead.
- [ ] `Release` workflow fails in the `changesets/action` step. Read its
      log. Likely causes: the repository setting "Allow GitHub Actions to
      create and approve pull requests" is off (Settings → Actions →
      General), or the new `npm` environment needs approval.
- [ ] Watch the first CodeQL results in the Security tab.

## Open: owner actions (account settings)

- [ ] npm: account with 2FA; check `npm view pixelbits` still 404s;
      granular token as `NPM_TOKEN` secret, or trusted publishing.
- [ ] GitHub: 2FA, private vulnerability reporting, secret scanning with push
      protection, branch protection on `main` (require CI and Security),
      required reviewer on the `npm` environment, Actions allowed to create
      PRs.
- [ ] Merge the "Version packages" PR to publish 1.0.0; after the first
      publish, switch to trusted publishing and delete `NPM_TOKEN`.
- [ ] Deploy the docs (roadmap phase 7): `apps/docs/out` →
      `/srv/static/pixelbits`, Nginx config in `deploy/nginx/`, certbot.
- [ ] Upload `brand/social-preview.png` as the repository's social preview.
- [ ] Decide on the font (Geist kept for now; the logo wordmark uses it).

## Ideas (not planned yet)

- Refactor Select/Combobox onto `usePopup` (smaller, one popup code path).
- Run Storybook `play` interaction tests in CI (they exist, CI does not run them).
- Visual tests in the light theme and at phone width.
- Positioning helper: collision handling beyond flip and clamp.
- Server-side security tests for the demo apps that have a database
  (see "Forms in apps with a server and a database" in `docs/security.md`).

## Working rules (from the owner)

- Explain in Persian with the language rules in `CLAUDE.md`.
- graphify for code lookup (`graphify query`, `graphify update .`).
- PRs: check locally, then squash-merge without waiting for GitHub CI; but
  look at CI on main at the end of a session and note failures here.
- Browser/e2e tests only where needed.
- If the usage limit is reached, wait for the reset and continue.
