import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { PixelTransition } from "pixelbits/page-transition";
import { Toaster } from "pixelbits/toast";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { fontVariables } from "@/fonts";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import "@/styles/globals.css";

export const metadata: Metadata = {
  ...pageMetadata({ path: "/" }),
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: React UI kit with pixel effects`,
    template: `%s · ${site.name}`,
  },
  applicationName: site.name,
  keywords: [...site.keywords],
  authors: [{ name: site.author.name, url: site.author.url }],
  creator: site.author.name,
  publisher: site.author.name,
  category: "technology",
  formatDetection: { telephone: false, email: false, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0d0d0f" },
    { media: "(prefers-color-scheme: light)", color: "#f6f4ef" },
  ],
  colorScheme: "dark light",
};

export default async function Layout({ children }: { children: ReactNode }) {
  // per-request CSP nonce from proxy.ts (also makes every page render per request)
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider nonce={nonce}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:inset-s-4 focus:top-3 focus:z-50 focus:bg-pb-accent focus:px-3 focus:py-2 focus:text-pb-on-accent"
          >
            Skip to content
          </a>
          <SiteHeader />
          <div id="main" className="flex-1">
            {children}
          </div>
          <SiteFooter />
          <Toaster />
          <PixelTransition />
          <SmoothScroll />
        </ThemeProvider>
      </body>
    </html>
  );
}
