// Budget for the precompiled stylesheet (size-limit measures JS only).
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const LIMIT = 6 * 1024;
const size = gzipSync(
  readFileSync(new URL("../dist/styles.css", import.meta.url)),
).length;
console.log(`styles.css: ${(size / 1024).toFixed(2)} kB gzip (limit ${LIMIT / 1024} kB)`);
if (size > LIMIT) {
  console.error("styles.css is over its size budget");
  process.exit(1);
}
