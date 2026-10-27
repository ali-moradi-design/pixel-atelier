import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import { Toaster } from "pixelbits/toast";
import type { ReactNode } from "react";
import "../../globals.css";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "پیکسل آتلیه — نمایش راست‌به‌چپ",
  description: "همهٔ کامپوننت‌های Pixelbits در جهت راست‌به‌چپ و به زبان فارسی.",
  icons: { icon: "/favicon.svg" },
};

const restoreTheme = `try{var t=localStorage.getItem("pb-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function FaLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="fa"
      dir="rtl"
      data-theme="dark"
      className={`${GeistSans.variable} ${GeistMono.variable} ${vazir.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: restores the saved theme before paint */}
        <script dangerouslySetInnerHTML={{ __html: restoreTheme }} />
      </head>
      <body className="min-h-dvh">
        {children}
        <Toaster position="bottom-start" />
      </body>
    </html>
  );
}
