import { chromium } from 'playwright';
const dir = process.argv[2], scale = +(process.argv[3] || 1), only = process.argv[4];
const b = await chromium.launch();
for (const page of ['tokens', 'core', 'signature']) for (const theme of ['dark', 'light']) {
  if (only && !`${page}-${theme}`.includes(only)) continue;
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: scale });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.goto(`file://${dir}/mockups.html?page=${page}&theme=${theme}`);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  await p.screenshot({ path: `${dir}/${page}-${theme}.png`, fullPage: true });
  if (errs.length) console.log(page, theme, errs);
  await p.close();
}
await b.close();
