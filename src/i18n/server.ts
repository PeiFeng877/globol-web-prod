/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: locale: string
 * OUTPUT: Dictionary object
 * POS: i18n Server
 * CONTRACT: Resolves locale dictionary with default fallback.
 * 职责: 服务端字典加载与回退策略。
 */
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
import { defaultLocale } from './settings';

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

export const getDictionary = (locale: string) => {
  return dictionaries[locale] || dictionaries[defaultLocale];
};
