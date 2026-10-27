import { withThemeByDataAttribute } from "@storybook/addon-themes";
import type { Preview } from "@storybook/react-vite";
import "./styles.css";

const preview: Preview = {
  globalTypes: {
    accent: {
      description: "Accent",
      toolbar: {
        icon: "paintbrush",
        items: ["gold", "platinum", "emerald", "sapphire", "ruby", "amethyst"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { accent: "gold" },
  decorators: [
    // A one-click light/dark toggle in the toolbar (two themes = a toggle
    // button). It sets data-theme on <html>, which the tokens and the docs
    // page styles (styles.css) both read.
    withThemeByDataAttribute({
      themes: { dark: "dark", light: "light" },
      defaultTheme: "dark",
      attributeName: "data-theme",
    }),
    (Story, { globals }) => {
      // Also set the theme during render: the addon sets it in an effect,
      // after the first paint, and colors would animate from dark to light.
      document.documentElement.dataset.theme = globals.theme ?? "dark";
      document.documentElement.dataset.accent = globals.accent;
      return Story();
    },
  ],
  parameters: {
    layout: "centered",
    backgrounds: { disable: true },
    a11y: { test: "error" },
    // Code samples on docs pages: always the dark block (readable in both themes).
    docs: { source: { dark: true } },
  },
  tags: ["autodocs"],
};
export default preview;
