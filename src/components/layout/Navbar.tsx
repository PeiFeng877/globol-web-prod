'use client';

/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: Locale dictionary
 * OUTPUT: Top navigation bar with responsive menus
 * POS: Layout Component
 * CONTRACT: Renders localized nav links, mobile menu, and language switcher with overlay.
 * 职责: 顶部导航与移动端菜单布局（含遮罩）。
 * CHANGE: 2026-02-06 显示 International Dating 入口
 */

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/i18n/client';
import LanguageSwitcher from './LanguageSwitcher';
import { Menu, X, ChevronRight } from 'lucide-react';

export const Navbar = () => {
  const { t, locale } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getLocalizedLink = (path: string) => {
    if (locale === 'en') return path;
    return `/${locale}${path}`;
  };

  const primaryLinks = [
    { href: getLocalizedLink('/date-ideas'), label: t.common.dateIdeas, isHidden: false },
    { href: getLocalizedLink('/international-dating'), label: t.common.internationalDating, isHidden: false },
  ];
  const visiblePrimaryLinks = primaryLinks.filter((item) => !item.isHidden);

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
      <div className="relative">
        {/* Top Bar */}
        <div className="container mx-auto px-6 md:px-16 lg:px-24 flex items-center h-20">
          <div className="flex items-center gap-8">
            <Link href={getLocalizedLink('/')} className="flex items-center gap-2">
              <Image
                src="/assets/logo.webp"
                alt="Globol Logo"
                width={105}
                height={44}
                className="w-[105px] h-[44px] object-contain"
                priority
              />
            </Link>

            {/* Desktop Primary Nav */}
            <div className="hidden lg:flex items-center gap-6">
              {visiblePrimaryLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Language Switcher */}
          <div className="hidden lg:flex items-center justify-end ml-auto">
            <LanguageSwitcher />
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 lg:hidden ml-auto">
            <LanguageSwitcher variant="icon" />
            <button
              type="button"
              onClick={handleToggleMenu}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
              className="w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-700 hover:text-gray-900 hover:border-gray-300 transition-colors inline-flex items-center justify-center"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Tablet + Mobile Menu Card */}
        {isMenuOpen && (
          <div className="absolute right-6 md:right-16 lg:hidden top-20 mt-4 z-50">
            <div className="w-64 bg-white rounded-3xl shadow-xl border border-gray-100 p-4">
              <div className="grid gap-1">
                {visiblePrimaryLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-base font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={18} className="text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
