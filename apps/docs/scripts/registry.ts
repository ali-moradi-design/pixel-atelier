// Builds the shadcn registry (public/r/*.json) from the kit's own source, so
// `npx shadcn add <url>` copies exactly what the npm package ships. Nothing
// is maintained twice: every item is generated from packages/ui/src.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, normalize, relative } from "node:path";

const SRC = new URL("../../../packages/ui/src/", import.meta.url).pathname;
const SITE = process.env.SITE_URL ?? "https://pixel-atelier.ali-moradi-develop.com";
const TARGET = "components/pixel-atelier";

const read = (rel: string) => readFileSync(join(SRC, rel), "utf8");
/** Relative imports of a source file, as paths relative to src/. */
function localImports(rel: string) {
  const out: string[] = [];
  for (const m of read(rel).matchAll(/from "(\.{1,2}\/[^"]+)"/g))
    out.push(normalize(join(dirname(rel), m[1] ?? "")));
  return out;
}
/** Strip .ts/.tsx from relative imports: user projects rarely allow them. */
const portable = (code: string) => code.replace(/(from "\.{1,2}\/[^"]+)\.tsx?"/g, '$1"');
const targetOf = (rel: string) => `${TARGET}/${rel.replace(/^components\//, "ui/")}`;
const fileType = (rel: string) =>
  rel.startsWith("components/") ? "registry:ui" : "registry:lib";

export function buildRegistry(outDir: string) {
  mkdirSync(outDir, { recursive: true });
  const base = [
    ...readdirSync(join(SRC, "lib")).map((f) => `lib/${f}`),
    ...readdirSync(join(SRC, "pixels")).map((f) => `pixels/${f}`),
  ];
  const css = readFileSync(
    new URL("../../../packages/ui/dist/theme.css", import.meta.url),
    "utf8",
  )
    .replace(
      '@import "./tokens.css";',
      readFileSync(
        new URL("../../../packages/ui/dist/tokens.css", import.meta.url),
        "utf8",
      ),
    )
    .replace(/\/\* Scan the compiled components[\s\S]*?@source "\.\/";\n/, "");
  const items: Record<string, unknown>[] = [];
  const write = (item: Record<string, unknown>) => {
    const full = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      author: "Ali Moradi",
      ...item,
    };
    writeFileSync(
      join(outDir, `${item.name}.json`),
      `${JSON.stringify(full, null, 2)}\n`,
    );
    items.push(item);
  };
  write({
    name: "pixel-atelier-base",
    type: "registry:lib",
    title: "Pixel Atelier base",
    description:
      "Tokens, the Tailwind v4 theme, pixel CSS and the shared helpers. Import components/pixel-atelier/pixel-atelier.css after tailwindcss.",
    dependencies: ["class-variance-authority"],
    files: [
      ...base.map((rel) => ({
        path: rel,
        type: "registry:lib",
        target: targetOf(rel),
        content: portable(read(rel)),
      })),
      {
        path: "pixel-atelier.css",
        type: "registry:file",
        target: `${TARGET}/pixel-atelier.css`,
        content: css,
      },
    ],
  });
  for (const f of readdirSync(join(SRC, "components")).filter(
    (f) => f.endsWith(".tsx") && !f.includes(".test."),
  )) {
    const rel = `components/${f}`;
    const name = f.replace(/\.tsx$/, "");
    const siblings = localImports(rel)
      .filter((p) => p.startsWith("components/"))
      .map(
        (p) => `${SITE}/r/${p.replace(/^components\//, "").replace(/\.tsx$/, "")}.json`,
      );
    const description = read(rel)
      .match(/\/\*\*\n((?: \*.*\n)+?) \*\/\nexport (?:const|function) [A-Z]/)?.[1]
      ?.split("\n")
      .map((l) => l.replace(/^ \* ?/, ""))
      .join(" ")
      .split(/\s{2,}|@example/)[0]
      ?.trim();
    write({
      name,
      type: "registry:ui",
      title: name.replace(
        /(^|-)(\w)/g,
        (_, s: string, c: string) => (s ? " " : "") + c.toUpperCase(),
      ),
      description,
      dependencies: ["class-variance-authority"],
      registryDependencies: [`${SITE}/r/pixel-atelier-base.json`, ...siblings],
      files: [
        {
          path: rel,
          type: fileType(rel),
          target: targetOf(rel),
          content: portable(read(rel)),
        },
      ],
    });
  }
  writeFileSync(
    join(outDir, "registry.json"),
    `${JSON.stringify(
      {
        $schema: "https://ui.shadcn.com/schema/registry.json",
        name: "pixel-atelier",
        homepage: SITE,
        items: items.map(({ files, ...rest }) => ({
          ...rest,
          files: (files as { path: string; type: string; target: string }[]).map(
            ({ path, type, target }) => ({ path, type, target }),
          ),
        })),
      },
      null,
      2,
    )}\n`,
  );
  return items.length;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(`registry: ${buildRegistry(process.argv[2] ?? "public/r")} items`);
}
void relative;
