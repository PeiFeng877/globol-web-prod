'use client';

/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 2026-02-08 优化头部单行、气泡自适应与上限下载提醒样式；变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: profile/locale/open state
 * OUTPUT: modal chat UI + local persistence + send logic
 * POS: features/dating/chat presentation layer
 * CONTRACT: Supports 3 user messages max per profile without login.
 * 职责: 提供简洁聊天窗口、历史展示与上限引导下载。
 */

import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import Button from "@/components/ui/Button";
import { DownloadButtons } from "@/components/ui/DownloadButtons";
import { useTranslation } from "@/i18n/client";
import {
  createNextState,
  loadChatSession,
  saveChatSession,
} from "./chat-storage";
import { buildTraitCta, extractTraits } from "./trait-extractor";
import type { ChatMessage, ChatSessionState } from "./types";

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
  profileName: string;
  locale: string;
}

const MAX_CONTEXT_MESSAGES = 6;

const createMessage = (
  role: ChatMessage["role"],
  sender: string,
  content: string
): ChatMessage => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
  role,
  sender,
  content,
  ts: Date.now(),
});

const formatTime = (timestamp: number, locale: string) =>
  new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : locale, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));

const emptyState: ChatSessionState = {
  messages: [],
  userMessageCount: 0,
  limitReached: false,
  updatedAt: Date.now(),
};

export default function ChatModal({
  isOpen,
  onClose,
  profileId,
  profileName,
  locale,
}: ChatModalProps) {
  const { t } = useTranslation();
  const [session, setSession] = useState<ChatSessionState>(emptyState);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const loaded = loadChatSession(profileId);
    if (loaded.limitReached && !loaded.traitSummary) {
      const userTexts = loaded.messages
        .filter((item) => item.role === "user")
        .map((item) => item.content);
      const summary = extractTraits(userTexts);
      const next = createNextState(loaded, { traitSummary: summary });
      setSession(next);
      saveChatSession(profileId, next);
      return;
    }

    setSession(loaded);
  }, [isOpen, profileId]);

  const canSend = !isSending && !session.limitReached;
  const traitCta = useMemo(() => {
    if (!session.limitReached) {
      return "";
    }
    const summary = session.traitSummary ?? extractTraits(
      session.messages.filter((item) => item.role === "user").map((item) => item.content)
    );
    return buildTraitCta(summary, locale);
  }, [locale, session.limitReached, session.messages, session.traitSummary]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || !canSend) {
      return;
    }

    const normalized = trimmed.slice(0, 300);
    const userMessage = createMessage("user", t.datingChat.youLabel, normalized);
    const messagesWithUser = [...session.messages, userMessage];
    const nextAfterUser = createNextState(session, { messages: messagesWithUser });
    setSession(nextAfterUser);
    saveChatSession(profileId, nextAfterUser);
    setInputValue("");
    setIsSending(true);

    try {
      const context = session.messages.slice(-MAX_CONTEXT_MESSAGES).map((message) => ({
        role: message.role,
        content: message.content,
        ts: message.ts,
      }));

      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId,
          locale,
          messages: context,
          userMessage: normalized,
        }),
      });

      if (!response.ok) {
        throw new Error("ai-chat-failed");
      }

      const data = (await response.json()) as { reply: string; nickname?: string; ts?: number };
      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        sender: data.nickname || profileName,
        content: data.reply,
        ts: data.ts ?? Date.now(),
      };

      const withAssistant = createNextState(nextAfterUser, {
        messages: [...messagesWithUser, assistantMessage],
      });

      if (withAssistant.limitReached) {
        const userTexts = withAssistant.messages
          .filter((item) => item.role === "user")
          .map((item) => item.content);
        withAssistant.traitSummary = extractTraits(userTexts);
      }

      setSession(withAssistant);
      saveChatSession(profileId, withAssistant);
    } catch {
      const fallbackMessage = createMessage("assistant", profileName, t.datingChat.errorReply);
      const failedState = createNextState(nextAfterUser, {
        messages: [...messagesWithUser, fallbackMessage],
      });
      setSession(failedState);
      saveChatSession(profileId, failedState);
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-gray-900">
            {t.datingChat.title} · {profileName}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label={t.datingChat.close}
          >
            <X size={16} />
          </button>
        </div>

        <div className="h-[360px] overflow-y-auto px-5 py-4">
          {session.messages.length === 0 ? (
            <p className="text-sm text-gray-500">{t.datingChat.emptyState}</p>
          ) : (
            <div className="space-y-4">
              {session.messages.map((message) => (
                <div key={message.id} className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.08em] text-gray-400">
                    <span>{message.sender}</span>
                    <span>•</span>
                    <span>{formatTime(message.ts, locale)}</span>
                  </div>
                  <div className={message.role === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div
                      className={
                        message.role === "user"
                          ? "inline-block max-w-[82%] whitespace-pre-wrap break-words rounded-2xl bg-gray-900 px-4 py-3 text-sm text-white"
                          : "inline-block max-w-[82%] whitespace-pre-wrap break-words rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-800"
                      }
                    >
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {session.limitReached && (
          <div className="px-5 py-5">
            <div className="mx-auto max-w-md rounded-2xl border border-amber-200 bg-white px-4 py-4 text-center shadow-sm">
              <p className="mb-3 text-sm font-medium text-amber-900">{traitCta || t.datingChat.limitReached}</p>
              <DownloadButtons
                className="justify-center gap-2"
                buttonClassName="px-4 py-2.5"
                iconClassName="w-5 h-5"
              />
            </div>
          </div>
        )}

        <div className="border-t border-gray-100 p-4">
          <div className="flex items-center gap-2">
            <input
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={t.datingChat.placeholder}
              maxLength={300}
              disabled={session.limitReached}
              className="h-11 flex-1 rounded-full border border-gray-200 px-4 text-sm outline-none transition-colors focus:border-gray-400 disabled:bg-gray-100 disabled:text-gray-400"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleSend}
              disabled={!canSend || inputValue.trim().length === 0}
            >
              {t.datingChat.send}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
