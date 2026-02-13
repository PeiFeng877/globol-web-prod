'use client';

/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: Current locale + router
 * OUTPUT: Language switcher UI
 * POS: Layout Component
 * CONTRACT: Toggles locale and updates route on selection.
 * 职责: 语言切换（支持桌面与移动端图标样式，适配 15 种语言）。
 */

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from '@/i18n/client';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { locales } from '@/i18n/settings';

const LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  zh: '中文',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  hi: 'हिन्दी',
  id: 'Bahasa Indonesia',
  it: 'Italiano',
  ja: '日本語',
  ko: '한국어',
  nl: 'Nederlands',
  pt: 'Português',
  ru: 'Русский',
  th: 'ภาษาไทย',
  vi: 'Tiếng Việt',
};

interface LanguageSwitcherProps {
  variant?: 'inline' | 'icon';
  className?: string;
}

export default function LanguageSwitcher({ variant = 'inline', className = '' }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const currentLocale = useLocale();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isIcon = variant === 'icon';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const switchLanguage = (newLocale: string) => {
    if (currentLocale === newLocale) {
      setIsOpen(false);
      return;
    }

    // Replace the locale prefix in the pathname
    // Regex: Start with / + currentLocale + (/ or end of string)
    // We need to handle the case where currentLocale is default (hidden) or explicitly present
    
    const segments = pathname.split('/');
    // segments[0] is always empty string for absolute paths
    const firstSegment = segments[1];

    let newPath;
    
    // Check if the first segment is a known locale
    if (locales.includes(firstSegment)) {
      // Replace existing locale
      segments[1] = newLocale;
      newPath = segments.join('/');
    } else {
      // No locale prefix (default locale), prepend new locale
      // Note: If newLocale is defaultLocale, middleware might strip it, but pushing /en/... is safe
      newPath = `/${newLocale}${pathname === '/' ? '' : pathname}`;
    }

    router.push(newPath);
    setIsOpen(false);
  };

  const buttonClasses = isIcon
    ? 'px-3 py-2 rounded-full border border-gray-200 bg-white text-gray-700 hover:text-gray-900 hover:border-gray-300 transition-colors flex items-center gap-1'
    : 'flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors';

  const dropdownClasses = isIcon
    ? 'absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 z-50 max-h-80 overflow-y-auto'
    : 'absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-1 border border-gray-100 z-50 max-h-80 overflow-y-auto';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={buttonClasses}
        aria-expanded={isOpen}
        aria-label="Switch language"
      >
        <span className="flex items-center gap-1">
          <Globe size={isIcon ? 18 : 16} />
          {!isIcon && <span>{LOCALE_LABELS[currentLocale] || currentLocale.toUpperCase()}</span>}
        </span>
        <ChevronDown
          size={isIcon ? 18 : 14}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className={dropdownClasses}>
          {locales.map((locale) => (
            <button
              key={locale}
              onClick={() => switchLanguage(locale)}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                currentLocale === locale ? 'text-yellow-600 font-medium bg-yellow-50' : 'text-gray-600'
              }`}
            >
              {LOCALE_LABELS[locale] || locale.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
