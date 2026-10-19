// Generates dist/tokens.css, dist/theme.css and dist/tokens.json from src/tokens.ts.
import { mkdirSync, writeFileSync } from "node:fs";
import {
  accents,
  defaultAccent,
  fonts,
  gold,
  motion,
  onAccent,
  radius,
  shadows,
  type ThemeName,
  themes,
  type,
} from "../src/tokens.ts";

const out = new URL("../dist/", import.meta.url);
mkdirSync(out, { recursive: true });

const alpha = (hex: string, a: number) =>
  `color-mix(in srgb, ${hex} ${Math.round(a * 100)}%, transparent)`;

function themeVars(t: ThemeName) {
  const v: string[] = [`color-scheme: ${t};`];
  for (const [k, val] of Object.entries(themes[t])) v.push(`--pa-${k}: ${val};`);
  shadows[t].forEach((s, i) => {
    v.push(`--pa-shadow-${i + 1}: ${s};`);
  });
  v.push(`--pa-on-accent: ${onAccent[t]};`);
  v.push(...accentVars(defaultAccent, t));
  return v;
}
function accentVars(name: keyof typeof accents, t: ThemeName) {
  const [a, h] = accents[name][t];
  return [
    `--pa-accent: ${a};`,
    `--pa-accent-hover: ${h};`,
    `--pa-accent-subtle: ${alpha(a, 0.12)};`,
  ];
}
const block = (sel: string, lines: string[], indent = "") =>
  `${indent}${sel} {\n${lines.map((l) => `${indent}  ${l}`).join("\n")}\n${indent}}\n`;

const statics: string[] = [];
for (const [k, v] of Object.entries(fonts)) statics.push(`--pa-font-${k}: ${v};`);
for (const [k, v] of Object.entries(radius)) statics.push(`--pa-radius-${k}: ${v};`);
for (const [k, v] of Object.entries(motion.duration))
  statics.push(`--pa-duration-${k}: ${v};`);
for (const [k, v] of Object.entries(motion.ease)) statics.push(`--pa-ease-${k}: ${v};`);
for (const [i, c] of gold.entries()) statics.push(`--pa-gold-${(i + 1) * 100}: ${c};`);

let css = `/* Pixel Atelier tokens. Generated from src/tokens.ts; do not edit. */\n\n`;
css += `/* Dark is the default; set data-theme="light" (or "system") on any element. */\n`;
css += block(":root", statics);
css += block(':root,\n[data-theme="dark"]', themeVars("dark"));
css += block('[data-theme="light"]', themeVars("light"));
css += `@media (prefers-color-scheme: light) {\n${block('[data-theme="system"]', themeVars("light"), "  ")}}\n`;
css += `\n/* Accent themes: data-accent="jade" | "iris" | "ember" (gold is the default). */\n`;
for (const name of Object.keys(accents) as (keyof typeof accents)[]) {
  if (name === defaultAccent) continue;
  css += block(`[data-accent="${name}"]`, accentVars(name, "dark"));
  css += block(
    `[data-theme="light"][data-accent="${name}"],\n[data-theme="light"] [data-accent="${name}"]`,
    accentVars(name, "light"),
  );
  css += `@media (prefers-color-scheme: light) {\n${block(
    `[data-theme="system"][data-accent="${name}"],\n  [data-theme="system"] [data-accent="${name}"]`,
    accentVars(name, "light"),
    "  ",
  )}}\n`;
}
writeFileSync(new URL("tokens.css", out), css);

// Tailwind v4 theme: utilities named after the tokens, all prefixed with `pa-`
// so they never clash with an app's own theme (bg-pa-surface, text-pa-muted…).
const colorNames = [
  ...Object.keys(themes.dark),
  "on-accent",
  "accent",
  "accent-hover",
  "accent-subtle",
];
const th: string[] = [];
for (const k of colorNames)
  if (k !== "scrim") th.push(`--color-pa-${k}: var(--pa-${k});`);
th.push("--color-pa-scrim: var(--pa-scrim);");
for (const [i] of gold.entries())
  th.push(`--color-pa-gold-${(i + 1) * 100}: var(--pa-gold-${(i + 1) * 100});`);
for (const k of Object.keys(fonts)) th.push(`--font-pa-${k}: var(--pa-font-${k});`);
for (const k of Object.keys(radius)) th.push(`--radius-pa-${k}: var(--pa-radius-${k});`);
for (const i of [1, 2, 3]) th.push(`--shadow-pa-${i}: var(--pa-shadow-${i});`);
for (const k of Object.keys(motion.ease)) th.push(`--ease-pa-${k}: var(--pa-ease-${k});`);
for (const [k, [size, lh, ls, w]] of Object.entries(type)) {
  th.push(`--text-pa-${k}: ${size};`);
  th.push(`--text-pa-${k}--line-height: ${lh};`);
  th.push(`--text-pa-${k}--letter-spacing: ${ls};`);
  th.push(`--text-pa-${k}--font-weight: ${w};`);
}
let theme = `/* Pixel Atelier Tailwind v4 theme. Generated from src/tokens.ts; do not edit.\n   Use after \`@import "tailwindcss";\`. */\n\n@import "./tokens.css";\n\n`;
theme += block("@theme inline", th);
theme += `
/* Motion: the pixel effects read these, and reduced motion turns them off. */
@utility duration-pa-* {
  transition-duration: --value(--pa-duration-*);
}
`;
// Durations are not a Tailwind theme namespace, so map them by hand.
theme = theme.replace(
  /@utility duration-pa-\* \{[\s\S]*?\}\n/,
  Object.keys(motion.duration)
    .map(
      (k) =>
        `@utility duration-pa-${k} {\n  transition-duration: var(--pa-duration-${k});\n}\n`,
    )
    .join(""),
);
writeFileSync(new URL("theme.css", out), theme);

writeFileSync(
  new URL("tokens.json", out),
  `${JSON.stringify({ themes, onAccent, accents, gold, shadows, radius, fonts, type, motion }, null, 2)}\n`,
);
console.log("tokens: wrote dist/tokens.css, dist/theme.css, dist/tokens.json");
