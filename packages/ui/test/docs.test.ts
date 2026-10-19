import { readdirSync, readFileSync } from "node:fs";

// Every public component and every prop it declares must carry a TSDoc
// comment, so editors show the description, the allowed values and the
// default on hover. This is a cheap textual check of src/components.
const dir = `${process.cwd()}/src/components`;
const files = readdirSync(dir).filter((f) => f.endsWith(".tsx") && !f.includes(".test."));

describe.each(files)("%s", (file) => {
  const src = readFileSync(`${dir}/${file}`, "utf8");
  const lines = src.split("\n");
  const docBefore = (i: number) => {
    let j = i - 1;
    while (j >= 0 && /^\s*(\/\/|@)/.test(lines[j] ?? "")) j--;
    return /\*\/\s*$/.test(lines[j] ?? "");
  };

  it("documents every exported component and variant helper", () => {
    const missing = lines.flatMap((line, i) =>
      /^export (const|function) [A-Z]\w*|^export const \w+Variants/.test(line) &&
      !docBefore(i)
        ? [line.trim()]
        : [],
    );
    expect(missing).toEqual([]);
  });

  it("documents every prop of its exported props interfaces", () => {
    const missing: string[] = [];
    let inProps = false;
    lines.forEach((line, i) => {
      if (/^export interface \w+Props\b/.test(line)) inProps = true;
      else if (inProps && /^}/.test(line)) inProps = false;
      else if (inProps && /^ {2}["\w-]+\??:/.test(line) && !docBefore(i))
        missing.push(line.trim());
    });
    expect(missing).toEqual([]);
  });
});
