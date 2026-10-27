import { accents, fonts, gold, motion, radius, themes, type } from "@pixelbits/tokens";
import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Design tokens",
  description:
    "The Pixelbits design tokens: OKLCH colors for dark and light themes, six luxury accents, type scale, radius and motion, as CSS variables and Tailwind v4 utilities.",
  path: "/docs/tokens/",
});

export default function Tokens() {
  const names = Object.keys(themes.dark) as (keyof typeof themes.dark)[];
  return (
    <article className="grid gap-12">
      <header className="prose-pb grid max-w-2xl gap-3">
        <h1 className="text-pb-h1 text-pb-text">Tokens</h1>
        <p>
          Every value is a CSS variable (<code>--pb-*</code>) with a dark and a light
          theme, and every color is written in <code>oklch()</code>, and a Tailwind v4
          utility (<code>bg-pb-surface</code>, <code>rounded-pb-md</code>,{" "}
          <code>text-pb-h2</code>…). All text and accent colors pass WCAG AA; a test
          checks it.
        </p>
      </header>
      <section className="grid gap-4">
        <h2 className="text-pb-h4">Colors</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {names.map((n) => (
            <div key={n} className="grid gap-1.5">
              <div
                className="h-16 rounded-pb-md border border-pb-border"
                style={{ background: `var(--pb-${n})` }}
              />
              <span className="text-xs">{n}</span>
              <span className="grid font-pb-mono text-[0.625rem] leading-relaxed text-pb-muted">
                <span>{themes.dark[n]}</span>
                <span>{themes.light[n]}</span>
              </span>
            </div>
          ))}
        </div>
      </section>
      <section className="grid gap-4">
        <h2 className="text-pb-h4">Accents</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(accents).map(([name, v]) => (
            <div
              key={name}
              data-accent={name}
              className="grid gap-2 rounded-pb-lg border border-pb-border bg-pb-surface p-4"
            >
              <div className="flex gap-1.5">
                <i className="h-10 flex-1 rounded-pb-sm bg-pb-accent" />
                <i className="h-10 flex-1 rounded-pb-sm bg-pb-accent-hover" />
                <i className="h-10 flex-1 rounded-pb-sm bg-pb-accent-subtle" />
              </div>
              <span className="text-sm">{name}</span>
              <span className="grid font-pb-mono text-[0.625rem] leading-relaxed text-pb-muted">
                <span>{v.dark[0]}</span>
                <span>{v.light[0]}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-1.5">
          {gold.map((g) => (
            <i key={g} className="h-6 flex-1" style={{ background: g }} title={g} />
          ))}
        </div>
      </section>
      <section className="grid gap-2">
        <h2 className="mb-2 text-pb-h4">Type</h2>
        {Object.entries(type).map(([name, [size, lh, ls, w]]) => (
          <div
            key={name}
            className="grid grid-cols-[6rem_1fr] items-baseline gap-4 border-b border-pb-border py-3 sm:grid-cols-[8rem_1fr_14rem]"
          >
            <span className="font-pb-mono text-xs text-pb-muted">{name}</span>
            <span
              className="truncate"
              style={{
                fontSize: size,
                lineHeight: lh,
                letterSpacing: ls,
                fontWeight: Number(w),
              }}
            >
              Pixels, crafted
            </span>
            <span className="hidden text-end font-pb-mono text-xs text-pb-muted sm:block">
              {size} · {lh} · {ls} · {w}
            </span>
          </div>
        ))}
        <p className="mt-2 text-xs text-pb-muted">
          Fonts: {fonts.sans.split(",")[0]} and {fonts.mono.split(",")[0]}.
        </p>
      </section>
      <section className="grid gap-6 sm:grid-cols-2">
        <div className="grid content-start gap-3">
          <h2 className="text-pb-h4">Radius</h2>
          <div className="flex flex-wrap gap-4">
            {Object.entries(radius).map(([n, v]) => (
              <div key={n} className="grid justify-items-center gap-1.5">
                <div
                  className="size-14 border border-pb-border-strong bg-pb-surface"
                  style={{ borderRadius: v }}
                />
                <span className="font-pb-mono text-[0.6875rem] text-pb-muted">
                  {n} · {v}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid content-start gap-3">
          <h2 className="text-pb-h4">Motion</h2>
          <ul className="grid gap-1.5 font-pb-mono text-xs text-pb-muted">
            {Object.entries(motion.duration).map(([n, v]) => (
              <li key={n}>
                duration-pb-{n} · {v}
              </li>
            ))}
            {Object.entries(motion.ease).map(([n, v]) => (
              <li key={n}>
                ease-pb-{n} · {v}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
