import React, { Suspense } from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default async function LocalizedLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    return (
        <>
            <Suspense fallback={<div className="h-20 bg-white/90 backdrop-blur border-b border-gray-100" />}>
                <Navbar />
            </Suspense>
            <main className="flex-grow pt-20">
                {children}
            </main>
            <Suspense fallback={null}>
                <Footer />
            </Suspense>
        </>
    );
}
