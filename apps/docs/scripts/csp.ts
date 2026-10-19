// After `next build`: gives every exported HTML page its own strict Content
// Security Policy in a <meta> tag. Inline scripts are allowed by their SHA-256
// hash only, so an injected <script> or event handler cannot run, even if
// something did manage to put markup into a page. Header-only directives
// (frame-ancestors) are set by Nginx; see deploy/nginx.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = new URL("../out/", import.meta.url).pathname;

function* pages(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (name === "storybook" || name === "r") continue; // separate app / JSON
    if (statSync(p).isDirectory()) yield* pages(p);
    else if (name.endsWith(".html")) yield p;
  }
}

export function policy(hashes: string[]) {
  return [
    "default-src 'self'",
    `script-src 'self' ${hashes.map((h) => `'sha256-${h}'`).join(" ")}`,
    "style-src 'self' 'unsafe-inline'", // style attributes (CSS variables); cannot run code
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'none'",
    "form-action 'none'", // demo forms never submit anywhere
    "upgrade-insecure-requests",
  ].join("; ");
}

let count = 0;
for (const file of pages(OUT)) {
  let html = readFileSync(file, "utf8");
  if (html.includes('http-equiv="Content-Security-Policy"')) continue;
  const hashes = new Set<string>();
  for (const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)) {
    hashes.add(
      createHash("sha256")
        .update(m[1] ?? "", "utf8")
        .digest("base64"),
    );
  }
  const meta = `<meta http-equiv="Content-Security-Policy" content="${policy([...hashes])}">`;
  html = html.replace(/<head>/, `<head>${meta}`);
  writeFileSync(file, html);
  count++;
}
console.log(`csp: ${count} pages`);
