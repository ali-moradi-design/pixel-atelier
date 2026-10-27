/**
 * The single source of every design token. `scripts/build.ts` turns it into
 * CSS variables (`dist/tokens.css`), a Tailwind v4 theme (`dist/theme.css`) and
 * JSON for the docs. Colors are checked for WCAG AA in `test/contrast.test.ts`.
 */

export type ThemeName = "dark" | "light";

/** `oklch(L C H)`: perceptual lightness, chroma and hue. */
const o = (lch: string) => `oklch(${lch})`;

/**
 * Neutral and status colors per theme, in OKLCH. Neutrals are a cool ink
 * black with warm paper text; status colors are muted jewel tones (emerald,
 * amber, garnet, sapphire) instead of bright signal colors.
 */
export const themes = {
  dark: {
    bg: o("0.16 0.004 286"),
    surface: o("0.193 0.006 286"),
    raised: o("0.224 0.008 286"),
    overlay: o("0.254 0.009 286"),
    border: o("0.271 0.009 286"),
    "border-strong": o("0.351 0.012 286"),
    text: o("0.953 0.01 87"),
    muted: o("0.654 0.013 85"),
    faint: o("0.46 0.01 90"),
    success: o("0.78 0.09 165"),
    warning: o("0.82 0.1 75"),
    danger: o("0.72 0.12 18"),
    info: o("0.76 0.075 245"),
    scrim: o("0.12 0.004 286 / 0.7"),
  },
  light: {
    bg: o("0.967 0.007 89"),
    surface: o("0.985 0.004 91"),
    raised: o("1 0 0"),
    overlay: o("1 0 0"),
    border: o("0.905 0.015 85"),
    "border-strong": o("0.828 0.021 85"),
    text: o("0.195 0.002 107"),
    muted: o("0.483 0.014 85"),
    faint: o("0.713 0.018 88"),
    success: o("0.47 0.08 165"),
    warning: o("0.5 0.09 70"),
    danger: o("0.5 0.14 15"),
    info: o("0.47 0.1 250"),
    scrim: o("0.3 0.02 80 / 0.32"),
  },
} as const satisfies Record<ThemeName, Record<string, string>>;

/** Text color used on top of an accent fill, per theme. */
export const onAccent = { dark: o("0.2 0 0"), light: o("1 0 0") } as const;

/**
 * Accent themes: [accent, hover] per theme. The first one is the default.
 * Precious metals and jewels; each passes WCAG AA on the background and under
 * on-accent text in both themes.
 */
export const accents = {
  gold: {
    dark: [o("0.75 0.12 85"), o("0.83 0.13 90")],
    light: [o("0.5 0.097 79"), o("0.44 0.085 78")],
  },
  platinum: {
    dark: [o("0.82 0.015 250"), o("0.9 0.012 250")],
    light: [o("0.45 0.015 250"), o("0.38 0.015 250")],
  },
  emerald: {
    dark: [o("0.76 0.1 162"), o("0.83 0.09 162")],
    light: [o("0.47 0.09 163"), o("0.41 0.08 163")],
  },
  sapphire: {
    dark: [o("0.74 0.09 255"), o("0.81 0.075 255")],
    light: [o("0.46 0.13 262"), o("0.4 0.12 262")],
  },
  ruby: {
    dark: [o("0.72 0.12 12"), o("0.79 0.1 12")],
    light: [o("0.49 0.15 15"), o("0.43 0.14 15")],
  },
  amethyst: {
    dark: [o("0.74 0.1 305"), o("0.81 0.085 305")],
    light: [o("0.48 0.13 305"), o("0.42 0.12 305")],
  },
} as const satisfies Record<string, Record<ThemeName, readonly [string, string]>>;

export type AccentName = keyof typeof accents;
export const defaultAccent: AccentName = "gold";

/** The full gold ramp, for illustrations and charts. */
export const gold = [
  o("0.91 0.14 95"),
  o("0.835 0.155 92"),
  o("0.73 0.135 89"),
  o("0.615 0.115 85"),
  o("0.5 0.097 79"),
] as const;

export const shadows = {
  dark: [
    "inset 0 1px 0 oklch(1 0 0 / 0.04), 0 1px 2px oklch(0 0 0 / 0.4)",
    "inset 0 1px 0 oklch(1 0 0 / 0.05), 0 8px 24px oklch(0 0 0 / 0.45)",
    "inset 0 1px 0 oklch(1 0 0 / 0.06), 0 24px 64px oklch(0 0 0 / 0.6)",
  ],
  light: [
    "0 1px 2px oklch(0.2 0.02 80 / 0.06)",
    "0 2px 4px oklch(0.2 0.02 80 / 0.04), 0 10px 28px oklch(0.2 0.02 80 / 0.08)",
    "0 4px 8px oklch(0.2 0.02 80 / 0.05), 0 28px 72px oklch(0.2 0.02 80 / 0.16)",
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
