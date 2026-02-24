import { locales } from '@/i18n/settings'

export type TranslationContext = 'image-alt' | 'default'

/**
 * Uses Qwen-MT to translate a provided Simplified Chinese string into all 
 * other supported locales in the project.
 * 
 * @param zhText The original text in Simplified Chinese
 * @param context The scenario to apply specific prompts
 * @returns A JSON object mapping language codes to their translated strings.
 */
export async function translateText(zhText: string, context: TranslationContext = 'default'): Promise<Record<string, string>> {
    const dashscopeKey = process.env.DASHSCOPE_API_KEY
    if (!dashscopeKey) {
        console.warn("DASHSCOPE_API_KEY is missing. Returning empty translation map.")
        return {}
    }

    // Extract target locales, excluding the source language (Simplified Chinese 'zh')
    const targetLocales = locales.filter(loc => loc !== 'zh')

    let instruction = `Please translate the following Chinese text into the following languages. Use the ISO 639-1 language codes as keys: ${targetLocales.join(', ')}. Return ONLY a raw JSON object where keys are the language codes and values are the translated texts. Do NOT wrap it in a markdown block or include any conversational filler.`

    if (context === 'image-alt') {
        instruction = `Act as a multilingual SEO expert. Translate the following Chinese image description into the following languages. The translations must be concise, highly descriptive, and optimized for image ALT attributes. Use the ISO 639-1 language codes as keys: ${targetLocales.join(', ')}. Return ONLY a raw JSON object where keys are the language codes and values are the translated texts. Do NOT wrap it in a markdown block.`
    }

    const promptText = `${instruction}\n\nText: "${zhText}"`

    try {
        const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${dashscopeKey}`,
                'Content-Type': 'application/json',
                'X-DashScope-Async': 'disable',
            },
            body: JSON.stringify({
                model: 'qwen-mt-flash',
                input: {
                    messages: [
                        {
                            role: "user",
                            content: promptText
                        }
                    ]
                },
                parameters: {
                    result_format: 'message'
                }
            })
        })

        if (!response.ok) {
            console.error("DashScope MT API error:", await response.text())
            return {}
        }

        const result = await response.json()
        const aiText = result.output?.choices?.[0]?.message?.content

        if (!aiText) {
            return {}
        }

        // Try extracting JSON if it replied with markdown somehow
        const jsonMatch = aiText.match(/\{[\s\S]*\}/)
        const cleanlyParsed = JSON.parse(jsonMatch ? jsonMatch[0] : aiText)

        return cleanlyParsed

    } catch (err) {
        console.error("Translation parsing or fetch failed:", err)
        return {}
    }
}
