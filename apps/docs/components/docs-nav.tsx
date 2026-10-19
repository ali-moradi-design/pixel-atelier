"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { catalog, groups } from "@/lib/catalog";

export function DocsNav() {
  const path = usePathname() ?? "";
  const link = (href: string, label: string) => {
    const current = path === href || path === href.replace(/\/$/, "");
    return (
      <li key={href}>
        <NextLink
          href={href}
          aria-current={current ? "page" : undefined}
          className="block rounded-pa-xs border-s-2 border-transparent py-1 ps-3 text-[0.8125rem] text-pa-muted outline-none transition-colors hover:text-pa-text focus-visible:outline-2 focus-visible:outline-pa-accent aria-[current=page]:border-pa-accent aria-[current=page]:text-pa-text"
        >
          {label}
        </NextLink>
      </li>
    );
  };
  const list = (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h2 className="font-pa-mono text-[0.625rem] uppercase tracking-[0.14em] text-pa-accent">
          Start
        </h2>
        <ul>
          {link("/docs/", "Getting started")}
          {link("/docs/tokens/", "Tokens")}
        </ul>
      </div>
      {groups.map((g) => (
        <div key={g} className="grid gap-2">
          <h2 className="font-pa-mono text-[0.625rem] uppercase tracking-[0.14em] text-pa-accent">
            {g}
          </h2>
          <ul>
            {catalog
              .filter((c) => c.group === g)
              .map((c) => link(`/docs/${c.slug}/`, c.title))}
          </ul>
        </div>
      ))}
    </div>
  );
  const current =
    catalog.find((c) => path.startsWith(`/docs/${c.slug}`))?.title ??
    (path.startsWith("/docs/tokens") ? "Tokens" : "Getting started");
  return (
    <div>
      {/* Phones: the list folds into a native disclosure above the page. */}
      <details className="group/nav rounded-pa-md border border-pa-border lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm outline-none focus-visible:outline-2 focus-visible:outline-pa-accent [&::-webkit-details-marker]:hidden">
          <span>
            <span className="text-pa-muted">Docs / </span>
            {current}
          </span>
          <span
            aria-hidden="true"
            className="text-pa-muted transition-transform group-open/nav:rotate-180"
          >
            ▾
          </span>
        </summary>
        <nav aria-label="Documentation" className="border-t border-pa-border p-4">
          {list}
        </nav>
      </details>
      <nav
        aria-label="Documentation"
        className="hidden lg:sticky lg:top-20 lg:block lg:max-h-[calc(100dvh-6rem)] lg:overflow-auto"
      >
        {list}
      </nav>
    </div>
  );
}
