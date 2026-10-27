/** Site-wide settings: one place for the name, URLs and links. */
export const site = {
  name: "Pixelbits",
  tagline: "Pixels, crafted with care.",
  description:
    "Pixelbits is a calm, luxurious React UI kit whose pixel effects appear only at the moment of interaction. Tailwind v4, native dialog and popover, OKLCH tokens, tiny tree-shaken bundles.",
  url: process.env.SITE_URL ?? "https://pixelbits.ali-moradi-develop.com",
  repo: "https://github.com/ali-moradi-design/pixelbits",
  npm: "https://www.npmjs.com/package/pixelbits",
  author: { name: "Ali Moradi", url: "https://ali-moradi-develop.com" },
  /** Storybook is a separate static app: the dev server in development, a copied folder in production. */
  storybook:
    process.env.NODE_ENV === "development"
      ? "http://localhost:6006"
      : "/storybook/index.html",
  keywords: [
    "React UI kit",
    "React components",
    "Tailwind CSS v4",
    "pixel art UI",
    "design system",
    "shadcn registry",
    "accessible components",
    "RTL",
    "Next.js",
  ],
} as const;

export const absolute = (path: string) => new URL(path, site.url).toString();
