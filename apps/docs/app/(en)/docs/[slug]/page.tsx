import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "pixelbits/badge";
import { Tab, TabList, TabPanel, Tabs } from "pixelbits/tabs";
import { CodeBlock } from "@/components/code-block";
import { Md } from "@/components/md";
import apiJson from "@/content/api.json";
import { bySlug, catalog } from "@/lib/catalog";
import { demos } from "@/lib/demos";
import type { Api } from "@/scripts/api";

const api = apiJson as unknown as Record<string, Api>;
const SITE = "https://pixelbits.ali-moradi-develop.com";

export function generateStaticParams() {
  return catalog.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const entry = bySlug((await params).slug);
  const first = entry && api[entry.api]?.components[0];
  return {
    title: entry?.title,
    description: first?.description.split("\n\n")[0]?.replace(/\n/g, " "),
  };
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = bySlug(slug);
  if (!entry) notFound();
  const doc = api[entry.api] ?? { components: [], props: {} };
  const Demo = demos[slug];
  const source = readFileSync(
    join(process.cwd(), "demos", `${slug}.tsx`),
    "utf8",
  ).replace(/^"use client";\n/, "");
  const main = doc.components[0];
  const importPath = entry.api.startsWith("pixels/")
    ? "pixelbits/pixels"
    : `pixelbits/${slug}`;
  const i = catalog.indexOf(entry);
  const prev = catalog[i - 1];
  const next = catalog[i + 1];
  return (
    <article className="grid gap-10">
      <header className="grid gap-3">
        <Badge className="w-fit">{entry.group}</Badge>
        <h1 className="text-pb-h1">{entry.title}</h1>
        <div className="prose-pb grid max-w-2xl gap-3">
          {main && <Md text={main.description} />}
        </div>
      </header>

      <Tabs defaultValue="preview" keepMounted>
        <TabList aria-label="Example">
          <Tab value="preview">Preview</Tab>
          <Tab value="code">Code</Tab>
        </TabList>
        <TabPanel
          value="preview"
          className="grid min-h-64 place-items-center rounded-pb-lg border border-pb-border bg-pb-surface p-8 sm:p-12"
        >
          {Demo && <Demo />}
        </TabPanel>
        <TabPanel value="code">
          <CodeBlock code={source} title={`demos/${slug}.tsx`} />
        </TabPanel>
      </Tabs>

      <section className="grid gap-4" aria-labelledby="install">
        <h2 id="install" className="text-pb-h4">
          Installation
        </h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <CodeBlock
            title="npm: import"
            code={`import { ${entry.exports.join(", ")} } from "${importPath}";`}
          />
          <CodeBlock
            title="shadcn: copy the source"
            lang="bash"
            code={`npx shadcn add ${SITE}/r/${entry.api.startsWith("pixels/") ? "pixelbits-base" : entry.api.startsWith("blocks/") ? `block-${slug}` : slug}.json`}
          />
        </div>
      </section>

      <section className="grid gap-8" aria-labelledby="api">
        <h2 id="api" className="text-pb-h4">
          API
        </h2>
        {doc.components.map((c) => {
          const props =
            doc.props[`${c.name}Props`] ?? (c.name === "Sheet" ? undefined : undefined);
          return (
            <div key={c.name} className="grid gap-4">
              <h3 className="font-pb-mono text-sm text-pb-accent">{`<${c.name}>`}</h3>
              <div className="prose-pb grid max-w-2xl gap-3">
                <Md text={c.description} />
              </div>
              {c.example && <CodeBlock code={c.example} title="Example" />}
              {props && props.props.length > 0 && (
                <div className="overflow-x-auto rounded-pb-md border border-pb-border">
                  <table className="w-full min-w-[40rem] border-collapse text-[0.8125rem]">
                    <thead>
                      <tr className="border-b border-pb-border text-start font-pb-mono text-[0.65625rem] uppercase tracking-[0.1em] text-pb-muted">
                        <th scope="col" className="px-3 py-2.5 text-start font-medium">
                          Prop
                        </th>
                        <th scope="col" className="px-3 py-2.5 text-start font-medium">
                          Type
                        </th>
                        <th scope="col" className="px-3 py-2.5 text-start font-medium">
                          Default
                        </th>
                        <th scope="col" className="px-3 py-2.5 text-start font-medium">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {props.props.map((p) => (
                        <tr
                          key={p.name}
                          className="border-b border-pb-border align-top last:border-0"
                        >
                          <td className="px-3 py-3 font-pb-mono text-xs whitespace-nowrap">
                            {p.name}
                            {!p.optional && (
                              <span className="text-pb-accent" title="required">
                                *
                              </span>
                            )}
                          </td>
                          <td className="max-w-56 px-3 py-3 font-pb-mono text-xs break-words text-pb-muted">
                            {p.type}
                          </td>
                          <td className="px-3 py-3 font-pb-mono text-xs whitespace-nowrap text-pb-muted">
                            {p.default ?? "—"}
                          </td>
                          <td className="prose-pb grid gap-2 px-3 py-3 [&_p]:text-[0.8125rem]">
                            <Md text={p.description} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {props.extends && (
                    <p className="border-t border-pb-border px-3 py-2.5 text-xs text-pb-muted">
                      Also accepts every prop of{" "}
                      <code className="font-pb-mono">{props.extends}</code>.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>

      <nav
        aria-label="Pagination"
        className="flex justify-between gap-4 border-t border-pb-border pt-6 text-sm"
      >
        {prev ? (
          <a href={`/docs/${prev.slug}/`} className="text-pb-muted hover:text-pb-text">
            ← {prev.title}
          </a>
        ) : (
          <span />
        )}
        {next && (
          <a href={`/docs/${next.slug}/`} className="text-pb-muted hover:text-pb-text">
            {next.title} →
          </a>
        )}
      </nav>
    </article>
  );
}
