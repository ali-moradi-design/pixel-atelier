import { create } from "storybook/theming";

// Storybook's own UI and its docs pages, in the kit's palette (hex here:
// Storybook's theming does not read CSS variables).
const shared = {
  brandTitle: "Pixelbits",
  brandUrl: "/",
  colorPrimary: "#d1a84b",
  colorSecondary: "#b88c2a",
  appBorderRadius: 4,
  inputBorderRadius: 4,
  fontBase: '"Manrope", ui-sans-serif, system-ui, sans-serif',
  fontCode: '"Geist Mono", ui-monospace, monospace',
};

export const darkTheme = create({
  ...shared,
  base: "dark",
  appBg: "#141417",
  appContentBg: "#0d0d0f",
  appPreviewBg: "#0d0d0f",
  appBorderColor: "#26262b",
  textColor: "#f2efe8",
  textMutedColor: "#949088",
  textInverseColor: "#0d0d0f",
  barBg: "#141417",
  barTextColor: "#949088",
  barSelectedColor: "#d1a84b",
  barHoverColor: "#e8c35a",
  buttonBg: "#1b1b1f",
  buttonBorder: "#3a3a41",
  booleanBg: "#1b1b1f",
  booleanSelectedBg: "#3a3a41",
  inputBg: "#1b1b1f",
  inputBorder: "#3a3a41",
  inputTextColor: "#f2efe8",
});

export const lightTheme = create({
  ...shared,
  base: "light",
  colorPrimary: "#815c12",
  colorSecondary: "#815c12",
  appBg: "#fbfaf7",
  appContentBg: "#f6f4ef",
  appPreviewBg: "#f6f4ef",
  appBorderColor: "#e4dfd5",
  textColor: "#151514",
  textMutedColor: "#625e56",
  textInverseColor: "#f6f4ef",
  barBg: "#fbfaf7",
  barTextColor: "#625e56",
  barSelectedColor: "#815c12",
  barHoverColor: "#6c4c0e",
  buttonBg: "#ffffff",
  buttonBorder: "#cdc6b8",
  booleanBg: "#ffffff",
  booleanSelectedBg: "#e4dfd5",
  inputBg: "#ffffff",
  inputBorder: "#cdc6b8",
  inputTextColor: "#151514",
});
