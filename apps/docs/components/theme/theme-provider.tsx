"use client";

import { ThemeProvider as NextThemes } from "next-themes";
import type { ReactNode } from "react";

/**
 * Light and dark theme via next-themes: it sets data-theme on <html> before
 * the first paint (no flash on load) and turns transitions off while the
 * theme switches (no blink of animating colors).
 */
export function ThemeProvider({
  children,
  nonce,
}: {
  children: ReactNode;
  nonce?: string;
}) {
  return (
    <NextThemes
      attribute="data-theme"
      themes={["light", "dark"]}
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
      storageKey="pb-theme"
      nonce={nonce}
    >
      {children}
    </NextThemes>
  );
}
