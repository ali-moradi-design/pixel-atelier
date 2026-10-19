# Security

Two different things need protecting, with different risks:

- **The npm package** runs inside other people's apps. The main risks are the
  supply chain (a poisoned dependency, a hijacked workflow or token) and XSS
  (a component turning untrusted text or links into running code).
- **The demo site** (`pixel-atelier.ali-moradi-develop.com`) is static files
  only. It has no application server and no database, so form input there has
  nowhere to go: there is nothing to inject into. Its risks are XSS in the
  browser and a misconfigured web server.

## The package

| Risk | Defense | Checked by |
| --- | --- | --- |
| XSS through props | All text is rendered by React (escaped). No `innerHTML`, `dangerouslySetInnerHTML`, `eval` or `new Function` anywhere in the source. `javascript:` URLs are blocked by React 19 (minimum peer). | `test/security.test.tsx` (classic payloads into every text and link prop, mutation-checked), `test/package.test.ts` (banned APIs), CodeQL `security-extended` |
| Vulnerable dependencies | One runtime dependency (`class-variance-authority`). | `pnpm audit --prod` in CI and before every release; weekly `pnpm audit`; Dependency Review blocks PRs adding vulnerable or GPL/AGPL packages |
| Malicious new versions (worms, hijacked maintainers) | `minimumReleaseAge: 4320` (no version younger than 3 days), `trustPolicy: no-downgrade` (refuse versions that lost provenance), `strictDepBuilds` + `allowBuilds` (only esbuild may run install scripts). Dependabot uses a 7–14 day cooldown. | `pnpm install --frozen-lockfile` in CI verifies the whole lockfile against these policies |
| Compromised GitHub Action | Every action pinned to a full commit SHA; least-privilege `permissions` per job; `persist-credentials: false` where nothing is pushed; timeouts and concurrency limits. | `zizmor --persona=pedantic` (no findings) |
| Stolen npm token / tampered release | Publishing only from the release workflow, with npm provenance (signed link from the package to this repository and commit), in a protected `npm` environment. | npm shows the provenance badge; see `docs/release.md` |
| Leaking files | `files` whitelist: `dist`, `README.md`, `LICENSE` only (114 files, about 81 kB, no source maps or configs). | `pnpm pack` review |

Recommended next steps for the owner (account settings, not code):

- Enable 2FA on npm (required for publishing) and GitHub.
- After the first publish, switch npm to **trusted publishing** (OIDC) for
  this repository and `release.yml`, then delete the `NPM_TOKEN` secret: no
  long-lived token is left to steal.
- In GitHub: enable private vulnerability reporting, secret scanning with push
  protection, and a branch protection rule on `main` requiring the CI and
  Security checks; add required reviewers to the `npm` environment.

## The demo site

| Risk | Defense | Checked by |
| --- | --- | --- |
| Injected script running in a page | A strict per-page Content Security Policy: scripts only from the site itself or inline scripts with a known SHA-256 hash; no `unsafe-inline`/`unsafe-eval`; `object-src 'none'`, `base-uri 'none'`. | `apps/docs/scripts/check-csp.ts` on every build; browser test: injected `<img onerror>`, `<svg onload>`, `<script>` and `javascript:` links did not run |
| Forms sending data somewhere | `form-action 'none'`: the browser refuses to submit any form, to this site or another. | Browser test: a form posting to another origin was blocked |
| Requests with a body reaching the server | Nginx answers only `GET`/`HEAD`; everything else is `405`. Body size limit 1 kB, short timeouts. | `curl` against the real config: POST with script/SQL payloads → 405 |
| Exposed files, traversal | Hidden files denied (`.env`, `.git` → 403); traversal rejected (400); no directory listing. | `curl` checks |
| Clickjacking, sniffing, downgrade | `frame-ancestors 'none'`, `X-Content-Type-Options: nosniff`, HSTS, `Referrer-Policy`, `Permissions-Policy`, COOP. Headers are in one snippet included in every location (Nginx drops inherited `add_header` lines otherwise). | `nginx -t` and `curl -I` |
| Third-party requests | Fonts are self-hosted on the site and in Storybook; no analytics or CDNs. | CSP `default-src 'self'` with zero violations |

Config: `deploy/nginx/pixel-atelier.conf` and `deploy/nginx/security-headers.conf`.

## Forms in apps with a server and a database

The kit's form components are the user interface only. Whatever they collect
must be treated as hostile **on the server**; nothing in the browser (field
`required`, `type="email"`, client validation) is a security control, because
an attacker can send any request directly. For the demo apps that do have a
backend:

1. **Validate on the server** with a schema (for example Zod or Valibot):
   types, lengths, formats, allowed values. Reject everything else. Re-use the
   same schema on the client only for nicer error messages.
2. **Never build queries from strings.** Use parameterized queries or an ORM
   (Prisma, Drizzle) for Postgres and MySQL; with MongoDB, validate types so an
   object like `{ "$gt": "" }` can never reach a query (operator injection).
3. **Escape on output, not on input.** React escapes text. Never put user
   content into `dangerouslySetInnerHTML`; if rich text is required, sanitize
   it with DOMPurify on the server.
4. **Protect state-changing requests**: `SameSite=Lax` (or `Strict`) cookies,
   CSRF tokens or Server Actions' built-in origin checks, and `POST` only.
5. **Limit abuse**: rate limiting per IP and per account (Nginx `limit_req` or
   the app), request body size limits, and timeouts; a CAPTCHA only where bots
   are a real problem.
6. **Files**: check type by content (not extension), limit size, store outside
   the web root with random names, never execute them.
7. **Least privilege**: each project's database user can only touch its own
   database; secrets in `.env` on the server, never in Git; database ports are
   not published (already the rule in the roadmap's Docker setup).
8. **Log and alert** on validation failures and rate-limit hits, and keep
   backups (already planned per project).
