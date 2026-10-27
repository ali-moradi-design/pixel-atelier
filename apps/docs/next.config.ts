import type { NextConfig } from "next";

// Static export: the site is plain files served by Nginx (no Node server).
const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  transpilePackages: ["@pixelbits/tokens"],
};
export default config;
