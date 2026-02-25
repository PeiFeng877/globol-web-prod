/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 2026-02-08 新增聊天本地存储工具；变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: profileId + chat session
 * OUTPUT: Persistent localStorage session state
 * POS: features/dating/chat storage layer
 * CONTRACT: Reads/writes per-profile chat state with safe fallback.
 * 职责: 按角色隔离聊天记录，并在坏数据时回退默认值。
 */

import type { ChatMessage, ChatSessionState } from "./types";

const STORAGE_PREFIX = "globol.chat.v1";
const MAX_USER_MESSAGES = 3;

const createDefaultState = (): ChatSessionState => ({
  messages: [],
  userMessageCount: 0,
  limitReached: false,
  updatedAt: Date.now(),
});

const isClient = typeof window !== "undefined";

const getStorageKey = (profileId: string) => `${STORAGE_PREFIX}.${profileId}`;

const countUserMessages = (messages: ChatMessage[]) =>
  messages.filter((message) => message.role === "user").length;

export const getMaxUserMessages = () => MAX_USER_MESSAGES;

export const loadChatSession = (profileId: string): ChatSessionState => {
  if (!isClient) {
    return createDefaultState();
  }

  try {
    const raw = window.localStorage.getItem(getStorageKey(profileId));
    if (!raw) {
      return createDefaultState();
    }

    const parsed = JSON.parse(raw) as Partial<ChatSessionState>;
    const messages = Array.isArray(parsed.messages) ? parsed.messages : [];
    const userMessageCount = countUserMessages(messages);

    return {
      messages,
      userMessageCount,
      limitReached: userMessageCount >= MAX_USER_MESSAGES,
      traitSummary: parsed.traitSummary,
      updatedAt: typeof parsed.updatedAt === "number" ? parsed.updatedAt : Date.now(),
    };
  } catch {
    return createDefaultState();
  }
};

export const saveChatSession = (profileId: string, session: ChatSessionState) => {
  if (!isClient) {
    return;
  }

  window.localStorage.setItem(getStorageKey(profileId), JSON.stringify(session));
};

export const createNextState = (
  previous: ChatSessionState,
  updates: Partial<ChatSessionState>
): ChatSessionState => {
  const mergedMessages = updates.messages ?? previous.messages;
  const userMessageCount = countUserMessages(mergedMessages);
  return {
    ...previous,
    ...updates,
    messages: mergedMessages,
    userMessageCount,
    limitReached: userMessageCount >= MAX_USER_MESSAGES,
    updatedAt: Date.now(),
  };
};
