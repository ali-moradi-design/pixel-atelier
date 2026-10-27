import { describe, expect, it } from "vitest";
import { contrast, inGamut, mix } from "../src/contrast.ts";
import { accents, gold, onAccent, themes } from "../src/tokens.ts";

const AA = 4.5;

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
          contrast(c[s], mix(c[s], c[surface], 0.14)),
          `${s} on ${surface}`,
        ).toBeGreaterThanOrEqual(AA);
      }
    }
  });
  it("muted text is AA on a selected (accent-subtle) row", () => {
    for (const [name, byTheme] of Object.entries(accents)) {
      const [accent] = byTheme[t];
      expect(
        contrast(c.muted, mix(accent, c.surface, 0.12)),
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

describe("color space", () => {
  it("every color is written in OKLCH and fits in sRGB", () => {
    const all = [
      ...Object.values(themes.dark),
      ...Object.values(themes.light),
      ...Object.values(onAccent),
      ...Object.values(accents).flatMap((a) => [...a.dark, ...a.light]),
      ...gold,
    ];
    for (const c of all) {
      expect(c, c).toMatch(/^oklch\(/);
      expect(inGamut(c), c).toBe(true);
    }
  });
});
