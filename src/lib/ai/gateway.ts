/**
 * [PROTOCOL] L3 - GEB Fractal Documentation
 * [PROTOCOL]: 2026-02-08 新增 AI Gateway 调用封装；变更时更新此头部，然后检查 AGENTS.md
 *
 * INPUT: system prompt + chat messages
 * OUTPUT: assistant reply text
 * POS: lib/ai gateway layer
 * CONTRACT: Calls Vercel AI Gateway with timeout and normalized errors.
 * 职责: 统一网关请求入口，隔离模型调用细节。
 */

interface GatewayMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatCompletionInput {
  system: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
}

const DEFAULT_BASE_URL = "https://ai-gateway.vercel.sh/v1";
const DEFAULT_MODEL = "openai/gpt-4o-mini";
const REQUEST_TIMEOUT_MS = 12_000;

const readContent = (payload: unknown): string => {
  if (!payload || typeof payload !== "object") {
    return "";
  }
  const content = (payload as { content?: unknown }).content;
  if (typeof content === "string") {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === "string") {
          return item;
        }
        if (item && typeof item === "object" && "text" in item) {
          const text = (item as { text?: unknown }).text;
          return typeof text === "string" ? text : "";
        }
        return "";
      })
      .join("")
      .trim();
  }
  return "";
};

export const completeViaGateway = async ({ system, messages }: ChatCompletionInput): Promise<{ text: string; usage?: { total_tokens: number } }> => {
  const apiKey = process.env.AI_GATEWAY_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("missing-ai-gateway-key");
  }

  const baseUrl = process.env.AI_GATEWAY_BASE_URL || DEFAULT_BASE_URL;
  const model = process.env.AI_GATEWAY_MODEL || DEFAULT_MODEL;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const payloadMessages: GatewayMessage[] = [
      { role: "system", content: system },
      ...messages,
    ];

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        stream: false,
        temperature: 0.7,
        max_tokens: 240,
        messages: payloadMessages,
      }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`gateway-http-${response.status}`);
    }

    const data = (await response.json()) as { 
      choices?: Array<{ message?: unknown }>;
      usage?: { total_tokens: number };
    };
    const first = data.choices?.[0]?.message;
    const text = readContent(first);
    if (!text) {
      throw new Error("gateway-empty-reply");
    }
    return { text, usage: data.usage };
  } finally {
    clearTimeout(timer);
  }
};
