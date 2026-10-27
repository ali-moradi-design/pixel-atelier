import NextLink from "next/link";
import { Logo } from "./logo";
import { SiteSearch, ThemeToggle } from "./site-client";

const nav: { href: string; label: string; plain?: boolean }[] = [
  { href: "/docs/", label: "Docs" },
  { href: "/docs/button/", label: "Components" },
  { href: "/docs/tokens/", label: "Tokens" },
  { href: "/storybook/", label: "Storybook", plain: true },
  { href: "/fa/", label: "فارسی" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-pb-border bg-pb-bg/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <NextLink
          href="/"
          aria-label="Pixelbits home"
          className="rounded-pb-xs outline-none focus-visible:outline-2 focus-visible:outline-pb-accent"
        >
          <Logo />
        </NextLink>
        <nav
          aria-label="Main"
          className="hidden items-center gap-5 text-[0.8125rem] sm:flex"
        >
          {nav.map((n) => {
            const cls =
              "text-pb-muted outline-none transition-colors hover:text-pb-text focus-visible:text-pb-text";
            // Storybook is a separate static app, not a Next.js route.
            return n.plain ? (
              <a key={n.href} href={n.href} className={cls}>
                {n.label}
              </a>
            ) : (
              <NextLink key={n.href} href={n.href} className={cls}>
                {n.label}
              </NextLink>
            );
          })}
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <SiteSearch />
          <a
            href="https://github.com/ali-moradi-design/pixel-atelier"
            className="hidden text-[0.8125rem] text-pb-muted hover:text-pb-text sm:inline"
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-pb-border">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-8 text-xs text-pb-muted sm:px-6">
        <span>Pixelbits · MIT · by Ali Moradi</span>
        <span className="font-pb-mono">pnpm add pixelbits</span>
      </div>
    </footer>
  );
}
