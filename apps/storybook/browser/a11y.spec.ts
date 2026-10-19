import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { stories } from "./stories";

for (const theme of ["dark", "light"] as const) {
  for (const id of stories) {
    test(`${id} (${theme}) passes axe, including contrast`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
      await page.locator("#storybook-root > *").first().waitFor();
      const result = await new AxeBuilder({ page })
        .include("#storybook-root")
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();
      expect(
        result.violations.map(
          (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
        ),
      ).toEqual([]);
    });
  }
}
