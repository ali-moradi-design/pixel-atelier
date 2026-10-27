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
  // Each file keeps its own "use client" (checked by test/guards), so the
  // bundler's "directive may not be preserved" warning does not apply here.
  inputOptions: {
    onLog(level, log, handler) {
      if (log.code === "MODULE_LEVEL_DIRECTIVE" && log.message.includes("use client"))
        return;
      handler(level, log);
    },
  },
  deps: {
    neverBundle: [
      /^react($|\/)/,
      /^react-dom/,
      /^@radix-ui\//,
      "class-variance-authority",
    ],
  },
});
