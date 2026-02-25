/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: I18nContext (from provider.tsx)
 * OUTPUT: useLocale/useTranslation hooks
 * POS: i18n Client
 * CONTRACT: Reads locale and dictionary from React Context.
 *           No longer imports locale JSON files — dictionary is injected by server-side I18nProvider.
 * 职责: 客户端语言与翻译钩子（零字典 import，从 Context 读取）。
 */
'use client';

import { useI18nContext } from './provider';

export { useI18nContext };

export function useLocale() {
  const { locale } = useI18nContext();
  return locale;
}

export function useTranslation() {
  return useI18nContext();
}
