import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { readApi } from "./api.ts";
import { buildRegistry } from "./registry.ts";

const dist = fileURLToPath(
  new URL("../../../packages/ui/dist/", import.meta.url),
);
mkdirSync(fileURLToPath(new URL("../content/", import.meta.url)), {
  recursive: true,
});
writeFileSync(
  fileURLToPath(new URL("../content/api.json", import.meta.url)),
  `${JSON.stringify(readApi(dist), null, 1)}\n`,
);
const n = buildRegistry(
  fileURLToPath(new URL("../public/r/", import.meta.url)),
);
const sb = fileURLToPath(
  new URL("../../storybook/storybook-static/", import.meta.url),
);
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
