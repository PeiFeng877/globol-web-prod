/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: children, params: { locale }
 * OUTPUT: HTML shell + Localized layout with Navbar, Footer, and I18nProvider
 * POS: Root Locale Layout
 * CONTRACT: Applies global metadata, fonts, HTML lang attribute dynamically, and injects i18n context.
 * 职责: 定义全局骨架、动态设置 HTML lang、挂载客户端统计（Firebase/Vercel Analytics/Speed Insights），并注入导航、页脚与 i18n 上下文。
 */
import type { Metadata } from "next";
import React, { Suspense } from 'react';
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { I18nProvider } from "@/i18n/provider";
import { getDictionary } from "@/i18n/server";
import { FirebaseAnalytics } from "@/components/analytics/FirebaseAnalytics";
import { PageViewTracker } from "@/components/analytics/PageViewTracker";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "../../globals.css";

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

export default async function LocalizedRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dictionary = getDictionary(locale);

  return (
    <html lang={locale}>
      <head>
        {/* 预连接关键第三方域名，消除图片与字体请求的 DNS/TCP/TLS 握手延迟 */}
        <link rel="preconnect" href="https://public.blob.vercel-storage.com" />
        <link rel="dns-prefetch" href="https://public.blob.vercel-storage.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Globol",
              "url": "https://www.globol.im",
              "logo": "https://www.globol.im/favicon.ico",
              "description": "Connect with friends worldwide, share your moments, chat in your language with real-time translation.",
              "sameAs": [
                "https://twitter.com/globol_im",
                "https://www.facebook.com/globol.im",
                "https://www.instagram.com/globol.im"
              ]
            })
          }}
        />
        <FirebaseAnalytics />
        <SpeedInsights />
        <Analytics />
        <Suspense fallback={null}>
          <PageViewTracker />
        </Suspense>

        <I18nProvider locale={locale} dictionary={dictionary}>
          <Suspense fallback={<div className="h-20 bg-white/90 backdrop-blur border-b border-gray-100" />}>
            <Navbar />
          </Suspense>
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Suspense fallback={null}>
            <Footer />
          </Suspense>
        </I18nProvider>
      </body>
    </html>
  );
}
