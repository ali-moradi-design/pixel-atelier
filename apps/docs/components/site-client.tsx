"use client";

import { useRouter } from "next/navigation";
import { CommandPalette } from "pixelbits/command-palette";
import { IconButton } from "pixelbits/icon-button";
import { toast } from "pixelbits/toast";
import { useEffect, useState } from "react";
import { catalog } from "@/lib/catalog";

/** Switches data-theme on <html> and remembers it. */
export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  useEffect(
    () =>
      setTheme((document.documentElement.dataset.theme as "dark" | "light") ?? "dark"),
    [],
  );
  const next = theme === "dark" ? "light" : "dark";
  return (
    <IconButton
      aria-label={`Switch to ${next} theme`}
      variant="ghost"
      size="sm"
      onClick={() => {
        document.documentElement.dataset.theme = next;
        try {
          localStorage.setItem("pb-theme", next);
        } catch {}
        setTheme(next);
      }}
    >
      {theme === "dark" ? (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M5 19l1.4-1.4M17.6 6.4 19 5" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        </svg>
      )}
    </IconButton>
  );
}

/** The site search: a command palette over every component page (⌘K). */
export function SiteSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-8 w-52 cursor-pointer items-center gap-2 rounded-pb-sm border border-pb-border px-2.5 text-[0.8125rem] text-pb-muted outline-none hover:border-pb-border-strong focus-visible:outline-2 focus-visible:outline-pb-accent md:inline-flex"
      >
        Search components
        <kbd className="ms-auto font-pb-mono text-[0.625rem]">⌘K</kbd>
      </button>
      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        placeholder="Search components…"
        commands={[
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
            label: "Persian (RTL) demo",
            group: "Docs",
            keywords: ["rtl", "farsi"],
            onSelect: () => router.push("/fa/"),
          },
        ]}
      />
    </>
  );
}

/** A small button that copies text and confirms with a toast. */
export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  return (
    <IconButton
      aria-label={label}
      variant="ghost"
      size="sm"
      onClick={async () => {
        await navigator.clipboard?.writeText(text);
        toast({
          title: "Copied to clipboard",
          description: text.length < 60 ? text : undefined,
          variant: "success",
          duration: 2500,
        });
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d="M8 8h12v12H8zM16 8V4H4v12h4" />
      </svg>
    </IconButton>
  );
}
