import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.tsx"],
  addons: ["@storybook/addon-docs", "@storybook/addon-a11y", "@storybook/addon-themes"],
  framework: "@storybook/react-vite",
  core: { disableTelemetry: true },
  async viteFinal(config) {
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    // Stories import the kit like an app does ("pixelbits/button"), but
    // from source, so edits show up instantly.
    const src = fileURLToPath(new URL("../../../packages/ui/src/", import.meta.url));
    config.resolve ??= {};
    config.resolve.alias = [
      { find: /^pixelbits$/, replacement: `${src}index.ts` },
      { find: /^pixelbits\/pixels$/, replacement: `${src}pixels/index.ts` },
      { find: /^pixelbits\/(.+)$/, replacement: `${src}components/$1.tsx` },
    ];
    // Published under /storybook on the docs domain.
    config.base = process.env.STORYBOOK_BASE ?? config.base;
    return config;
  },
};
export default config;
