import { defineConfig } from "tsdown";

// One output file per source file (unbundled), so bundlers can drop every
// component an app does not import, and "use client" stays on the files that
// need it.
export default defineConfig({
  entry: [
    "src/index.ts",
    "src/components/*.tsx",
    "src/blocks/*.tsx",
    "!src/**/*.{test,stories}.tsx",
    "src/pixels/index.ts",
  ],
  format: "esm",
  unbundle: true,
  dts: true,
  platform: "neutral",
  target: "es2022",
  clean: true,
  deps: {
    neverBundle: [
      /^react($|\/)/,
      /^react-dom/,
      /^@radix-ui\//,
      "class-variance-authority",
    ],
  },
});
