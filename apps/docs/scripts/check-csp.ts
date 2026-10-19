// Fails if an exported page has no CSP or runs an inline script the CSP does
// not allow (by hash). Static check of out/, no browser needed.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const OUT = new URL("../out/", import.meta.url).pathname;
const problems: string[] = [];
let pages = 0;
const walk = (dir: string) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name === "storybook" || name === "r") continue;
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith(".html")) {
      pages++;
      const html = readFileSync(p, "utf8");
      const csp = html.match(
        /http-equiv="Content-Security-Policy" content="([^"]+)"/,
      )?.[1];
      if (!csp) {
        problems.push(`${p}: no CSP`);
        continue;
      }
      for (const d of ["object-src 'none'", "base-uri 'none'", "form-action 'none'"])
        if (!csp.includes(d)) problems.push(`${p}: missing ${d}`);
      if (/script-src[^;]*'unsafe-(inline|eval)'/.test(csp))
        problems.push(`${p}: unsafe script-src`);
      for (const m of html.matchAll(
        /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g,
      )) {
        const h = createHash("sha256")
          .update(m[1] ?? "", "utf8")
          .digest("base64");
        if (!csp.includes(`'sha256-${h}'`))
          problems.push(`${p}: inline script not in CSP`);
      }
      if (/\son[a-z]+=["']/.test(html.replace(/<script[\s\S]*?<\/script>/g, "")))
        problems.push(`${p}: inline event handler attribute`);
    }
  }
};
walk(OUT);
if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}
console.log(`csp check: ${pages} pages ok`);
