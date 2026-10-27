import NextLink from "next/link";
import { Badge } from "pixelbits/badge";
import { Button } from "pixelbits/button";
import { Marquee } from "pixelbits/marquee";
import { SpotlightCard } from "pixelbits/spotlight-card";
import { TextScramble } from "pixelbits/text-scramble";
import { CodeBlock } from "@/components/docs/code-block";
import { Mark } from "@/components/layout/logo";
import { catalog, groups } from "@/lib/catalog";
import { JsonLd, softwareLd, websiteLd } from "@/lib/seo";
import { site } from "@/lib/site";

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
      <JsonLd data={{ "@graph": [websiteLd, softwareLd] }} />
      <section className="pb-container grid gap-12 pt-20 pb-16 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:pt-28">
        <div className="grid gap-7">
          <Badge variant="accent" dot className="w-fit">
            v1.0 · {catalog.length} components
          </Badge>
          <h1 className="text-pb-display font-light text-balance">
            <TextScramble text="Pixels, crafted with care." />
          </h1>
          <p className="max-w-xl text-pb-body-lg text-pb-muted">
            A calm React UI kit with a luxurious, minimal base. Its pixel effects appear
            only when you interact — and every one of them also runs on keyboard focus.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="primary" size="lg" roll>
              <NextLink href="/docs/">Get started</NextLink>
            </Button>
            <Button asChild variant="outline" size="lg" roll>
              <NextLink href="/docs/button/">Browse components</NextLink>
            </Button>
          </div>
        </div>
        <SpotlightCard className="grid aspect-square place-items-center">
          <Mark className="w-1/2" />
        </SpotlightCard>
      </section>
      <Marquee
        aria-label="Built with"
        className="border-y border-pb-border py-5 text-2xl font-light text-pb-muted"
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
            <i className="size-2 bg-pb-accent" />
          </span>
        ))}
      </Marquee>
      <section className="pb-container grid gap-6 py-20 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="grid content-start gap-2 border-t border-pb-border pt-5"
          >
            <h2 className="text-[0.9375rem] font-medium">{f.title}</h2>
            <p className="text-[0.8125rem] leading-relaxed text-pb-muted">{f.text}</p>
          </div>
        ))}
      </section>
      <section className="pb-container grid gap-6 pb-20 lg:grid-cols-2">
        <CodeBlock title="npm" lang="bash" code="pnpm add pixelbits" />
        <CodeBlock
          title="or copy the source"
          lang="bash"
          code={`npx shadcn add ${site.url}/r/button.json`}
        />
      </section>
      <section className="pb-container pb-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <div key={g} className="grid content-start gap-3">
              <h2 className="font-pb-mono text-[0.6875rem] uppercase tracking-[0.14em] text-pb-accent">
                {g}
              </h2>
              <ul className="grid gap-1.5 text-sm">
                {catalog
                  .filter((c) => c.group === g)
                  .map((c) => (
                    <li key={c.slug}>
                      <NextLink
                        href={`/docs/${c.slug}/`}
                        className="text-pb-muted transition-colors hover:text-pb-text"
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
