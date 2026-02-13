'use client';

/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: URL pathname
 * OUTPUT: useLocale/useTranslation hooks
 * POS: i18n Client
 * CONTRACT: Infers locale from path and returns dictionary access.
 * 职责: 客户端语言推断与翻译钩子。
 */

import { usePathname } from 'next/navigation';
import { defaultLocale, locales, Locale } from './settings';
import en from './locales/en.json';
import zh from './locales/zh.json';
import de from './locales/de.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import hi from './locales/hi.json';
import id from './locales/id.json';
import it from './locales/it.json';
import ja from './locales/ja.json';
import ko from './locales/ko.json';
import nl from './locales/nl.json';
import pt from './locales/pt.json';
import ru from './locales/ru.json';
import th from './locales/th.json';
import vi from './locales/vi.json';

const dictionaries: Record<string, any> = {
  en,
  zh,
  de,
  es,
  fr,
  hi,
  id,
  it,
  ja,
  ko,
  nl,
  pt,
  ru,
  th,
  vi,
};

export function useLocale() {
  const pathname = usePathname();
  const segment = pathname?.split('/')[1];
  const locale = locales.includes(segment) ? segment : defaultLocale;
  return locale as Locale;
}

export function useTranslation() {
  const locale = useLocale();
  const t = dictionaries[locale] || dictionaries[defaultLocale];
  return { t, locale };
}
