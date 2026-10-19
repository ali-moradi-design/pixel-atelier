import NextLink from "next/link";
import { Badge } from "pixel-atelier/badge";
import { Button } from "pixel-atelier/button";
import { Marquee } from "pixel-atelier/marquee";
import { SpotlightCard } from "pixel-atelier/spotlight-card";
import { TextScramble } from "pixel-atelier/text-scramble";
import { CodeBlock } from "@/components/code-block";
import { Mark } from "@/components/logo";
import { catalog, groups } from "@/lib/catalog";

const features = [
  {
    title: "Pixels at the moment of touch",
    text: "Hover, focus, open and loading get a pixel dissolve. At rest everything is calm.",
  },
  {
    title: "Tiny and tree-shaken",
    text: "One entry per component, no runtime CSS-in-JS, no animation library. Button is 2 kB.",
  },
  {
    title: "Built on the platform",
    text: "Native <dialog>, the popover API, real form inputs and <details>: accessible without heavy JS.",
  },
  {
    title: "Two ways to use it",
    text: "Install from npm, or copy any component's source into your project with the shadcn CLI.",
  },
];

export default function Home() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 pt-20 pb-16 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div className="grid gap-7">
          <Badge variant="accent" dot className="w-fit">
            v0.6 · {catalog.length} components
          </Badge>
          <h1 className="text-pa-display font-light text-balance">
            <TextScramble text="Pixels, crafted with care." />
          </h1>
          <p className="max-w-xl text-pa-body-lg text-pa-muted">
            A calm React UI kit with a luxurious, minimal base. Its pixel effects appear
            only when you interact — and every one of them also runs on keyboard focus.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="primary" size="lg" roll>
              <NextLink href="/docs/">Get started</NextLink>
            </Button>
            <Button asChild size="lg" roll>
              <NextLink href="/docs/button/">Browse components</NextLink>
            </Button>
          </div>
        </div>
        <SpotlightCard className="grid aspect-square place-items-center">
          <Mark className="size-1/2 text-pa-text" />
        </SpotlightCard>
      </section>
      <Marquee
        aria-label="Built with"
        className="border-y border-pa-border py-5 text-2xl font-light text-pa-muted"
      >
        {[
          "Tailwind v4",
          "React 19",
          "Native dialog",
          "Popover API",
          "Canvas effects",
          "shadcn registry",
          "RTL ready",
          "WCAG AA",
        ].map((t) => (
          <span key={t} className="flex items-center gap-10 whitespace-nowrap">
            {t}
            <i className="size-2 bg-pa-accent" />
          </span>
        ))}
      </Marquee>
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-20 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="grid content-start gap-2 border-t border-pa-border pt-5"
          >
            <h2 className="text-[0.9375rem] font-medium">{f.title}</h2>
            <p className="text-[0.8125rem] leading-relaxed text-pa-muted">{f.text}</p>
          </div>
        ))}
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 pb-20 sm:px-6 lg:grid-cols-2">
        <CodeBlock title="npm" lang="bash" code="pnpm add pixel-atelier" />
        <CodeBlock
          title="or copy the source"
          lang="bash"
          code="npx shadcn add https://pixel-atelier.ali-moradi-develop.com/r/button.json"
        />
      </section>
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <div key={g} className="grid content-start gap-3">
              <h2 className="font-pa-mono text-[0.6875rem] uppercase tracking-[0.14em] text-pa-accent">
                {g}
              </h2>
              <ul className="grid gap-1.5 text-sm">
                {catalog
                  .filter((c) => c.group === g)
                  .map((c) => (
                    <li key={c.slug}>
                      <NextLink
                        href={`/docs/${c.slug}/`}
                        className="text-pa-muted transition-colors hover:text-pa-text"
                      >
                        {c.title}
                      </NextLink>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
