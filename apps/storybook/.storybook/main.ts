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
    // Kit sources start with "use client" for Next.js. A bundle has no server
    // components, so dropping the directive is expected: hide that warning.
    config.build ??= {};
    config.build.rolldownOptions ??= {};
    const rolldown = config.build.rolldownOptions;
    const onwarn = rolldown.onwarn;
    rolldown.onwarn = (warning, warn) => {
      if (
        warning.code === "MODULE_LEVEL_DIRECTIVE" &&
        warning.message.includes("use client")
      )
        return;
      if (onwarn) onwarn(warning, warn);
      else warn(warning);
    };
    // Storybook's own manager and docs chunks are large by design; this is a
    // dev tool, not a page users download.
    config.build.chunkSizeWarningLimit = 2000;
    // Published under /storybook on the docs domain.
    config.base = process.env.STORYBOOK_BASE ?? config.base;
    return config;
  },
};
export default config;
