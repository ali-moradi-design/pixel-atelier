import type { Metadata } from "next";
import { CodeBlock } from "@/components/code-block";

export const metadata: Metadata = { title: "Getting started" };

export default function GettingStarted() {
  return (
    <article className="prose-pa grid max-w-3xl gap-6">
      <h1 className="text-pa-h1 text-pa-text">Getting started</h1>
      <p>
        Pixel Atelier is a React 19 UI kit: a calm, minimal base with pixel effects at the
        moment of interaction. Use it as an npm package, or copy single components into
        your project with the shadcn CLI.
      </p>

      <h2 className="mt-4 text-pa-h4 text-pa-text">1. Install</h2>
      <CodeBlock lang="bash" title="terminal" code="pnpm add pixel-atelier" />

      <h2 className="mt-4 text-pa-h4 text-pa-text">2. Add the styles</h2>
      <p>
        With <strong>Tailwind v4</strong>, import the theme after Tailwind. It adds the
        tokens, the <code>pa-</code> utilities (<code>bg-pa-surface</code>,{" "}
        <code>text-pa-muted</code>…) and tells Tailwind to scan the kit for the classes it
        uses.
      </p>
      <CodeBlock
        lang="css"
        title="app/globals.css"
        code={`@import "tailwindcss";\n@import "pixel-atelier/theme.css";`}
      />
      <p>
        Without Tailwind, import the precompiled stylesheet once (about 9 kB gzipped for
        every component):
      </p>
      <CodeBlock
        lang="tsx"
        title="app/layout.tsx"
        code={`import "pixel-atelier/styles.css";`}
      />

      <h2 className="mt-4 text-pa-h4 text-pa-text">3. Use components</h2>
      <p>
        Import each component from its own entry; anything you do not import is not in
        your bundle. Server components work for the static ones (Card, Table, Accordion,
        Skeleton…); interactive ones are marked <code>"use client"</code> inside the kit.
      </p>
      <CodeBlock
        title="app/page.tsx"
        code={`import { Button } from "pixel-atelier/button";\nimport { Field } from "pixel-atelier/field";\nimport { Input } from "pixel-atelier/input";\n\nexport default function Page() {\n  return (\n    <form>\n      <Field label="Email" required>\n        <Input type="email" />\n      </Field>\n      <Button variant="primary" type="submit">Subscribe</Button>\n    </form>\n  );\n}`}
      />

      <h2 className="mt-4 text-pa-h4 text-pa-text">Theme, accent and direction</h2>
      <p>
        Dark is the default. Set <code>data-theme="light"</code> (or <code>"system"</code>
        ) on <code>&lt;html&gt;</code> or on any element, and{" "}
        <code>data-accent="jade" | "iris" | "ember"</code> to change the accent.
        Components use logical properties, so <code>dir="rtl"</code> just works — see the{" "}
        <a href="/fa/" className="text-pa-accent underline underline-offset-4">
          Persian demo
        </a>
        .
      </p>
      <CodeBlock
        lang="html"
        code={`<html lang="en" data-theme="light" data-accent="jade">`}
      />

      <h2 className="mt-4 text-pa-h4 text-pa-text">Copy the source instead (shadcn)</h2>
      <p>
        Every component is also a shadcn registry item. The CLI copies its source (and the
        shared base) into <code>components/pixel-atelier</code>, so you own and can edit
        the code.
      </p>
      <CodeBlock
        lang="bash"
        title="terminal"
        code="npx shadcn add https://pixel-atelier.ali-moradi-develop.com/r/button.json"
      />
      <CodeBlock
        lang="css"
        title="app/globals.css"
        code={`@import "tailwindcss";\n@import "../components/pixel-atelier/pixel-atelier.css";`}
      />

      <h2 className="mt-4 text-pa-h4 text-pa-text">Fonts</h2>
      <p>
        The kit is designed with Geist and Geist Mono. Load them however you like and set{" "}
        <code>--pa-font-sans</code> and <code>--pa-font-mono</code>; without them the
        system font is used.
      </p>
    </article>
  );
}
