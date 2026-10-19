# Releasing

Publishing runs in GitHub Actions (`.github/workflows/release.yml`) with
Changesets and npm provenance.

## One-time setup (owner)

1. Create the npm account (or organization) that will own `pixel-atelier`, and
   check the name is still free: `npm view pixel-atelier` should 404.
2. Create a granular access token on npmjs.com with "Read and write" for
   packages (and the right to create new packages), then add it to the GitHub
   repository as the secret `NPM_TOKEN` (Settings → Secrets and variables →
   Actions).
3. Create the GitHub environment `npm` (Settings → Environments) and add
   yourself as a required reviewer, so every publish needs your approval.
4. After the first publish, switch to npm trusted publishing (OIDC) for this
   repository and `release.yml`, and delete the `NPM_TOKEN` secret.

## Every release

1. In a PR, run `pnpm changeset`, pick `pixel-atelier`, the bump and a sentence.
2. Merge the PR. The workflow opens (or updates) a "Version packages" PR with
   the new version and `CHANGELOG.md`.
3. Merge "Version packages": the workflow builds and publishes to npm with
   provenance and creates the git tag.

The first release is prepared: `.changeset/first-stable-release.md` bumps
`pixel-atelier` from 0.0.0 to 1.0.0.
