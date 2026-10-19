import type { Preview } from "@storybook/react-vite";
import "./styles.css";

const preview: Preview = {
  globalTypes: {
    theme: {
      description: "Theme",
      toolbar: { icon: "mirror", items: ["dark", "light"], dynamicTitle: true },
    },
    accent: {
      description: "Accent",
      toolbar: {
        icon: "paintbrush",
        items: ["gold", "jade", "iris", "ember"],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: "dark", accent: "gold" },
  decorators: [
    (Story, { globals }) => {
      const root = document.documentElement;
      root.dataset.theme = globals.theme;
      root.dataset.accent = globals.accent;
      return Story();
    },
  ],
  parameters: {
    layout: "centered",
    backgrounds: { disable: true },
    a11y: { test: "error" },
  },
  tags: ["autodocs"],
};
export default preview;
