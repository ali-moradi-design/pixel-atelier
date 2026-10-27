import { DocsContainer, type DocsContainerProps } from "@storybook/addon-docs/blocks";
import { type ReactNode, useEffect, useState } from "react";
import { GLOBALS_UPDATED } from "storybook/internal/core-events";
import { addons } from "storybook/preview-api";
import { darkTheme, lightTheme } from "./theme";

type Globals = { theme?: string };

/**
 * Docs pages follow the toolbar theme: Storybook renders them with one fixed
 * theme, so code blocks, tables and inline code stayed light in dark mode.
 */
export function ThemedDocsContainer(
  props: DocsContainerProps & { children?: ReactNode },
) {
  const initial =
    (props.context as unknown as { store?: { userGlobals?: { globals?: Globals } } })
      .store?.userGlobals?.globals?.theme ?? "dark";
  const [theme, setTheme] = useState(initial);
  useEffect(() => {
    const channel = addons.getChannel();
    const onGlobals = ({ globals }: { globals: Globals }) =>
      setTheme(globals.theme ?? "dark");
    channel.on(GLOBALS_UPDATED, onGlobals);
    return () => channel.off(GLOBALS_UPDATED, onGlobals);
  }, []);
  return <DocsContainer {...props} theme={theme === "light" ? lightTheme : darkTheme} />;
}
