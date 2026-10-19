import axe from "axe-core";
import { expect } from "vitest";

/** Fails the test on any axe violation. jsdom has no layout, so contrast is checked in the browser (Playwright) instead. */
export async function expectNoAxeViolations(container: Element) {
  const result = await axe.run(container, {
    rules: { "color-contrast": { enabled: false } },
  });
  expect(result.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
}
