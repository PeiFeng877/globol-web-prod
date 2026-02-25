/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 2026-02-08 新增 AI 聊天 API 路由；变更时更新此头部，然后检查 GEMINI.md
 *
 * INPUT: profileId + locale + context messages + userMessage
 * OUTPUT: assistant reply payload
 * POS: App Router API
 * CONTRACT: Validates request, enforces 3-message cap, then forwards to AI Gateway.
 * 职责: 无登录聊天的后端网关与基础风控入口。
 */

import { NextRequest, NextResponse } from "next/server";
import { getProfileDetailView, profiles, toProfileView } from "@/data/profiles";
import { buildChatPrompt } from "@/lib/ai/chat-prompt";
import { completeViaGateway } from "@/lib/ai/gateway";

const MAX_USER_MESSAGES = 3;
const MAX_CONTEXT_MESSAGES = 6;
const MAX_TEXT_LENGTH = 300;

type Locale = "en" | "zh";

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
  ts?: number;
}

interface ChatRequestBody {
  profileId?: string;
  locale?: string;
  messages?: IncomingMessage[];
  userMessage?: string;
}

const cleanText = (text: string) =>
  text.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim();

const isLocale = (value: string): value is Locale => value === "en" || value === "zh";

const normalizeMessages = (messages: IncomingMessage[]) =>
  messages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .map((message) => ({
      role: message.role,
      content: cleanText(message.content).slice(0, MAX_TEXT_LENGTH),
    }))
    .filter((message) => message.content.length > 0)
    .slice(-MAX_CONTEXT_MESSAGES);

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatRequestBody;
    const profileId = typeof body.profileId === "string" ? body.profileId : "";
    const locale: Locale = isLocale(String(body.locale)) ? (body.locale as Locale) : "en";
    const userMessage = typeof body.userMessage === "string" ? cleanText(body.userMessage) : "";
    const incomingMessages = Array.isArray(body.messages) ? body.messages : [];

    if (!profileId || userMessage.length === 0) {
      return NextResponse.json({ error: "invalid-params" }, { status: 400 });
    }

    const profile = profiles.find((item) => item.id === profileId);
    if (!profile) {
      return NextResponse.json({ error: "profile-not-found" }, { status: 404 });
    }

    const recentMessages = normalizeMessages(incomingMessages);
    const userCount = recentMessages.filter((item) => item.role === "user").length + 1;
    if (userCount > MAX_USER_MESSAGES) {
      return NextResponse.json({ error: "message-limit-reached" }, { status: 429 });
    }

    const profileView = toProfileView(profile, locale);
    const detailView = getProfileDetailView(profile, locale);
    const prompt = buildChatPrompt({
      profile: {
        id: profile.id,
        name: profile.name,
        age: profile.age,
        city: profileView.city,
        country: profileView.countryDisplay,
        headline: detailView.headline,
        about: detailView.about,
        interests: detailView.interests,
        languages: detailView.languages,
        occupation: detailView.occupation,
        communicationStyle: detailView.communicationStyle,
      },
      locale,
      recentMessages,
      userMessage: userMessage.slice(0, MAX_TEXT_LENGTH),
    });

    const { text: reply, usage } = await completeViaGateway(prompt);

    // [DEBUG LOG]
    console.log(`\n--- [AI CHAT LOG] ---`);
    console.log(`👤 User (${profile.name}): "${userMessage}"`);
    console.log(`🎭 Style: ${detailView.communicationStyle}`);
    console.log(`🤖 AI Reply: "${reply}"`);
    console.log(`💰 Usage: ${usage?.total_tokens ?? "N/A"} tokens`);
    console.log(`---------------------\n`);

    return NextResponse.json({
      reply,
      nickname: profile.name,
      ts: Date.now(),
    });
  } catch {
    return NextResponse.json({ error: "internal-error" }, { status: 500 });
  }
}
