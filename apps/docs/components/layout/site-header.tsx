import NextLink from "next/link";
import { SiteSearch } from "@/components/search/site-search";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { site } from "@/lib/site";
import { Logo } from "./logo";

const nav: { href: string; label: string; external?: boolean }[] = [
  { href: "/docs/", label: "Docs" },
  { href: "/docs/button/", label: "Components" },
  { href: "/docs/tokens/", label: "Tokens" },
  // Storybook is a separate static app, not a Next.js route: a plain link.
  { href: site.storybook, label: "Storybook", external: true },
  { href: "/fa/", label: "فارسی" },
];

const linkClass =
  "whitespace-nowrap text-pb-muted outline-none transition-colors hover:text-pb-text focus-visible:text-pb-text";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-pb-border bg-pb-bg/80 backdrop-blur-md">
      <div className="pb-container flex h-14 items-center gap-8">
        <NextLink
          href="/"
          aria-label={`${site.name} home`}
          className="rounded-pb-xs outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pb-accent"
        >
          <Logo />
        </NextLink>
        <nav
          aria-label="Main"
          className="hidden items-center gap-6 text-[0.8125rem] sm:flex"
        >
          {nav.map((n) =>
            n.external ? (
              <a key={n.label} href={n.href} className={linkClass}>
                {n.label}
              </a>
            ) : (
              <NextLink
                key={n.label}
                href={n.href}
                className={linkClass}
                lang={n.href === "/fa/" ? "fa" : undefined}
              >
                {n.label}
              </NextLink>
            ),
          )}
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <SiteSearch />
          <a
            href={site.repo}
            className="hidden text-[0.8125rem] text-pb-muted transition-colors hover:text-pb-text lg:inline"
          >
            GitHub
          </a>
          <ThemeToggle />
        </div>
      </div>
      {/* Phones: the same links in a row that scrolls sideways. */}
      <nav
        aria-label="Main (mobile)"
        className="pb-container flex gap-5 overflow-x-auto border-t border-pb-border py-2.5 text-[0.8125rem] sm:hidden"
      >
        {nav.map((n) =>
          n.external ? (
            <a key={n.label} href={n.href} className={linkClass}>
              {n.label}
            </a>
          ) : (
            <NextLink key={n.label} href={n.href} className={linkClass}>
              {n.label}
            </NextLink>
          ),
        )}
      </nav>
    </header>
  );
}
