/**
 * The single source of every design token. `scripts/build.ts` turns it into
 * CSS variables (`dist/tokens.css`), a Tailwind v4 theme (`dist/theme.css`) and
 * JSON for the docs. Colors are checked for WCAG AA in `test/contrast.test.ts`.
 */

export type ThemeName = "dark" | "light";

/** Neutral and status colors per theme. */
export const themes = {
  dark: {
    bg: "#0d0d0f",
    surface: "#141417",
    raised: "#1b1b1f",
    overlay: "#222227",
    border: "#26262b",
    "border-strong": "#3a3a41",
    text: "#f2efe8",
    muted: "#8f8b83",
    faint: "#5a5852",
    success: "#6fcf97",
    warning: "#e8b85c",
    danger: "#f07171",
    info: "#7fb2f0",
    scrim: "rgb(5 5 6 / 0.66)",
  },
  light: {
    bg: "#f6f4ef",
    surface: "#fbfaf7",
    raised: "#ffffff",
    overlay: "#ffffff",
    border: "#e4dfd5",
    "border-strong": "#cdc6b8",
    text: "#151514",
    muted: "#6b675f",
    faint: "#a7a296",
    success: "#1d7549",
    warning: "#8f6200",
    danger: "#bf3636",
    info: "#2a5fb3",
    scrim: "rgb(40 36 28 / 0.32)",
  },
} as const satisfies Record<ThemeName, Record<string, string>>;

/** Text color used on top of an accent fill, per theme. */
export const onAccent = { dark: "#121212", light: "#ffffff" } as const;

/** Accent themes: [accent, hover] per theme. The first one is the default. */
export const accents = {
  gold: { dark: ["#c9a227", "#edc531"], light: ["#805b10", "#6b4c0d"] },
  jade: { dark: ["#7cc4a2", "#96d3b6"], light: ["#2d7656", "#24644a"] },
  iris: { dark: ["#a99cff", "#bdb3ff"], light: ["#5a4bd0", "#4b3db8"] },
  ember: { dark: ["#f08a5d", "#f4a07a"], light: ["#ad4c1d", "#953f15"] },
} as const satisfies Record<string, Record<ThemeName, readonly [string, string]>>;

export type AccentName = keyof typeof accents;
export const defaultAccent: AccentName = "gold";

/** The full gold ramp, for illustrations and charts. */
export const gold = ["#ffe169", "#edc531", "#c9a227", "#a47e1b", "#805b10"] as const;

export const shadows = {
  dark: [
    "inset 0 1px 0 rgb(255 255 255 / 0.04), 0 1px 2px rgb(0 0 0 / 0.4)",
    "inset 0 1px 0 rgb(255 255 255 / 0.05), 0 8px 24px rgb(0 0 0 / 0.45)",
    "inset 0 1px 0 rgb(255 255 255 / 0.06), 0 24px 64px rgb(0 0 0 / 0.6)",
  ],
  light: [
    "0 1px 2px rgb(30 25 15 / 0.06)",
    "0 2px 4px rgb(30 25 15 / 0.04), 0 10px 28px rgb(30 25 15 / 0.08)",
    "0 4px 8px rgb(30 25 15 / 0.05), 0 28px 72px rgb(30 25 15 / 0.16)",
  ],
} as const;

export const radius = {
  xs: "2px",
  sm: "4px",
  md: "6px",
  lg: "10px",
  xl: "16px",
} as const;

export const fonts = {
  sans: '"Geist", ui-sans-serif, system-ui, sans-serif',
  mono: '"Geist Mono", ui-monospace, "SFMono-Regular", monospace',
} as const;

/** [size, line height, letter spacing, weight] */
export const type = {
  display: ["4.5rem", "1", "-0.04em", "300"],
  h1: ["3rem", "1.05", "-0.035em", "300"],
  h2: ["2.25rem", "1.1", "-0.025em", "400"],
  h3: ["1.75rem", "1.15", "-0.02em", "400"],
  h4: ["1.375rem", "1.25", "-0.015em", "500"],
  "body-lg": ["1.125rem", "1.55", "-0.005em", "400"],
  body: ["1rem", "1.55", "0em", "400"],
  small: ["0.875rem", "1.5", "0em", "400"],
  caption: ["0.75rem", "1.4", "0em", "400"],
  label: ["0.75rem", "1", "0.06em", "500"],
} as const;

export const motion = {
  duration: {
    instant: "80ms",
    fast: "120ms",
    base: "200ms",
    slow: "320ms",
    pixel: "400ms",
    page: "640ms",
  },
  ease: {
    out: "cubic-bezier(0.22, 1, 0.36, 1)",
    "in-out": "cubic-bezier(0.65, 0, 0.35, 1)",
  },
} as const;
