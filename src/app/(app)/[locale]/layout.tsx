/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: children, params: { locale }
 * OUTPUT: Localized layout with Navbar, Footer, and I18nProvider
 * POS: Locale Layout
 * CONTRACT: Injects locale dictionary into I18nProvider for all child client components.
 * 职责: 多语言布局骨架，注入导航、页脚与 i18n 上下文。
 */
import React, { Suspense } from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { I18nProvider } from "@/i18n/provider";
import { getDictionary } from "@/i18n/server";

export default async function LocalizedLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const dictionary = getDictionary(locale);

    return (
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
    );
}
