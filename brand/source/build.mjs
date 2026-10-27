// Builds the Pixelbits logo files from one pixel grid.
// Usage (from a folder with opentype.js, png-to-ico and playwright installed):
//   node /path/to/brand/source/build.mjs /path/to/brand
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import { chromium } from 'playwright';
import pngToIco from 'png-to-ico';

const OUT = process.argv[2];
const HERE = fileURLToPath(new URL('.', import.meta.url));
const story = opentype.parse(fs.readFileSync(`${HERE}StoryScript-Regular.ttf`).buffer);

// 13 x 9: a brilliant-cut gem lit from the top left. a-d are four gold tones
// (table, light crown, crown and pavilion, shadow); facet lines and the
// girdle are cut out. Same grid as apps/docs/components/layout/logo.tsx.
const GEM = [
  '...bbaaacc...',
  '..bb.aaa.cc..',
  '.bbb.aaa.ccc.',
  '.............',
  '.ccccc.ddddd.',
  '..cccc.dddd..',
  '...ccc.ddd...',
  '....cc.dd....',
  '.....c.d.....',
];
const W = 13;
const H = 9;
// Gold ramp (tokens): oklch(0.91 0.14 95) … oklch(0.5 0.097 79) as sRGB.
const GOLD = { 100: '#fee06b', 200: '#edc538', 300: '#caa22e', 400: '#a47e20', 500: '#815c12' };
const C = {
  dark: { bg: '#0d0d0f', ink: '#f2efe8', tones: { a: GOLD[100], b: GOLD[200], c: GOLD[300], d: GOLD[500] } },
  light: { bg: '#f6f4ef', ink: '#151514', tones: { a: GOLD[200], b: GOLD[300], c: GOLD[400], d: GOLD[500] } },
};

/** One path per tone. */
function gem(unit, ox = 0, oy = 0) {
  const d = { a: [], b: [], c: [], d: [] };
  GEM.forEach((row, y) =>
    [...row].forEach((t, x) => {
      if (t !== '.') d[t].push(`M${ox + x * unit} ${oy + y * unit}h${unit}v${unit}h-${unit}z`);
    }),
  );
  return d;
}
const paths = (g, tones) =>
  `<g shape-rendering="crispEdges">${Object.keys(g)
    .map((t) => `<path fill="${tones[t]}" d="${g[t].join('')}"/>`)
    .join('')}</g>`;
const mono = (g) => `<path fill="currentColor" shape-rendering="crispEdges" d="${Object.values(g).flat().join('')}"/>`;
const svg = (w, h, body, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"${extra}>${body}</svg>\n`;

const files = {};
const U = 8;
const markW = W * U;
const markH = H * U;
const m = gem(U);
const title = '<title>Pixelbits</title>';
for (const t of ['dark', 'light'])
  files[`mark-on-${t}.svg`] = svg(markW, markH, title + paths(m, C[t].tones), ' role="img"');
files['mark-mono.svg'] = svg(markW, markH, title + mono(m), ' role="img"');

// Wordmark "Pixelbits" in Story Script, as outlines.
const SIZE = 72;
const baseline = markH / 2 + ((story.tables.os2.sCapHeight / story.unitsPerEm) * SIZE) / 2;
const TX = markW + 22;
const word = story.getPath('Pixelbits', TX, baseline, SIZE);
const box = word.getBoundingBox();
const logoW = Math.ceil(box.x2 + 4);
const top = Math.min(0, Math.floor(box.y1 - 2));
const logoH = Math.ceil(Math.max(markH, box.y2 + 4)) - top;
const vb = (w, h) => `0 ${top} ${w} ${h}`;
const logo = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb(logoW, logoH)}" width="${logoW}" height="${logoH}" role="img">${title}${body}</svg>\n`;
for (const t of ['dark', 'light'])
  files[`logo-on-${t}.svg`] = logo(paths(m, C[t].tones) + `<path fill="${C[t].ink}" d="${word.toPathData(2)}"/>`);
files['logo-mono.svg'] = logo(mono(m) + `<path fill="currentColor" d="${word.toPathData(2)}"/>`);

// Favicon: 1 px per cell on a 16 px square, gem centered.
const fav = gem(1, 1.5, 3.5);
files['favicon.svg'] = svg(
  16,
  16,
  `<style>${['a', 'b', 'c', 'd'].map((t) => `.${t}{fill:${C.light.tones[t]}}`).join('')}@media (prefers-color-scheme:dark){${['a', 'b', 'c', 'd']
    .map((t) => `.${t}{fill:${C.dark.tones[t]}}`)
    .join('')}}</style>` +
    Object.keys(fav)
      .map((t) => `<path class="${t}" d="${fav[t].join('')}"/>`)
      .join(''),
  ' shape-rendering="crispEdges"',
);
for (const [n, s] of Object.entries(files)) fs.writeFileSync(`${OUT}/${n}`, s);

// Raster files.
const b = await chromium.launch();
const page = await b.newPage();
async function png(name, w, h, html, transparent = true) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<style>*{margin:0}body{width:${w}px;height:${h}px;overflow:hidden}</style>${html}`);
  await page.screenshot({ path: name, omitBackground: transparent });
}
const tile = (size, unit, t) => {
  const ox = (size - W * unit) / 2;
  const oy = (size - H * unit) / 2;
  return svg(size, size, `<rect width="${size}" height="${size}" fill="${C[t].bg}"/>` + paths(gem(unit, ox, oy), C[t].tones), ' shape-rendering="crispEdges"');
};
await png(`${OUT}/apple-touch-icon.png`, 180, 180, tile(180, 10, 'dark'), false);
await png(`${OUT}/icon-512.png`, 512, 512, tile(512, 30, 'dark'), false);
const tmp = `${OUT}/../.ico-tmp`;
fs.mkdirSync(tmp, { recursive: true });
await png(`${tmp}/16.png`, 16, 16, svg(16, 16, paths(gem(1, 1.5, 3.5), C.light.tones)));
await png(`${tmp}/32.png`, 32, 32, tile(32, 2, 'dark'), false);
fs.writeFileSync(`${OUT}/favicon.ico`, await pngToIco([`${tmp}/16.png`, `${tmp}/32.png`]));
fs.rmSync(tmp, { recursive: true });

// Social preview (GitHub, Open Graph), 1280 x 640.
const big = files['logo-on-dark.svg'].replace(/width="\d+" height="\d+"/, `width="${logoW * 1.5}" height="${logoH * 1.5}"`);
await png(
  `${OUT}/social-preview.png`,
  1280,
  640,
  `<div style="width:1280px;height:640px;background:radial-gradient(60% 80% at 50% 40%,#1b1b1f,#0d0d0f);display:grid;place-content:center;justify-items:center;gap:36px">${big}` +
    `<div style="font:300 26px/1 system-ui,sans-serif;letter-spacing:.04em;color:#949088">React UI kit · pixels, crafted with care</div></div>`,
  false,
);
await b.close();
console.log(Object.keys(files).join(' '));
