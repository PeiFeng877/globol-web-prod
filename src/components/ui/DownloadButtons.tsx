/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: None
 * OUTPUT: Download CTA buttons with external links
 * POS: UI Utility
 * CONTRACT: Renders localized App Store and APK download CTA buttons and tracks clicks.
 * 职责: 下载转化按钮组（含埋点上报）。
 */
'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslation } from '@/i18n/client';
import { trackDownloadClick } from '@/lib/firebase/analytics';

const APP_STORE_URL = 'https://apps.apple.com/sg/app/globol-make-global-connections/id6754004882';
const APK_DOWNLOAD_URL = 'https://cdn2.globol.net/apk/globol_release.apk';
const APPLE_ICON = '/assets/ic_apple.webp';
const ANDROID_ICON = '/assets/ic_goolgeplay.webp';

interface DownloadButtonsProps {
  className?: string;
  buttonClassName?: string;
  iconClassName?: string;
}

export const DownloadButtons = ({ className = '', buttonClassName = '', iconClassName = '' }: DownloadButtonsProps) => {
  const { t, locale } = useTranslation();

  const handleDownloadClick = (store: 'app_store' | 'apk') => {
    const path = typeof window === 'undefined' ? undefined : `${window.location.pathname}${window.location.search}`;
    void trackDownloadClick({ store, locale, path });
  };

  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors ${buttonClassName}`}
        aria-label="Download Globol on the App Store"
        onClick={() => handleDownloadClick('app_store')}
      >
        <Image
          src={APPLE_ICON}
          alt="App Store"
          width={24}
          height={24}
          className={`w-6 h-6 ${iconClassName}`}
        />
        <div className="text-left leading-tight">
          <div className="text-[10px]">{t.download.appStoreLine1}</div>
          <div className="text-sm font-bold">{t.download.appStoreLine2}</div>
        </div>
      </a>
      
      <a
        href={APK_DOWNLOAD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors ${buttonClassName}`}
        aria-label="Download Globol APK"
        onClick={() => handleDownloadClick('apk')}
      >
        <Image
          src={ANDROID_ICON}
          alt="Official Download"
          width={24}
          height={24}
          className={`w-6 h-6 ${iconClassName}`}
        />
        <div className="text-left leading-tight">
          <div className="text-[10px]">{t.download.apkLine1}</div>
          <div className="text-sm font-bold">{t.download.apkLine2}</div>
        </div>
      </a>
    </div>
  );
};
