// Reads the TSDoc of the built package (dist/**/*.d.ts) and returns, per
// component file, its exported components (description + example) and the
// props of each exported *Props interface. The kit's .d.ts files follow one
// shape (enforced by packages/ui/test/docs.test.ts), so a small line parser
// is enough and needs no TypeScript compiler API.
import { readdirSync, readFileSync } from "node:fs";

export interface Prop {
  name: string;
  type: string;
  optional: boolean;
  description: string;
  default?: string;
}
export interface Api {
  components: { name: string; description: string; example?: string }[];
  props: Record<string, { extends?: string; props: Prop[] }>;
}

function parseDoc(lines: string[]) {
  const text = lines
    .map((l) => l.replace(/^\s*\/?\*+\/?\s?/, "").replace(/\s*\*\/$/, ""))
    .join("\n")
    .trim();
  const tags: Record<string, string> = {};
  const parts = text.split(/\n(?=@\w+)/);
  const description = (parts[0]?.startsWith("@") ? "" : (parts.shift() ?? "")).trim();
  for (const p of parts) {
    const m = p.match(/^@(\w+)\s*([\s\S]*)$/);
    if (m?.[1]) tags[m[1]] = (m[2] ?? "").trim();
  }
  return { description, tags };
}

export function parseDts(src: string): Api {
  const lines = src.split("\n");
  const api: Api = { components: [], props: {} };
  const aliases = new Map<string, string>();
  for (const m of src.matchAll(/^export type (\w+) = ([^;]+);/gm))
    if (m[1] && m[2]) aliases.set(m[1], m[2].trim());
  let doc: string[] | null = null;
  let lastDoc: string[] | null = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] ?? "";
    if (/^\s*\/\*\*/.test(line)) {
      doc = [line];
      if (/\*\/\s*$/.test(line)) {
        lastDoc = doc;
        doc = null;
      }
      continue;
    }
    if (doc) {
      doc.push(line);
      if (/\*\/\s*$/.test(line)) {
        lastDoc = doc;
        doc = null;
      }
      continue;
    }
    const comp = line.match(/^export declare (?:const|function) ([A-Z]\w*)\b/);
    if (comp?.[1] && lastDoc) {
      const d = parseDoc(lastDoc);
      api.components.push({
        name: comp[1],
        description: d.description,
        example: d.tags.example?.replace(/^```\w*\n?|```$/g, "").trim(),
      });
    }
    const iface = line.match(/^export interface (\w+Props) (?:extends (.+?) )?\{/);
    if (iface?.[1]) {
      const props: Prop[] = [];
      let pdoc: string[] | null = null;
      for (i++; i < lines.length && !/^\}/.test(lines[i] ?? ""); i++) {
        const l = lines[i] ?? "";
        if (/^\s*\/\*\*/.test(l)) {
          pdoc = [l];
          while (!/\*\/\s*$/.test(lines[i] ?? "") && i < lines.length)
            pdoc.push(lines[++i] ?? "");
          continue;
        }
        const m = l.match(/^\s{2}("?[\w-]+"?)(\?)?:\s*(.+?);?\s*$/);
        if (m?.[1]) {
          let type = m[3] ?? "";
          // multi-line types
          while (
            !/;\s*$/.test(lines[i] ?? "") &&
            i + 1 < lines.length &&
            !/^\s{2}\S/.test(lines[i + 1] ?? "") &&
            !/^\}/.test(lines[i + 1] ?? "")
          ) {
            type += ` ${(lines[++i] ?? "").trim()}`;
          }
          const d = pdoc
            ? parseDoc(pdoc)
            : { description: "", tags: {} as Record<string, string> };
          props.push({
            name: m[1].replaceAll('"', ""),
            type: (aliases.get(type.replace(/;$/, "").trim()) ?? type)
              .replace(/;$/, "")
              .replace(/\s+/g, " "),
            optional: Boolean(m[2]),
            description: d.description,
            default: d.tags.default,
          });
          pdoc = null;
        }
      }
      api.props[iface[1]] = { extends: iface[2]?.replace(/,\s*$/, ""), props };
    }
    if (line.trim() && !line.trim().startsWith("*"))
      lastDoc = /^export|^\s*$/.test(line) && !comp ? lastDoc : null;
  }
  return api;
}

export function readApi(distDir: string) {
  const out: Record<string, Api> = {};
  for (const dir of ["components", "pixels"]) {
    for (const f of readdirSync(`${distDir}/${dir}`).filter((f) => f.endsWith(".d.ts"))) {
      out[`${dir}/${f.replace(/\.d\.ts$/, "")}`] = parseDts(
        readFileSync(`${distDir}/${dir}/${f}`, "utf8"),
      );
    }
  }
  return out;
}
