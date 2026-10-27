import type { Metadata } from "next";
import NextLink from "next/link";
import { CodeBlock } from "@/components/docs/code-block";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Getting started",
  description:
    "Install Pixelbits, add the Tailwind v4 theme or the precompiled CSS, and use its React components, or copy their source with the shadcn CLI.",
  path: "/docs/",
});

export default function GettingStarted() {
  return (
    <article className="prose-pb grid max-w-3xl gap-6">
      <h1 className="text-pb-h1 text-pb-text">Getting started</h1>
      <p>
        Pixelbits is a React 19 UI kit: a calm, minimal base with pixel effects at the
        moment of interaction. Use it as an npm package, or copy single components into
        your project with the shadcn CLI.
      </p>

      <h2 className="mt-4 text-pb-h4 text-pb-text">1. Install</h2>
      <CodeBlock lang="bash" title="terminal" code="pnpm add pixelbits" />

      <h2 className="mt-4 text-pb-h4 text-pb-text">2. Add the styles</h2>
      <p>
        With <strong>Tailwind v4</strong>, import the theme after Tailwind. It adds the
        tokens, the <code>pb-</code> utilities (<code>bg-pb-surface</code>,{" "}
        <code>text-pb-muted</code>…) and tells Tailwind to scan the kit for the classes it
        uses.
      </p>
      <CodeBlock
        lang="css"
        title="app/globals.css"
        code={`@import "tailwindcss";\n@import "pixelbits/theme.css";`}
      />
      <p>
        Without Tailwind, import the precompiled stylesheet once (about 9 kB gzipped for
        every component):
      </p>
      <CodeBlock
        lang="tsx"
        title="app/layout.tsx"
        code={`import "pixelbits/styles.css";`}
      />

      <h2 className="mt-4 text-pb-h4 text-pb-text">3. Use components</h2>
      <p>
        Import each component from its own entry; anything you do not import is not in
        your bundle. Server components work for the static ones (Card, Table, Accordion,
        Skeleton…); interactive ones are marked <code>"use client"</code> inside the kit.
      </p>
      <CodeBlock
        title="app/page.tsx"
        code={`import { Button } from "pixelbits/button";\nimport { Field } from "pixelbits/field";\nimport { Input } from "pixelbits/input";\n\nexport default function Page() {\n  return (\n    <form>\n      <Field label="Email" required>\n        <Input type="email" />\n      </Field>\n      <Button variant="primary" type="submit">Subscribe</Button>\n    </form>\n  );\n}`}
      />

      <h2 className="mt-4 text-pb-h4 text-pb-text">Theme, accent and direction</h2>
      <p>
        Dark is the default. Set <code>data-theme="light"</code> (or <code>"system"</code>
        ) on <code>&lt;html&gt;</code> or on any element, and{" "}
        <code>data-accent="platinum" | "emerald" | "sapphire" | "ruby" | "amethyst"</code>{" "}
        to change the accent. Components use logical properties, so <code>dir="rtl"</code>{" "}
        just works — see the{" "}
        <NextLink href="/fa/" className="text-pb-accent underline underline-offset-4">
          Persian page
        </NextLink>
        .
      </p>
      <CodeBlock
        lang="html"
        code={`<html lang="en" data-theme="light" data-accent="emerald">`}
      />

      <h2 className="mt-4 text-pb-h4 text-pb-text">Copy the source instead (shadcn)</h2>
      <p>
        Every component is also a shadcn registry item. The CLI copies its source (and the
        shared base) into <code>components/pixelbits</code>, so you own and can edit the
        code.
      </p>
      <CodeBlock
        lang="bash"
        title="terminal"
        code={`npx shadcn add ${site.url}/r/button.json`}
      />
      <CodeBlock
        lang="css"
        title="app/globals.css"
        code={`@import "tailwindcss";\n@import "../components/pixelbits/pixelbits.css";`}
      />

      <h2 className="mt-4 text-pb-h4 text-pb-text">Fonts</h2>
      <p>
        The kit reads two CSS variables, <code>--pb-font-sans</code> and{" "}
        <code>--pb-font-mono</code>; without them the system font is used. Self-host your
        fonts (for example with <code>next/font/local</code>) and point the variables at
        them:
      </p>
      <CodeBlock
        lang="css"
        title="app/globals.css"
        code={`:root {\n  --pb-font-sans: var(--font-geist-sans), system-ui, sans-serif;\n  --pb-font-mono: var(--font-geist-mono), ui-monospace, monospace;\n}`}
      />
    </article>
  );
}
