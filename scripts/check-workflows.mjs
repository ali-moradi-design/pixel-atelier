// Fails when a GitHub workflow file is not valid YAML or has no jobs.
// GitHub silently skips an invalid workflow (no red check), so this runs in
// `pnpm lint` and in the Security workflow, which still runs if ci.yml breaks.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { parseDocument } from "yaml";

const dir = new URL("../.github/workflows/", import.meta.url);
const files = readdirSync(dir).filter((f) => /\.ya?ml$/.test(f));
let failed = false;

for (const file of files) {
  const doc = parseDocument(readFileSync(new URL(file, dir), "utf8"), {
    uniqueKeys: true,
  });
  const problems = doc.errors.map((e) => e.message);
  const wf = doc.toJS() ?? {};
  if (!wf.on) problems.push('missing "on"');
  if (!wf.jobs || typeof wf.jobs !== "object") problems.push('missing "jobs"');
  for (const [id, job] of Object.entries(wf.jobs ?? {})) {
    if (!job?.uses && !job?.["runs-on"]) problems.push(`job "${id}": missing "runs-on"`);
    if (!job?.uses && !Array.isArray(job?.steps))
      problems.push(`job "${id}": missing "steps"`);
  }
  for (const p of problems) console.error(`${join(".github/workflows", file)}: ${p}`);
  if (problems.length) failed = true;
}

if (failed) process.exit(1);
console.log(`${files.length} workflow files are valid.`);
