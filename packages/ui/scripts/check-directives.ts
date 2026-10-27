// After tsdown: every source file that starts with "use client" must still
// start with it in dist/. tsdown's warning about the directive is muted in
// tsdown.config.ts, so this is what catches a real loss.
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const src = join(root, "src");
const missing: string[] = [];

for (const entry of readdirSync(src, { recursive: true, withFileTypes: true })) {
  if (
    !entry.isFile() ||
    !/\.tsx?$/.test(entry.name) ||
    /\.(test|stories)\./.test(entry.name)
  )
    continue;
  const file = join(entry.parentPath, entry.name);
  if (!readFileSync(file, "utf8").startsWith('"use client";')) continue;
  const out = join(root, "dist", relative(src, file)).replace(/\.tsx?$/, ".js");
  let built = "";
  try {
    built = readFileSync(out, "utf8");
  } catch {
    continue; // not an entry on its own (inlined into one that is checked)
  }
  if (!built.startsWith('"use client";')) missing.push(relative(root, out));
}

if (missing.length > 0) {
  console.error(`"use client" was lost in:\n  ${missing.join("\n  ")}`);
  process.exit(1);
}
