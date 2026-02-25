/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 2026-02-09 使用 Intl.RelativeTimeFormat 支持全语种相对时间格式化；变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: ISO timestamp string + locale
 * OUTPUT: Localized relative time string (e.g. "5 mins ago", "5 分钟前")
 * POS: Lib / Utility
 */

export function formatRelativeTime(timestamp: string, locale: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Normalize locale for Intl (e.g., 'en' stays 'en', 'zh' becomes 'zh-CN')
  const intlLocale = locale === 'zh' ? 'zh-CN' : locale;

  // < 1 minute
  if (diffInSeconds < 60) {
    const rtf = new Intl.RelativeTimeFormat(intlLocale, { numeric: 'auto' });
    return rtf.format(0, 'second');
  }

  // < 1 hour
  if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60);
    const rtf = new Intl.RelativeTimeFormat(intlLocale, { numeric: 'always' });
    return rtf.format(-mins, 'minute');
  }

  // < 24 hours
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    const rtf = new Intl.RelativeTimeFormat(intlLocale, { numeric: 'always' });
    return rtf.format(-hours, 'hour');
  }

  // < 7 days
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    const rtf = new Intl.RelativeTimeFormat(intlLocale, { numeric: 'auto' });
    return rtf.format(-days, 'day');
  }

  // > 7 days (Format as absolute Date)
  return new Intl.DateTimeFormat(intlLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}