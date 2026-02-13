"use client";

/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: 无
 * OUTPUT: 初始化 Firebase Analytics（无 UI）
 * POS: components/analytics
 * CONTRACT: 仅在客户端挂载时执行一次。
 * 职责: 在页面加载时触发 Analytics 初始化。
 */
import { useEffect } from "react";
import { initFirebaseAnalytics } from "@/lib/firebase/client";

export function FirebaseAnalytics() {
  useEffect(() => {
    void initFirebaseAnalytics();
  }, []);

  return null;
}
