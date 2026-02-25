'use client';

/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: title + canonical url
 * OUTPUT: Share button group
 * POS: UI Utility
 * CONTRACT: Provides social share and copy-link interactions.
 * 职责: 文章分享与复制链接。
 * CHANGE: 2026-02-05 使用 canonical URL，避免语言路径混淆。
 */

import React, { useState } from 'react';
import { Facebook, Linkedin, Twitter, Share2, Check } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const handleShare = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    if (!url) return;

    let shareUrl = '';
    const text = encodeURIComponent(title);
    const href = encodeURIComponent(url);

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${href}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${href}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${href}`;
        break;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = async () => {
    if (!url) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Error sharing:', err);
      // Fallback to clipboard if share fails or is cancelled
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (clipboardErr) {
        console.error('Clipboard failed', clipboardErr);
      }
    }
  };

  return (
    <div className="flex gap-4">
      <button 
        onClick={() => handleShare('facebook')}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-[#1877F2]"
        aria-label="Share on Facebook"
      >
        <Facebook size={20} />
      </button>
      <button 
        onClick={() => handleShare('twitter')}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-[#1DA1F2]"
        aria-label="Share on Twitter"
      >
        <Twitter size={20} />
      </button>
      <button 
        onClick={() => handleShare('linkedin')}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-[#0A66C2]"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={20} />
      </button>
      <button 
        onClick={handleCopyLink}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-gray-900 relative"
        aria-label="Copy Link"
      >
        {copied ? <Check size={20} className="text-green-600" /> : <Share2 size={20} />}
      </button>
    </div>
  );
};
