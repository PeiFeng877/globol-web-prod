/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: children: React.ReactNode
 * OUTPUT: HTML shell + global layout
 * POS: App Root Layout
 * CONTRACT: Applies global metadata, fonts, layout chrome, and analytics trackers.
 * 职责: 定义全局骨架、字体与基础布局，并挂载客户端统计。
 */
import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { FirebaseAnalytics } from "@/components/analytics/FirebaseAnalytics";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { defaultLocale } from "@/i18n/settings";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.globol.im'),
  title: "Globol - Connect with Global Friends",
  description: "Globol - Connect with friends worldwide, share your moments, chat in your language with real-time translation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale}>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <FirebaseAnalytics />
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
