import { expect, type Page, test } from "@playwright/test";
import { stories } from "./stories";

async function open(page: Page, id: string, theme: "dark" | "light") {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(`/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`);
  await page.locator("#storybook-root > *").first().waitFor();
  await page.evaluate(() => document.fonts.ready);
}

for (const id of stories) {
  test(`${id} looks the same`, async ({ page }) => {
    await open(page, id, "dark");
    await expect(page).toHaveScreenshot(`${id}.png`, { fullPage: true });
  });
}

test("pixel dissolve fills a hovered button", async ({ page }) => {
  await open(page, "core-button--variants", "dark");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const button = page.getByRole("button", { name: "Secondary" });
  await button.hover();
  await page.waitForTimeout(600);
  await expect(button).toHaveScreenshot("button-hovered.png", { animations: "allow" });
});
