import { codeToHtml } from "shiki";

/** Highlights code at build time (static export: no highlighter in the browser). */
export function highlight(code: string, lang = "tsx") {
  return codeToHtml(code.trim(), {
    lang,
    themes: { light: "github-light", dark: "vitesse-dark" },
    defaultColor: false,
  });
}
