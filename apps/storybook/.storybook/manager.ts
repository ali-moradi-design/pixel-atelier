import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

// The Storybook UI itself, in the kit's dark palette with the gold accent.
addons.setConfig({
  theme: create({
    base: "dark",
    brandTitle: "Pixelbits",
    brandUrl: "/",
    colorPrimary: "#d1a84b",
    colorSecondary: "#d1a84b",
    appBg: "#141417",
    appContentBg: "#0d0d0f",
    appPreviewBg: "#0d0d0f",
    appBorderColor: "#26262b",
    appBorderRadius: 4,
    textColor: "#f2efe8",
    textMutedColor: "#949088",
    barBg: "#141417",
    barTextColor: "#949088",
    barSelectedColor: "#d1a84b",
    barHoverColor: "#e8c35a",
    inputBg: "#1b1b1f",
    inputBorder: "#3a3a41",
    inputTextColor: "#f2efe8",
    fontBase: '"Manrope", ui-sans-serif, system-ui, sans-serif',
    fontCode: '"Geist Mono", ui-monospace, monospace',
  }),
});
