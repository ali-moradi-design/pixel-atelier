import { join } from "node:path";
import type { NextConfig } from "next";

// The docs site runs as a Next.js server in a container (output: "standalone").
// The pages' Content Security Policy is set per request with a nonce in
// proxy.ts (Next.js guide "Content Security Policy", section "Nonces").

// Storybook (public/storybook) is a separate static app with its own inline scripts.
const storybookCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'none'",
  "frame-ancestors 'self'",
].join("; ");

const security = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const config: NextConfig = {
  output: "standalone",
  // pnpm workspace: trace files from the repository root
  outputFileTracingRoot: join(import.meta.dirname, "../../"),
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
  // Nginx on the server gzips responses (gzip_proxied any): no second compression in Node
  compress: false,
  transpilePackages: ["@pixelbits/tokens"],
  // public/ folders have no directory index: /storybook/ -> its index.html
  async rewrites() {
    return [{ source: "/storybook", destination: "/storybook/index.html" }];
  },
  async headers() {
    return [
      {
        source: "/:path((?!storybook/).*)",
        headers: security,
      },
      {
        source: "/storybook/:path*",
        headers: [...security, { key: "Content-Security-Policy", value: storybookCsp }],
      },
      {
        // Storybook's hashed build files (a theme change reloads the preview frame)
        source: "/storybook/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // shadcn registry JSON: readable by the shadcn CLI from anywhere
        source: "/r/:path*",
        headers: [{ key: "Access-Control-Allow-Origin", value: "*" }],
      },
    ];
  },
};
export default config;
