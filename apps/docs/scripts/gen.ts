// Runs before `next build`/`next dev`: extracts the API docs from the built
// package, generates the shadcn registry, and copies the Storybook build.
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { readApi } from "./api.ts";
import { buildRegistry } from "./registry.ts";

const dist = new URL("../../../packages/ui/dist/", import.meta.url).pathname;
mkdirSync(new URL("../content/", import.meta.url), { recursive: true });
writeFileSync(
  new URL("../content/api.json", import.meta.url),
  `${JSON.stringify(readApi(dist), null, 1)}\n`,
);
const n = buildRegistry(new URL("../public/r/", import.meta.url).pathname);
const sb = new URL("../../storybook/storybook-static/", import.meta.url).pathname;
const target = new URL("../public/storybook/", import.meta.url).pathname;
rmSync(target, { recursive: true, force: true });
if (existsSync(sb)) cpSync(sb, target, { recursive: true });
// Brand assets (favicon, social preview) come from brand/.
for (const f of [
  "favicon.svg",
  "favicon.ico",
  "apple-touch-icon.png",
  "social-preview.png",
  "icon-512.png",
])
  cpSync(
    new URL(`../../../brand/${f}`, import.meta.url),
    new URL(`../public/${f}`, import.meta.url),
  );
console.log(
  `docs: api.json, ${n} registry items${existsSync(sb) ? ", storybook" : " (no storybook build found)"}`,
);
