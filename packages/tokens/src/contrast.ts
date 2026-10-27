/** A color as sRGB channels in [0, 1] (alpha is ignored). */
export type Rgb = readonly [number, number, number];

const OKLCH =
  /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*[\d.]+%?\s*)?\)$/;

/** OKLCH to gamma-encoded sRGB (channels may fall outside [0, 1] when out of gamut). */
export function oklchToRgb(l: number, c: number, h: number): Rgb {
  const a = c * Math.cos((h * Math.PI) / 180);
  const b = c * Math.sin((h * Math.PI) / 180);
  const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
    -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
    -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
  ];
  return lin.map((x) =>
    x <= 0.0031308 ? 12.92 * x : 1.055 * Math.sign(x) * Math.abs(x) ** (1 / 2.4) - 0.055,
  ) as unknown as Rgb;
}

/** Parses `#rrggbb` or `oklch(L C H)` (L as 0–1 or a percentage). */
export function toRgb(color: string): Rgb {
  const m = color.trim().match(OKLCH);
  if (m) {
    const l = Number(m[1]) / (m[2] ? 100 : 1);
    return oklchToRgb(l, Number(m[3]), Number(m[4]));
  }
  if (/^#[\da-f]{6}$/i.test(color))
    return [1, 3, 5].map((i) => Number.parseInt(color.slice(i, i + 2), 16) / 255) as [
      number,
      number,
      number,
    ];
  throw new Error(`Unsupported color: ${color}`);
}

/** True when the color fits in sRGB (every screen can show it exactly). */
export function inGamut(color: string, tolerance = 0.002) {
  return toRgb(color).every((x) => x >= -tolerance && x <= 1 + tolerance);
}

/** `#rrggbb` for a color (clamped to sRGB). */
export function toHex(color: string) {
  return `#${toRgb(color)
    .map((x) =>
      Math.round(Math.min(1, Math.max(0, x)) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/** `fg` at `p` opacity over `bg`, like `bg-pb-success/14` in CSS. */
export function mix(fg: string, bg: string, p: number) {
  const f = toRgb(fg);
  const b = toRgb(bg);
  const lin = (x: number) => Math.min(1, Math.max(0, x));
  return `#${f
    .map((x, i) =>
      Math.round((lin(x) * p + lin(b[i] as number) * (1 - p)) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/** WCAG 2 relative luminance. */
export function luminance(color: string) {
  const [r, g, b] = toRgb(color).map((x) => {
    const v = Math.min(1, Math.max(0, x));
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast ratio between two colors (`#rrggbb` or `oklch()`). */
export function contrast(a: string, b: string) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m) as [number, number];
  return (x + 0.05) / (y + 0.05);
}
