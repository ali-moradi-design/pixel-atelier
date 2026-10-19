import { defineConfig, devices } from "@playwright/test";

// Real-browser checks on the built Storybook: visual regression of key
// stories and axe (including color contrast, which jsdom cannot check).
// Unit behavior lives in packages/ui (Vitest); keep this suite small.
export default defineConfig({
  testDir: "browser",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: "http://localhost:6007",
    ...devices["Desktop Chrome"],
    viewport: { width: 900, height: 640 },
  },
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled", caret: "hide" },
  },
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  webServer: {
    command: "PORT=6007 node browser/serve.mjs",
    port: 6007,
    reuseExistingServer: !process.env.CI,
  },
});
