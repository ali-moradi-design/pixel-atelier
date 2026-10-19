import {
  accents,
  fonts,
  gold,
  motion,
  radius,
  themes,
  type,
} from "@pixel-atelier/tokens";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tokens" };

export default function Tokens() {
  const names = Object.keys(themes.dark) as (keyof typeof themes.dark)[];
  return (
    <article className="grid gap-12">
      <header className="prose-pa grid max-w-2xl gap-3">
        <h1 className="text-pa-h1 text-pa-text">Tokens</h1>
        <p>
          Every value is a CSS variable (<code>--pa-*</code>) with a dark and a light
          theme, and a Tailwind v4 utility (<code>bg-pa-surface</code>,{" "}
          <code>rounded-pa-md</code>, <code>text-pa-h2</code>…). All text and accent
          colors pass WCAG AA; a test checks it.
        </p>
      </header>
      <section className="grid gap-4">
        <h2 className="text-pa-h4">Colors</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {names.map((n) => (
            <div key={n} className="grid gap-1.5">
              <div
                className="h-16 rounded-pa-md border border-pa-border"
                style={{ background: `var(--pa-${n})` }}
              />
              <span className="text-xs">{n}</span>
              <span className="font-pa-mono text-[0.6875rem] text-pa-muted">
                {themes.dark[n]} / {themes.light[n]}
              </span>
            </div>
          ))}
        </div>
      </section>
      <section className="grid gap-4">
        <h2 className="text-pa-h4">Accents</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(accents).map(([name, v]) => (
            <div
              key={name}
              data-accent={name}
              className="grid gap-2 rounded-pa-lg border border-pa-border bg-pa-surface p-4"
            >
              <div className="flex gap-1.5">
                <i className="h-10 flex-1 rounded-pa-sm bg-pa-accent" />
                <i className="h-10 flex-1 rounded-pa-sm bg-pa-accent-hover" />
                <i className="h-10 flex-1 rounded-pa-sm bg-pa-accent-subtle" />
              </div>
              <span className="text-sm">{name}</span>
              <span className="font-pa-mono text-[0.6875rem] text-pa-muted">
                {v.dark[0]} / {v.light[0]}
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
        <h2 className="mb-2 text-pa-h4">Type</h2>
        {Object.entries(type).map(([name, [size, lh, ls, w]]) => (
          <div
            key={name}
            className="grid grid-cols-[6rem_1fr] items-baseline gap-4 border-b border-pa-border py-3 sm:grid-cols-[8rem_1fr_14rem]"
          >
            <span className="font-pa-mono text-xs text-pa-muted">{name}</span>
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
            <span className="hidden text-end font-pa-mono text-xs text-pa-muted sm:block">
              {size} · {lh} · {ls} · {w}
            </span>
          </div>
        ))}
        <p className="mt-2 text-xs text-pa-muted">
          Fonts: {fonts.sans.split(",")[0]} and {fonts.mono.split(",")[0]}.
        </p>
      </section>
      <section className="grid gap-6 sm:grid-cols-2">
        <div className="grid content-start gap-3">
          <h2 className="text-pa-h4">Radius</h2>
          <div className="flex flex-wrap gap-4">
            {Object.entries(radius).map(([n, v]) => (
              <div key={n} className="grid justify-items-center gap-1.5">
                <div
                  className="size-14 border border-pa-border-strong bg-pa-surface"
                  style={{ borderRadius: v }}
                />
                <span className="font-pa-mono text-[0.6875rem] text-pa-muted">
                  {n} · {v}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid content-start gap-3">
          <h2 className="text-pa-h4">Motion</h2>
          <ul className="grid gap-1.5 font-pa-mono text-xs text-pa-muted">
            {Object.entries(motion.duration).map(([n, v]) => (
              <li key={n}>
                duration-pa-{n} · {v}
              </li>
            ))}
            {Object.entries(motion.ease).map(([n, v]) => (
              <li key={n}>
                ease-pa-{n} · {v}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
