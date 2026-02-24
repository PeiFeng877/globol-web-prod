/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 *
 * INPUT: None (Context via useTranslation)
 * OUTPUT: Localized 404 UI
 * POS: App Router Page
 * CONTRACT: Renders a friendly 404 message within the localized segment.
 * 职责: 捕获多语言路由下的 404 错误并展示导向首页的链接。
 */

'use client';

import Link from 'next/link';
import { useTranslation } from '@/i18n/client';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const { t, locale } = useTranslation();
  
  // Robust fallbacks for translation keys
  const title = t?.notFound?.title || 'Page Not Found';
  const description = t?.notFound?.description || "Sorry, we couldn't find the page you're looking for.";
  const backHome = t?.notFound?.backHome || 'Back to Home';
  
  const homeLink = locale === 'en' ? '/' : `/${locale}`;

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-yellow-400 select-none">404</h1>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {title}
        </h2>
        
        <p className="text-gray-600 mb-10 leading-relaxed">
          {description}
        </p>
        
        <Link 
          href={homeLink}
          className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <ArrowLeft size={18} />
          {backHome}
        </Link>
      </div>
    </div>
  );
}
