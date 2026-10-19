// Writes the package CSS next to the compiled JS:
//   dist/tokens.css  CSS variables only
//   dist/theme.css   tokens + Tailwind theme + pixel CSS + @source for Tailwind v4 apps
//   dist/styles.css  everything precompiled, for apps without Tailwind
import { execFileSync } from "node:child_process";
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const tokensDir = require
  .resolve("@pixel-atelier/tokens/tokens.css")
  .replace(/tokens\.css$/, "");
const dist = new URL("../dist/", import.meta.url);

copyFileSync(`${tokensDir}tokens.css`, new URL("tokens.css", dist));
const theme = readFileSync(`${tokensDir}theme.css`, "utf8");
const pixels = readFileSync(new URL("../src/styles/pixels.css", import.meta.url), "utf8");
writeFileSync(
  new URL("theme.css", dist),
  `${theme}\n/* Scan the compiled components for the utilities they use. */\n@source "./";\n\n${pixels}`,
);

execFileSync(
  "tailwindcss",
  ["-i", "src/styles/standalone.css", "-o", "dist/styles.css", "--minify"],
  { stdio: "inherit" },
);
console.log("css: wrote dist/tokens.css, dist/theme.css, dist/styles.css");
