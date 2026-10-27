import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import type { ReactNode } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { codeToHast, createCssVariablesTheme } from "shiki";

// One theme whose colors are CSS variables (--shiki-token-*), defined per
// light/dark theme in styles/code.css with the kit's OKLCH palette.
const theme = createCssVariablesTheme({
  name: "pixelbits",
  variablePrefix: "--shiki-",
  fontStyle: true,
});

/**
 * Highlights code at build time and returns React elements (no HTML strings,
 * no dangerouslySetInnerHTML; the static export ships no highlighter).
 */
export async function highlight(code: string, lang = "tsx"): Promise<ReactNode> {
  const hast = await codeToHast(code.trim(), { lang, theme });
  return toJsxRuntime(hast, { Fragment, jsx, jsxs });
}
