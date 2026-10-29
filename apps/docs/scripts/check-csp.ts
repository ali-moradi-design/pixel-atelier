// Starts the built standalone server and fails if a page has no strict CSP
// or runs an inline script without the request's nonce (proxy.ts). Every
// page in the sitemap is checked; no browser needed.
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const server = fileURLToPath(
  new URL("../.next/standalone/apps/docs/server.js", import.meta.url),
);
const PORT = "3399";
const base = `http://127.0.0.1:${PORT}`;
const child = spawn(process.execPath, [server], {
  env: { ...process.env, PORT, HOSTNAME: "127.0.0.1", NODE_ENV: "production" },
  stdio: "ignore",
});

async function waitUp() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(`${base}/robots.txt`)).ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error("server did not start");
}

const problems: string[] = [];
try {
  await waitUp();
  const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => new URL(m[1] ?? "").pathname,
  );
  for (const path of paths) {
    const res = await fetch(base + path);
    const html = await res.text();
    const csp = res.headers.get("content-security-policy") ?? "";
    const nonce = csp.match(/'nonce-([^']+)'/)?.[1];
    if (res.status !== 200) problems.push(`${path}: HTTP ${res.status}`);
    if (!nonce) {
      problems.push(`${path}: no CSP nonce`);
      continue;
    }
    for (const d of [
      "object-src 'none'",
      "base-uri 'none'",
      "form-action 'none'",
      "frame-ancestors 'none'",
    ])
      if (!csp.includes(d)) problems.push(`${path}: missing ${d}`);
    if (/script-src[^;]*'unsafe-(inline|eval)'/.test(csp))
      problems.push(`${path}: unsafe script-src`);
    // every start tag, any letter case: scripts need the nonce, no tag may
    // carry an inline event handler (onclick=…)
    for (const m of html.matchAll(/<([a-z][\w-]*)\b([^>]*)>/gi)) {
      const tag = (m[1] ?? "").toLowerCase();
      const attrs = m[2] ?? "";
      if (/\son[a-z]+\s*=/i.test(attrs))
        problems.push(`${path}: inline event handler attribute on <${tag}>`);
      if (tag !== "script") continue;
      if (/type\s*=\s*["']?application\/(ld\+)?json/i.test(attrs)) continue; // data, never runs
      if (!attrs.includes(`nonce="${nonce}"`))
        problems.push(`${path}: script without the nonce`);
    }
  }
  console.log(`csp check: ${paths.length} pages`);
} finally {
  child.kill();
}
if (problems.length) {
  console.error([...new Set(problems)].join("\n"));
  process.exit(1);
}
console.log("csp check: ok");
