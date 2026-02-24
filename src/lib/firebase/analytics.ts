/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 变更时更新此头部，然后检查 AGENTS.md
 *
 * INPUT: 事件名称 + 参数
 * OUTPUT: Firebase Analytics 事件上报
 * POS: lib/firebase 事件埋点层
 * CONTRACT: 在浏览器环境中按需初始化并上报事件。
 * 职责: 统一的 Analytics 事件上报入口。
 */
import { logEvent, type Analytics } from "firebase/analytics";
import { initFirebaseAnalytics } from "./client";

type AnalyticsEventParams = Record<string, string | number | boolean | undefined>;

type PageViewPayload = {
  path: string;
  title?: string;
  location?: string;
  locale?: string;
};

type DownloadClickPayload = {
  store: "app_store" | "apk";
  placement?: string;
  locale?: string;
  path?: string;
};

type AiChatMessagePayload = {
  profileId: string;
  locale?: string;
};

let analyticsInstance: Analytics | null = null;
let analyticsInitPromise: Promise<Analytics | null> | null = null;

async function getAnalytics(): Promise<Analytics | null> {
  if (analyticsInstance) {
    return analyticsInstance;
  }

  if (!analyticsInitPromise) {
    analyticsInitPromise = initFirebaseAnalytics();
  }

  analyticsInstance = await analyticsInitPromise;
  return analyticsInstance;
}

async function track(eventName: string, params?: AnalyticsEventParams) {
  const analytics = await getAnalytics();
  if (!analytics) {
    return;
  }

  if (params) {
    logEvent(analytics, eventName, params);
    return;
  }

  logEvent(analytics, eventName);
}

export async function trackPageView(payload: PageViewPayload) {
  const { path, title, location, locale } = payload;
  await track("page_view", {
    page_path: path,
    page_title: title,
    page_location: location,
    locale,
  });
}

export async function trackDownloadClick(payload: DownloadClickPayload) {
  const { store, placement, locale, path } = payload;
  await track("download_click", {
    store,
    placement,
    locale,
    page_path: path,
  });
}

export async function trackAiChatMessage(payload: AiChatMessagePayload) {
  const { profileId, locale } = payload;
  await track("ai_chat_message", {
    profile_id: profileId,
    locale,
  });
}
