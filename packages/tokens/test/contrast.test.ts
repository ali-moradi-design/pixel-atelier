import { describe, expect, it } from "vitest";
import { contrast } from "../src/contrast.ts";
import { accents, onAccent, themes } from "../src/tokens.ts";

const AA = 4.5;

/** `fg` at `p` opacity over `bg`, like `bg-pa-success/14` in CSS. */
function tint(fg: string, bg: string, p: number) {
  const ch = (h: string, i: number) => Number.parseInt(h.slice(i, i + 2), 16);
  return `#${[1, 3, 5]
    .map((i) =>
      Math.round(ch(fg, i) * p + ch(bg, i) * (1 - p))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

describe.each(["dark", "light"] as const)("%s theme", (t) => {
  const c = themes[t];
  for (const surface of ["bg", "surface", "raised", "overlay"] as const) {
    it(`text and muted are AA on ${surface}`, () => {
      expect(contrast(c.text, c[surface])).toBeGreaterThanOrEqual(AA);
      expect(contrast(c.muted, c[surface])).toBeGreaterThanOrEqual(AA);
    });
    it(`status colors are AA on ${surface}`, () => {
      for (const s of ["success", "warning", "danger", "info"] as const) {
        expect(contrast(c[s], c[surface]), s).toBeGreaterThanOrEqual(AA);
      }
    });
  }
  it("status colors are AA on their own badge tint", () => {
    for (const surface of ["bg", "surface", "raised"] as const) {
      for (const s of ["success", "warning", "danger", "info"] as const) {
        expect(
          contrast(c[s], tint(c[s], c[surface], 0.14)),
          `${s} on ${surface}`,
        ).toBeGreaterThanOrEqual(AA);
      }
    }
  });
  it("muted text is AA on a selected (accent-subtle) row", () => {
    for (const [name, byTheme] of Object.entries(accents)) {
      const [accent] = byTheme[t];
      expect(
        contrast(c.muted, tint(accent, c.surface, 0.12)),
        name,
      ).toBeGreaterThanOrEqual(AA);
    }
  });
  it.each(Object.keys(accents))(
    "accent %s is AA on bg and under on-accent text",
    (name) => {
      const [accent, hover] = accents[name as keyof typeof accents][t];
      for (const fill of [accent, hover]) {
        expect(contrast(fill, c.bg)).toBeGreaterThanOrEqual(AA);
        expect(contrast(fill, onAccent[t])).toBeGreaterThanOrEqual(AA);
      }
    },
  );
});
