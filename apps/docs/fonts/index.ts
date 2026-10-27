// Every font is a local file in this folder, served from this site: nothing is
// fetched from Google or any other host (faster, private, and allowed by the
// strict CSP).
import { GeistMono } from "geist/font/mono";
import localFont from "next/font/local";

/** Interface text (English): Manrope, variable 200–800 (SIL Open Font License). */
export const sans = localFont({
  variable: "--font-manrope",
  display: "swap",
  src: "./manrope/Manrope-Variable.woff2",
  weight: "200 800",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

/** Code: Geist Mono (the geist package, SIL Open Font License). */
export const mono = GeistMono;

/** Persian text on the /fa page. */
export const persianY = localFont({
  variable: "--font-persian-y",
  display: "swap",
  preload: false,
  src: [
    { path: "./persian-y/persian-y-light.woff2", weight: "300", style: "normal" },
    { path: "./persian-y/persian-y-regular.woff2", weight: "400", style: "normal" },
    { path: "./persian-y/persian-y-medium.woff2", weight: "500", style: "normal" },
    { path: "./persian-y/persian-y-bold.woff2", weight: "700", style: "normal" },
    { path: "./persian-y/persian-y-heavy.woff2", weight: "800", style: "normal" },
  ],
});

/** The wordmark next to the logo (Latin subset, SIL Open Font License). */
export const storyScript = localFont({
  variable: "--font-story-script",
  display: "swap",
  src: "./story-script/story-script-regular.woff2",
  weight: "400",
});

/** Class names that define the font CSS variables on <html>. */
export const fontVariables = [sans.variable, mono.variable, storyScript.variable].join(
  " ",
);
