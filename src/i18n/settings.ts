/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 *
 * INPUT: None
 * OUTPUT: Locale constants
 * POS: i18n Config
 * CONTRACT: Defines default locale and supported locales list.
 * 职责: 国际化配置单一事实源。
 */
export const defaultLocale = 'en';
// Order: English, Chinese, then alphabetical order of added languages from Google Index
export const locales = [
  'en', 
  'zh', 
  'de', // German
  'es', // Spanish (New: Spain & LatAm)
  'fr', // French
  'hi', // Hindi (New: India)
  'id', // Indonesian (New: Indonesia)
  'it', // Italian
  'ja', // Japanese
  'ko', // Korean
  'nl', // Dutch
  'pt', // Portuguese (Brazil & Portugal)
  'ru', // Russian
  'th', // Thai
  'vi'  // Vietnamese
];
export type Locale = (typeof locales)[number];
