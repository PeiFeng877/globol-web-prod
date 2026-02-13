/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 2026-02-08 新增三条消息特征提取器；变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: User messages + locale
 * OUTPUT: Trait summary + localized CTA sentence
 * POS: features/dating/chat risk-control layer
 * CONTRACT: Uses deterministic rules only, no extra model calls.
 * 职责: 低成本识别用户偏好并生成下载引导语。
 */

import type { TraitSummary } from "./types";

const INTEREST_RULES = [
  { tag: "Travel", keywords: ["travel", "trip", "city", "country", "旅行", "出行", "旅游"] },
  { tag: "Music", keywords: ["music", "song", "concert", "音乐", "歌曲", "演唱会"] },
  { tag: "Food", keywords: ["food", "eat", "dinner", "coffee", "restaurant", "美食", "吃", "咖啡", "餐厅"] },
  { tag: "Movies", keywords: ["movie", "film", "cinema", "drama", "电影", "影院", "剧"] },
  { tag: "Fitness", keywords: ["gym", "run", "fitness", "yoga", "健身", "跑步", "瑜伽"] },
];

const hasChinese = (text: string) => /[\u4e00-\u9fff]/.test(text);
const hasLatin = (text: string) => /[A-Za-z]/.test(text);

const dedupe = <T>(items: T[]) => Array.from(new Set(items));

const pickStyle = (joinedText: string): TraitSummary["style"] => {
  if (joinedText.includes("?") || joinedText.includes("？")) {
    return "curious";
  }
  if (joinedText.length <= 80) {
    return "direct";
  }
  return "friendly";
};

export const extractTraits = (userMessages: string[]): TraitSummary => {
  const joinedText = userMessages.join(" ").toLowerCase();
  const containsZh = hasChinese(joinedText);
  const containsEn = hasLatin(joinedText);

  const languagePreference: TraitSummary["languagePreference"] = containsZh && containsEn
    ? "mixed"
    : containsZh
      ? "zh"
      : "en";

  const interests = dedupe(
    INTEREST_RULES
      .filter((rule) => rule.keywords.some((keyword) => joinedText.includes(keyword)))
      .map((rule) => rule.tag)
  ).slice(0, 2);

  return {
    languagePreference,
    interests,
    style: pickStyle(joinedText),
  };
};

export const buildTraitCta = (
  summary: TraitSummary,
  locale: string
) => {
  const topInterest = summary.interests[0] ?? (locale === "zh" ? "聊天" : "chat");
  if (locale === "zh") {
    return `想继续聊${topInterest}？下载 App 解锁无限对话。`;
  }
  return `Enjoying ${topInterest.toLowerCase()} chat? Download the app for unlimited replies.`;
};
