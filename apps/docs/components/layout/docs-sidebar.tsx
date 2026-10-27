"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { catalog, groups } from "@/lib/catalog";

const sections = [
  {
    title: "Start",
    links: [
      { href: "/docs/", label: "Getting started" },
      { href: "/docs/tokens/", label: "Tokens" },
    ],
  },
  ...groups.map((g) => ({
    title: g,
    links: catalog
      .filter((c) => c.group === g)
      .map((c) => ({ href: `/docs/${c.slug}/`, label: c.title })),
  })),
];

const isCurrent = (path: string, href: string) =>
  path === href || path === href.replace(/\/$/, "");

function List({ path }: { path: string }) {
  return (
    <div className="grid gap-7">
      {sections.map((s) => (
        <div key={s.title} className="grid gap-2">
          <h2 className="ps-3 font-pb-mono text-[0.625rem] uppercase tracking-[0.16em] text-pb-accent">
            {s.title}
          </h2>
          <ul className="grid">
            {s.links.map((l) => (
              <li key={l.href}>
                <NextLink
                  href={l.href}
                  aria-current={isCurrent(path, l.href) ? "page" : undefined}
                  className="relative block rounded-pb-xs py-1.25 ps-3 text-[0.8125rem] text-pb-muted outline-none transition-colors before:absolute before:inset-y-1.5 before:inset-s-0 before:w-0.5 before:bg-transparent before:transition-colors hover:text-pb-text hover:before:bg-pb-border-strong focus-visible:outline-2 focus-visible:outline-pb-accent aria-[current=page]:text-pb-text aria-[current=page]:before:bg-pb-accent"
                >
                  {l.label}
                </NextLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function DocsSidebar() {
  const path = usePathname() ?? "";
  const scroller = useRef<HTMLElement>(null);
  // Keep the current page in view inside the sidebar (never scrolls the page).
  // biome-ignore lint/correctness/useExhaustiveDependencies: runs again on every navigation
  useEffect(() => {
    const box = scroller.current;
    const item = box?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!box || !item) return;
    const top = item.offsetTop - box.clientHeight / 2 + item.clientHeight / 2;
    if (
      item.offsetTop < box.scrollTop ||
      item.offsetTop > box.scrollTop + box.clientHeight - 40
    )
      box.scrollTo({ top });
  }, [path]);
  const current =
    catalog.find((c) => path.startsWith(`/docs/${c.slug}`))?.title ??
    (path.startsWith("/docs/tokens") ? "Tokens" : "Getting started");
  return (
    <div>
      {/* Phones: the list folds into a native disclosure above the page. */}
      <details className="group/nav rounded-pb-md border border-pb-border bg-pb-surface lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm outline-none focus-visible:outline-2 focus-visible:outline-pb-accent [&::-webkit-details-marker]:hidden">
          <span>
            <span className="text-pb-muted">Docs / </span>
            {current}
          </span>
          <span
            aria-hidden="true"
            className="text-pb-muted transition-transform group-open/nav:rotate-180"
          >
            ▾
          </span>
        </summary>
        <nav
          aria-label="Documentation"
          data-lenis-prevent
          className="pb-scroll max-h-[60dvh] overflow-y-auto border-t border-pb-border p-4"
        >
          <List path={path} />
        </nav>
      </details>
      <nav
        ref={scroller}
        aria-label="Documentation"
        data-lenis-prevent
        className="pb-scroll pb-scroll-fade hidden lg:sticky lg:top-20 lg:block lg:max-h-[calc(100dvh-6rem)] lg:overflow-y-auto lg:overscroll-contain lg:py-2 lg:pe-3"
      >
        <List path={path} />
      </nav>
    </div>
  );
}
