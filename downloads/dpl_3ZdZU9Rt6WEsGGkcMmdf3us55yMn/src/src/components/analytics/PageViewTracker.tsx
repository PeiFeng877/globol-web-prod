"use client";

/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: 当前路由信息
 * OUTPUT: page_view 事件上报（无 UI）
 * POS: components/analytics
 * CONTRACT: 每次路由变化上报一次 page_view。
 * 职责: 解决 SPA 路由未自动统计页面访问的问题。
 */
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale } from "@/i18n/client";
import { trackPageView } from "@/lib/firebase/analytics";

export function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const query = searchParams?.toString() ?? "";

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const path = query ? `${pathname}?${query}` : pathname;
    const title = typeof document === "undefined" ? undefined : document.title;
    const location = typeof window === "undefined" ? undefined : window.location.href;

    void trackPageView({
      path,
      title,
      location,
      locale,
    });
  }, [pathname, query, locale]);

  return null;
}
