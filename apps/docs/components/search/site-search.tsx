"use client";

import { useRouter } from "next/navigation";
import { CommandPalette } from "pixelbits/command-palette";
import { useMemo, useState } from "react";
import { catalog } from "@/lib/catalog";

/** The site search: a command palette over every page (⌘K). */
export function SiteSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // Built once: the palette does not re-filter on every header render.
  const commands = useMemo(
    () => [
      ...catalog.map((c) => ({
        id: c.slug,
        label: c.title,
        group: c.group,
        keywords: c.exports,
        onSelect: () => router.push(`/docs/${c.slug}/`),
      })),
      {
        id: "start",
        label: "Getting started",
        group: "Docs",
        onSelect: () => router.push("/docs/"),
      },
      {
        id: "tokens",
        label: "Tokens",
        group: "Docs",
        onSelect: () => router.push("/docs/tokens/"),
      },
      {
        id: "fa",
        label: "Persian (RTL) page",
        group: "Docs",
        keywords: ["rtl", "farsi", "persian"],
        onSelect: () => router.push("/fa/"),
      },
    ],
    [router],
  );
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-8 w-56 cursor-pointer items-center gap-2 rounded-pb-sm border border-pb-border bg-pb-surface px-2.5 text-[0.8125rem] text-pb-muted outline-none transition-colors hover:border-pb-border-strong hover:text-pb-text focus-visible:outline-2 focus-visible:outline-pb-accent md:inline-flex"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
          className="size-3.5"
        >
          <circle cx="11" cy="11" r="6" />
          <path d="m20 20-4.5-4.5" />
        </svg>
        Search components
        <kbd className="ms-auto rounded-[3px] border border-pb-border px-1 font-pb-mono text-[0.625rem]">
          ⌘K
        </kbd>
      </button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        placeholder="Search components…"
        commands={commands}
      />
    </>
  );
}
