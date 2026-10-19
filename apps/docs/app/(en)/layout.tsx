import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { PixelTransition } from "pixel-atelier/page-transition";
import { Toaster } from "pixel-atelier/toast";
import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://pixel-atelier.ali-moradi-develop.com"),
  title: {
    default: "Pixel Atelier — pixels, crafted with care",
    template: "%s · Pixel Atelier",
  },
  description:
    "A calm React UI kit whose pixel effects appear only at the moment of interaction. Tailwind v4, native dialog and popover, tiny bundles.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }],
    apple: "/apple-touch-icon.png",
  },
  openGraph: { images: "/social-preview.png" },
};

const restoreTheme = `try{var t=localStorage.getItem("pa-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: restores the saved theme before paint */}
        <script dangerouslySetInnerHTML={{ __html: restoreTheme }} />
      </head>
      <body className="min-h-dvh">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-3 focus:z-50 focus:bg-pa-accent focus:px-3 focus:py-2 focus:text-pa-on-accent"
        >
          Skip to content
        </a>
        <SiteHeader />
        <div id="main">{children}</div>
        <SiteFooter />
        <Toaster />
        <PixelTransition />
      </body>
    </html>
  );
}
