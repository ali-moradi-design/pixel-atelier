import { describe, expect, it } from "vitest";
import { contrast } from "../src/contrast.ts";
import { accents, onAccent, themes } from "../src/tokens.ts";

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
