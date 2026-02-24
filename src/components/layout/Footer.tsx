'use client';

/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 2026-02-25 Footer 法务入口改为 CDN 直链，变更时更新此头部，然后检查 AGENTS.md
 *
 * INPUT: Locale dictionary
 * OUTPUT: Footer section
 * POS: Layout Component
 * CONTRACT: Renders localized footer links and legal links.
 * 职责: 页脚导航与公司信息。
 * CHANGE: 2026-02-05 隐藏 International Dating 入口
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/i18n/client';
import { Globe } from 'lucide-react';

export const Footer = () => {
  const { t, locale } = useTranslation();
  const showInternationalDating = true;
  const privacyCdnUrl = 'https://cdn.globol.im/term/privacy.html';
  const termsCdnUrl = 'https://cdn.globol.im/term/agreement.html';

  const getLocalizedLink = (path: string) => {
    if (locale === 'en') return path;
    return `/${locale}${path}`;
  };

  const popularArticles = [
    {
      slug: 'at-home-date-night-ideas',
      title: t.footerArticles.atHomeDate,
    },
    {
      slug: 'best-first-date-ideas',
      title: t.footerArticles.bestFirstDate,
    },
    {
      slug: 'cheap-date-ideas',
      title: t.footerArticles.cheapDate,
    },
    {
      slug: 'cute-date-ideas',
      title: t.footerArticles.cuteDate,
    },
    {
      slug: 'fun-date-ideas',
      title: t.footerArticles.funDate,
    },
  ];

  return (
    <footer className="w-full bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Column 1: Brand (2 spans) */}
          <div className="lg:col-span-2 flex flex-col items-start gap-6">
            <Link href={getLocalizedLink('/')} className="flex items-center gap-2">
               <Image 
                 src="/assets/logo.webp" 
                 alt="Globol" 
                 width={100} 
                 height={32} 
                 className="w-auto h-8 rounded-md"
               />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
              {t.footer.brandSlogan}
            </p>
          </div>

          {/* Column 2: Discover */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">{t.footer.discover}</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-500">
              <li>
                <Link href={getLocalizedLink('/date-ideas')} className="hover:text-yellow-600 transition-colors">
                  {t.common.dateIdeas}
                </Link>
              </li>
              {showInternationalDating && (
                <li>
                  <Link href={getLocalizedLink('/international-dating')} className="hover:text-yellow-600 transition-colors">
                    {t.common.internationalDating}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3: Popular */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">{t.footer.popular}</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-500">
              {popularArticles.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={getLocalizedLink(`/date-ideas/${item.slug}`)}
                    className="hover:text-yellow-600 transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Company */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-gray-900">{t.footer.company}</h4>
            <ul className="flex flex-col gap-3 text-sm text-gray-500">
              <li>
                <Link href={getLocalizedLink('/about')} className="hover:text-yellow-600 transition-colors">
                  {t.footer.aboutUs}
                </Link>
              </li>
              <li>
                <Link href={getLocalizedLink('/contact')} className="hover:text-yellow-600 transition-colors">
                  {t.footer.contact}
                </Link>
              </li>
              <li>
                <a href={privacyCdnUrl} className="hover:text-yellow-600 transition-colors">
                  {t.footer.privacy}
                </a>
              </li>
              <li>
                <a href={termsCdnUrl} className="hover:text-yellow-600 transition-colors">
                  {t.footer.terms}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>{t.footer.rights}</p>
          <div className="flex items-center gap-2">
             <Globe size={14} />
             <span>Globol Inc.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
