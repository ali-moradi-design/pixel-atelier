import { addons } from "storybook/manager-api";
import { darkTheme } from "./theme";

// The Storybook UI itself, in the kit's dark palette with the gold accent.
addons.setConfig({ theme: darkTheme });
