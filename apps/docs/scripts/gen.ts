// Runs before `next dev`, `next build` and `tsc`: makes sure the kit build is
// current, extracts the API docs from the built package,
// generates the shadcn registry, and copies the Storybook build and the brand
// files into public/.
import { execSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { readApi } from "./api.ts";
import { buildRegistry } from "./registry.ts";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const dist = join(root, "packages/ui/dist/");

/** Newest modification time of any file under a folder. */
function newest(dir: string): number {
  let t = 0;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const s = statSync(p);
    t = Math.max(t, s.isDirectory() ? newest(p) : s.mtimeMs);
  }
  return t;
}

// The site imports the kit from packages/ui/dist. If that build is missing
// or older than the sources (for example after a `git pull`), the site would
// silently run on old CSS: rebuild the kit (and its tokens) first.
const builtCss = join(dist, "theme.css");
const stale =
  !existsSync(builtCss) ||
  statSync(builtCss).mtimeMs <
    Math.max(
      newest(join(root, "packages/ui/src")),
      newest(join(root, "packages/tokens/src")),
    );
if (stale) {
  console.log("docs: the kit build is missing or out of date, rebuilding it…");
  execSync("pnpm turbo run build --filter=pixelbits", { cwd: root, stdio: "inherit" });
}

mkdirSync(fileURLToPath(new URL("../content/", import.meta.url)), {
  recursive: true,
});
writeFileSync(
  fileURLToPath(new URL("../content/api.json", import.meta.url)),
  `${JSON.stringify(readApi(dist), null, 1)}\n`,
);
const n = buildRegistry(fileURLToPath(new URL("../public/r/", import.meta.url)));
const sb = fileURLToPath(new URL("../../storybook/storybook-static/", import.meta.url));
const target = fileURLToPath(new URL("../public/storybook/", import.meta.url));
rmSync(target, { recursive: true, force: true });
if (existsSync(sb)) cpSync(sb, target, { recursive: true });
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
