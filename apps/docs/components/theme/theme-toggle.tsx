"use client";

import { useTheme } from "next-themes";
import { IconButton } from "pixelbits/icon-button";

/**
 * Switches between light and dark. Both icons are rendered and CSS shows the
 * right one from data-theme, so the button needs no "mounted" state and no
 * second render after hydration.
 */
export function ThemeToggle({ label = "Switch theme" }: { label?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <IconButton
      aria-label={label}
      variant="ghost"
      size="sm"
      onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
        className="light:hidden"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6 19 19M5 19l1.4-1.4M17.6 6.4 19 5" />
      </svg>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
        className="hidden light:block"
      >
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
      </svg>
    </IconButton>
  );
}
