// Builds the Pixel Atelier logo files from one pixel grid.
import fs from 'node:fs';
import opentype from 'opentype.js';
import { chromium } from 'playwright';
import pngToIco from 'png-to-ico';

const OUT = process.argv[2];
const F = 'node_modules/geist/dist/fonts/geist-sans/';
const medium = opentype.parse(fs.readFileSync(F + 'Geist-Medium.ttf'));
const light = opentype.parse(fs.readFileSync(F + 'Geist-Light.ttf'));

// 8 x 8: a solid tile with a negative-space "P"; its bottom-right corner
// breaks up into loose pixels, one of them in the accent color (the kit's
// hover effect).
const GRID = [
  '########',
  '#....###',
  '#..##.##',
  '#..##.##',
  '#....###',
  '#..####.',
  '#..##.A.',
  '####.#..',
];
const C = {
  dark: { bg: '#0d0d0f', ink: '#f2efe8', acc: '#d4b072' },
  light: { bg: '#f5f2ec', ink: '#151514', acc: '#9a7232' },
};

// Pixels as one path per color. gap: seam between squares, in cell units.
function cells(unit, gap, ox = 0, oy = 0) {
  const ink = [], acc = [];
  const s = +(unit * (1 - gap)).toFixed(3);
  GRID.forEach((row, y) => [...row].forEach((c, x) => {
    if (c === '.') return;
    (c === 'A' ? acc : ink).push(`M${ox + x * unit} ${oy + y * unit}h${s}v${s}h-${s}z`);
  }));
  return { ink: ink.join(''), acc: acc.join('') };
}
function paths(p, ink, acc) {
  return `<g shape-rendering="crispEdges"><path fill="${ink}" d="${p.ink}"/><path fill="${acc}" d="${p.acc}"/></g>`;
}
const svg = (w, h, body, extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"${extra}>${body}</svg>\n`;

const files = {};
const MARK = 80; // 8 cells x 10
const GAP = 0;

// Mark only.
const m = cells(10, GAP);
const markW = 8 * 10 - 10 * GAP;
for (const t of ['dark', 'light']) {
  files[`mark-on-${t}.svg`] = svg(markW, markW, `<title>Pixel Atelier</title>` + paths(m, C[t].ink, C[t].acc), ' role="img"');
}
files['mark-mono.svg'] = svg(markW, markW, `<title>Pixel Atelier</title>` + paths(m, 'currentColor', 'currentColor'), ' role="img"');

// Wordmark "pixel atelier" as outlines: "pixel" medium, "atelier" light.
const SIZE = 52;
function wordmark(x, baseline) {
  const a = medium.getPath('pixel', x, baseline, SIZE);
  const w1 = medium.getAdvanceWidth('pixel', SIZE) + light.getAdvanceWidth(' ', SIZE);
  const b = light.getPath('atelier', x + w1, baseline, SIZE);
  const width = w1 + light.getAdvanceWidth('atelier', SIZE);
  return { d: a.toPathData(2) + b.toPathData(2), width };
}
// Centre the x-height on the mark.
const xh = (medium.tables.os2.sxHeight / medium.unitsPerEm) * SIZE;
const baseline = markW / 2 + xh / 2;
const TX = markW + 26;
const wm = wordmark(TX, baseline);
// Descender of "p" goes below the mark; extend the box to fit it.
const desc = (-medium.descender / medium.unitsPerEm) * SIZE;
const logoW = Math.ceil(TX + wm.width);
const logoH = Math.ceil(Math.max(markW, baseline + desc * 0.85));
for (const t of ['dark', 'light']) {
  files[`logo-on-${t}.svg`] = svg(logoW, logoH,
    `<title>Pixel Atelier</title>` + paths(m, C[t].ink, C[t].acc) + `<path fill="${C[t].ink}" d="${wm.d}"/>`, ' role="img"');
}
files['logo-mono.svg'] = svg(logoW, logoH,
  `<title>Pixel Atelier</title>` + paths(m, 'currentColor', 'currentColor') + `<path fill="currentColor" d="${wm.d}"/>`, ' role="img"');

// Favicon: no seams (2 px per cell at 16 px), ink follows the browser theme.
const f = cells(2, 0);
files['favicon.svg'] = svg(16, 16,
  `<style>.i{fill:${C.light.ink}}.a{fill:${C.light.acc}}@media (prefers-color-scheme:dark){.i{fill:${C.dark.ink}}.a{fill:${C.dark.acc}}}</style>` +
  `<path class="i" d="${f.ink}"/><path class="a" d="${f.acc}"/>`, ' shape-rendering="crispEdges"');

for (const [n, s] of Object.entries(files)) fs.writeFileSync(`${OUT}/${n}`, s);

// Raster files.
const b = await chromium.launch();
const page = await b.newPage();
async function png(name, w, h, html) {
  await page.setViewportSize({ width: w, height: h });
  fs.writeFileSync(process.cwd()+'/tmp.html', `<style>@font-face{font-family:G;src:url(file://${process.cwd()}/${F}Geist-Light.ttf)}*{margin:0}body{width:${w}px;height:${h}px;overflow:hidden}</style>${html}`);
  await page.goto('file://'+process.cwd()+'/tmp.html');
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(200);
  await page.screenshot({ path: `${OUT}/${name}`, omitBackground: true });
}
const tile = (size, unit, gap, t) => {
  const o = (size - 8 * unit + unit * gap) / 2;
  return svg(size, size, `<rect width="${size}" height="${size}" fill="${C[t].bg}"/>` + paths(cells(unit, gap, o, o), C[t].ink, C[t].acc), ' shape-rendering="crispEdges"');
};
await png('apple-touch-icon.png', 180, 180, tile(180, 14, GAP, 'dark'));
await png('icon-512.png', 512, 512, tile(512, 40, GAP, 'dark'));
// ICO fallback: 32 px dark tile (3 px cells), 16 px transparent dark ink.
const tmp = OUT + '/../.ico-tmp';
fs.mkdirSync(tmp, { recursive: true });
const f16 = svg(16, 16, paths(cells(2, 0), C.light.ink, C.light.acc), ' shape-rendering="crispEdges"');
await page.setViewportSize({ width: 16, height: 16 });
await page.setContent(`<style>*{margin:0}</style>${f16}`);
await page.screenshot({ path: `${tmp}/16.png`, omitBackground: true });
await page.setViewportSize({ width: 32, height: 32 });
await page.setContent(`<style>*{margin:0}</style>${tile(32, 3, 0, 'dark')}`);
await page.screenshot({ path: `${tmp}/32.png` });
fs.writeFileSync(`${OUT}/favicon.ico`, await pngToIco([`${tmp}/16.png`, `${tmp}/32.png`]));
fs.rmSync(tmp, { recursive: true });

// GitHub social preview, 1280 x 640.
const logo = fs.readFileSync(`${OUT}/logo-on-dark.svg`, 'utf8').replace(/width="\d+" height="\d+"/, `width="${logoW * 1.6}" height="${logoH * 1.6}"`);
await png('social-preview.png', 1280, 640,
  `<div style="width:1280px;height:640px;background:${C.dark.bg};display:grid;place-content:center;justify-items:center;gap:40px">${logo}` +
  `<div style="font:300 26px/1 G,sans-serif;letter-spacing:.02em;color:#8a877f">Pixels, crafted with care.</div></div>`);
await b.close();
console.log(Object.keys(files).join(' '));
