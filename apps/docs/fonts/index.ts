// Every font is a local file served from this site: nothing is fetched from
// Google or any other host (faster, private, and allowed by the strict CSP).
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import localFont from "next/font/local";

/** Interface text (English). Swap here to change the font of the whole site. */
export const sans = GeistSans;
export const mono = GeistMono;

/** Persian text on the /fa page. */
export const yekanBakh = localFont({
  variable: "--font-yekan-bakh",
  display: "swap",
  preload: false,
  src: [
    { path: "./YekanBakh-Light.woff2", weight: "300", style: "normal" },
    { path: "./YekanBakh-Regular.woff2", weight: "400", style: "normal" },
    { path: "./YekanBakh-Medium.woff2", weight: "500", style: "normal" },
    { path: "./YekanBakh-Bold.woff2", weight: "700", style: "normal" },
    { path: "./YekanBakh-Heavy.woff2", weight: "800", style: "normal" },
  ],
});

/** The wordmark next to the logo (Latin subset, SIL Open Font License). */
export const storyScript = localFont({
  variable: "--font-story-script",
  display: "swap",
  src: "./StoryScript-Regular.woff2",
  weight: "400",
});

/** Class names that define the font CSS variables on <html>. */
export const fontVariables = [sans.variable, mono.variable, storyScript.variable].join(
  " ",
);
