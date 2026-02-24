/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 2026-02-08 新增聊天类型契约；变更时更新此头部，然后检查 AGENTS.md
 *
 * INPUT: Chat roles/messages/session data
 * OUTPUT: Strongly typed chat contracts
 * POS: features/dating/chat type layer
 * CONTRACT: Defines storage-safe chat models and trait summaries.
 * 职责: 统一聊天窗口与本地存储的数据结构。
 */

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  sender: string;
  content: string;
  ts: number;
}

export type LanguagePreference = "zh" | "en" | "mixed";

export interface TraitSummary {
  languagePreference: LanguagePreference;
  interests: string[];
  style: "friendly" | "direct" | "curious";
}

export interface ChatSessionState {
  messages: ChatMessage[];
  userMessageCount: number;
  limitReached: boolean;
  traitSummary?: TraitSummary;
  updatedAt: number;
}
