import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Toaster } from "pixelbits/toast";
import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { fontVariables, persianY } from "@/fonts";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";
import "@/styles/globals.css";

const description =
  "پیکسل‌بیتس یک کیت رابط کاربری آرام و لوکس برای ری‌اکت است که افکت‌های پیکسلی‌اش فقط هنگام تعامل ظاهر می‌شوند؛ با پشتیبانی کامل از راست‌به‌چپ.";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "پیکسل‌بیتس، کیت رابط کاربری ری‌اکت",
    description,
    path: "/fa/",
    locale: "fa_IR",
  }),
  title: { absolute: "پیکسل‌بیتس | کیت رابط کاربری ری‌اکت با افکت‌های پیکسلی" },
  metadataBase: new URL(site.url),
  applicationName: site.name,
  authors: [{ name: site.author.name, url: site.author.url }],
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

export default async function FaLayout({ children }: { children: ReactNode }) {
  // per-request CSP nonce from proxy.ts (also makes every page render per request)
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${fontVariables} ${persianY.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-dvh flex-col">
        <ThemeProvider nonce={nonce}>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:inset-s-4 focus:top-3 focus:z-50 focus:bg-pb-accent focus:px-3 focus:py-2 focus:text-pb-on-accent"
          >
            رفتن به محتوا
          </a>
          {children}
          <Toaster position="bottom-start" />
          <SmoothScroll />
        </ThemeProvider>
      </body>
    </html>
  );
}
