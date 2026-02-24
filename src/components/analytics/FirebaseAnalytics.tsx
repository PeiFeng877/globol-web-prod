/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 *
 * INPUT: 无
 * OUTPUT: 初始化 Firebase Analytics（无 UI）
 * POS: components/analytics
 * CONTRACT: 延迟加载 Firebase SDK，不阻塞首屏渲染。
 *           使用 requestIdleCallback 将初始化推迟到浏览器空闲时。
 * 职责: 在页面空闲时触发 Analytics 初始化。
 */
"use client";

import { useEffect } from "react";

export function FirebaseAnalytics() {
  useEffect(() => {
    // Defer initialization to avoid blocking the main thread (TBT optimization)
    const initAnalytics = () => {
      // Dynamic import: Firebase SDK 不进入首屏 JS bundle
      import("@/lib/firebase/client").then(({ initFirebaseAnalytics }) => {
        void initFirebaseAnalytics();
      });
    };

    // Use requestIdleCallback if available, otherwise fallback to setTimeout
    if ('requestIdleCallback' in window) {
      (window as typeof window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(initAnalytics);
    } else {
      setTimeout(initAnalytics, 2000);
    }
  }, []);

  return null;
}
