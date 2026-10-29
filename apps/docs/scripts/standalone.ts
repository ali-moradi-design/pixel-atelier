// After `next build`: completes .next/standalone so it runs on its own
// (`node apps/docs/server.js`). Next.js leaves public/ and .next/static out
// of it (see the Next.js docs for `output: "standalone"`).
import { cpSync } from "node:fs";
import { fileURLToPath } from "node:url";

const app = fileURLToPath(new URL("../", import.meta.url));
const target = `${app}.next/standalone/apps/docs/`;
cpSync(`${app}public`, `${target}public`, { recursive: true });
cpSync(`${app}.next/static`, `${target}.next/static`, { recursive: true });
console.log("standalone: public/ and .next/static copied");
