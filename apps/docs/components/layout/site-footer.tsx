import NextLink from "next/link";
import { catalog } from "@/lib/catalog";
import { site } from "@/lib/site";
import { Logo } from "./logo";
import { MadeWithLove } from "./made-with-love";

const columns: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Docs",
    links: [
      { href: "/docs/", label: "Getting started" },
      { href: "/docs/tokens/", label: "Tokens" },
      { href: "/docs/button/", label: "Components" },
      { href: "/docs/hero/", label: "Blocks" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: site.storybook, label: "Storybook" },
      { href: "/r/registry.json", label: "shadcn registry" },
      { href: site.npm, label: "npm" },
      { href: site.repo, label: "GitHub" },
    ],
  },
  {
    title: "Language",
    links: [
      { href: "/", label: "English" },
      { href: "/fa/", label: "فارسی (RTL)" },
    ],
  },
];

const isInternal = (href: string) => href.startsWith("/") && !href.includes(".");

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-pb-border bg-pb-surface">
      <div className="pb-container grid gap-12 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="grid content-start gap-4">
          <Logo />
          <p className="max-w-xs text-[0.8125rem] leading-relaxed text-pb-muted">
            {site.tagline} A calm React UI kit: {catalog.length} components whose pixel
            effects appear only at the moment of interaction.
          </p>
          <code className="w-fit rounded-pb-sm border border-pb-border bg-pb-bg px-2.5 py-1.5 font-pb-mono text-xs text-pb-muted">
            pnpm add pixelbits
          </code>
        </div>
        {columns.map((col) => (
          <nav
            key={col.title}
            aria-label={col.title}
            className="grid content-start gap-3"
          >
            <h2 className="font-pb-mono text-[0.625rem] uppercase tracking-[0.16em] text-pb-accent">
              {col.title}
            </h2>
            <ul className="grid gap-2 text-[0.8125rem]">
              {col.links.map((l) => (
                <li key={l.label}>
                  {isInternal(l.href) ? (
                    <NextLink
                      href={l.href}
                      className="text-pb-muted transition-colors hover:text-pb-text"
                    >
                      {l.label}
                    </NextLink>
                  ) : (
                    <a
                      href={l.href}
                      className="text-pb-muted transition-colors hover:text-pb-text"
                    >
                      {l.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-pb-border">
        <div className="pb-container flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-pb-muted">
          <span>
            © {new Date().getFullYear()} {site.name} · MIT License
          </span>
          <MadeWithLove />
        </div>
      </div>
    </footer>
  );
}
