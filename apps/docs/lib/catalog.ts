/** Every documented component: its slug (URL and registry name), group and API file. */
export interface Entry {
  slug: string;
  title: string;
  group:
    | "Core"
    | "Forms"
    | "Overlays"
    | "Data display"
    | "Signature"
    | "Blocks"
    | "Primitives";
  /** Key in content/api.json (`components/<file>` or `pixels/<file>`). */
  api: string;
  /** Named exports to import, shown in the usage snippet. */
  exports: string[];
}

const e = (
  slug: string,
  title: string,
  group: Entry["group"],
  exports: string[],
  api = `components/${slug}`,
): Entry => ({
  slug,
  title,
  group,
  api,
  exports,
});

export const catalog: Entry[] = [
  e("button", "Button", "Core", ["Button"]),
  e("icon-button", "Icon button", "Core", ["IconButton"]),
  e("text-link", "Text link", "Core", ["TextLink"]),
  e("badge", "Badge", "Core", ["Badge"]),
  e("tag", "Tag", "Core", ["Tag"]),
  e("field", "Field", "Forms", ["Field"]),
  e("input", "Input", "Forms", ["Input"]),
  e("textarea", "Textarea", "Forms", ["Textarea"]),
  e("checkbox", "Checkbox", "Forms", ["Checkbox"]),
  e("radio", "Radio group", "Forms", ["RadioGroup", "Radio"]),
  e("switch", "Switch", "Forms", ["Switch"]),
  e("slider", "Slider", "Forms", ["Slider"]),
  e("select", "Select", "Forms", ["Select"]),
  e("combobox", "Combobox", "Forms", ["Combobox"]),
  e("tabs", "Tabs", "Overlays", ["Tabs", "TabList", "Tab", "TabPanel"]),
  e("accordion", "Accordion", "Overlays", ["Accordion", "AccordionItem"]),
  e("dialog", "Dialog and Sheet", "Overlays", ["Dialog", "Sheet", "DialogClose"]),
  e("popover", "Popover", "Overlays", ["Popover"]),
  e("tooltip", "Tooltip", "Overlays", ["Tooltip"]),
  e("dropdown-menu", "Dropdown menu", "Overlays", [
    "DropdownMenu",
    "DropdownItem",
    "DropdownSeparator",
  ]),
  e("command-palette", "Command palette", "Overlays", ["CommandPalette"]),
  e("toast", "Toast", "Overlays", ["Toaster", "toast"]),
  e("card", "Card", "Data display", ["Card"]),
  e("avatar", "Avatar", "Data display", ["Avatar", "AvatarGroup"]),
  e("skeleton", "Skeleton", "Data display", ["Skeleton"]),
  e("table", "Table", "Data display", [
    "Table",
    "TableHeader",
    "TableBody",
    "TableRow",
    "TableHead",
    "TableCell",
  ]),
  e("pagination", "Pagination", "Data display", ["Pagination"]),
  e("breadcrumb", "Breadcrumb", "Data display", ["Breadcrumb"]),
  e("progress", "Progress", "Data display", ["Progress"]),
  e("full-screen-menu", "Full-screen menu", "Signature", ["FullScreenMenu"]),
  e("image-reveal", "Pixel image reveal", "Signature", ["PixelImageReveal"]),
  e("text-scramble", "Text scramble", "Signature", ["TextScramble"]),
  e("page-transition", "Pixel page transition", "Signature", [
    "PixelTransition",
    "pixelTransition",
  ]),
  e("pixel-loader", "Pixel loader", "Signature", ["PixelLoader"]),
  e("spotlight-card", "Spotlight card", "Signature", ["SpotlightCard"]),
  e("magnetic", "Magnetic", "Signature", ["Magnetic"]),
  e("number-ticker", "Number ticker", "Signature", ["NumberTicker"]),
  e("marquee", "Marquee", "Signature", ["Marquee"]),
  e("cursor-trail", "Cursor trail", "Signature", ["CursorTrail"]),
  e("hero", "Hero", "Blocks", ["Hero"], "blocks/hero"),
  e("feature-grid", "Feature grid", "Blocks", ["FeatureGrid"], "blocks/feature-grid"),
  e("pricing", "Pricing", "Blocks", ["Pricing"], "blocks/pricing"),
  e("site-header", "Site header", "Blocks", ["SiteHeader"], "blocks/site-header"),
  e("site-footer", "Site footer", "Blocks", ["SiteFooter"], "blocks/site-footer"),
  e(
    "pixels",
    "Pixels",
    "Primitives",
    ["Pixels", "RollLabel", "PixelSpinner"],
    "pixels/Pixels",
  ),
];

export const groups = [
  "Core",
  "Forms",
  "Overlays",
  "Data display",
  "Signature",
  "Blocks",
  "Primitives",
] as const;
export const bySlug = (slug: string) => catalog.find((c) => c.slug === slug);
