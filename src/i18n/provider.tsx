/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: locale: string, dictionary: Record<string, any>, children
 * OUTPUT: I18n context provider
 * POS: i18n Context
 * CONTRACT: Provides locale + dictionary via React Context, enabling
 *           client components to read translations without importing all locales.
 * 职责: 将服务端传入的单一语种字典通过 Context 下发给客户端组件。
 */
'use client';

import { createContext, useContext, type ReactNode } from 'react';

interface I18nContextValue {
    locale: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    t: Record<string, any>;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
    locale,
    dictionary,
    children,
}: {
    locale: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dictionary: Record<string, any>;
    children: ReactNode;
}) {
    return (
        <I18nContext.Provider value={{ locale, t: dictionary }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18nContext(): I18nContextValue {
    const ctx = useContext(I18nContext);
    if (!ctx) {
        throw new Error('useI18nContext must be used within <I18nProvider>');
    }
    return ctx;
}
