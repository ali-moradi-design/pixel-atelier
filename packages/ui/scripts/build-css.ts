// Writes the package CSS next to the compiled JS:
//   dist/tokens.css  CSS variables only
//   dist/theme.css   tokens + Tailwind theme + pixel CSS + @source for Tailwind v4 apps
//   dist/styles.css  everything precompiled, for apps without Tailwind
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const tokensDir = require
  .resolve("@pixel-atelier/tokens/tokens.css")
  .replace(/tokens\.css$/, "");
const dist = new URL("../dist/", import.meta.url);

copyFileSync(`${tokensDir}tokens.css`, new URL("tokens.css", dist));
const theme = readFileSync(`${tokensDir}theme.css`, "utf8");
const pixels = readFileSync(
  new URL("../src/styles/pixels.css", import.meta.url),
  "utf8",
);
writeFileSync(
  new URL("theme.css", dist),
  `${theme}\n/* Scan the compiled components for the utilities they use. */\n@source "./";\n\n${pixels}`,
);

// Compiled with the PostCSS plugin (no CLI and its file watcher).
const tailwind = (await import("@tailwindcss/postcss")).default;
const postcss = (await import("postcss")).default;
const input = new URL("../src/styles/standalone.css", import.meta.url);
const result = await postcss([
  tailwind({ optimize: { minify: true } }),
]).process(readFileSync(input, "utf8"), {
  from: fileURLToPath(input),
});
writeFileSync(new URL("styles.css", dist), result.css);
console.log("css: wrote dist/tokens.css, dist/theme.css, dist/styles.css");
