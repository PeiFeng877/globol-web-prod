import { Client } from 'pg';
import { completeViaGateway } from '../src/lib/ai/gateway';
import * as dotenv from 'dotenv';

// Load production environment variables
dotenv.config({ path: '.env.production' });

/**
 * Extract plain text from Lexical rich text JSON
 */
function extractTextFromLexical(node: any): string {
    if (!node) return '';
    let text = '';
    if (typeof node.text === 'string') {
        text += node.text;
    }
    if (Array.isArray(node.children)) {
        for (const child of node.children) {
            text += extractTextFromLexical(child);
        }
    }
    // Add spaces between block elements if necessary, but for LLM, simple concat is fine enough
    if (node.type === 'paragraph' || node.type === 'heading') {
        text += '\n';
    }
    return text;
}

async function main() {
    const args = process.argv.slice(2);
    const limit = args.includes('--all') ? 1000 : 1;
    console.log(`Starting to generate descriptions... limit=${limit}`);

    const connectionString = process.env.DATABASE_URI;
    if (!connectionString) {
        throw new Error("Missing DATABASE_URI in environment variables.");
    }

    const aiGatewayKey = process.env.AI_GATEWAY_API_KEY;
    if (!aiGatewayKey) {
        throw new Error("Missing AI_GATEWAY_API_KEY. Ensure it is set in .env.production");
    }

    const client = new Client({ connectionString });
    await client.connect();

    try {
        const res = await client.query(`
            SELECT id, title, slug, language, content
            FROM articles
            WHERE description IS NULL OR description = ''
            LIMIT $1
        `, [limit]);

        const articles = res.rows;
        console.log(`Found ${articles.length} articles needing descriptions.`);

        for (const article of articles) {
            console.log(`\nProcessing article id=${article.id}, language=${article.language}, title="${article.title}"...`);

            const rootNode = article.content?.root;
            const fullText = extractTextFromLexical(rootNode);
            const prefixText = fullText.slice(0, 1500).trim();

            if (!prefixText) {
                console.log(`  -> Skipping: no content extracted.`);
                continue;
            }

            const systemPrompt = "You are an expert multilingual SEO copywriter.";
            const userPrompt = `请为以下文章生成一个 SEO meta description。
要求：
1. 长度在 150-160 个字符左右；
2. 精准体现文章核心关键词并满足用户搜索意图；
3. **必须使用语言代码为 ${article.language} 的目标语言撰写**（例如 'en' 为英语, 'zh' 为中文, 'de' 为德语等）；
4. 只返回生成的描述文本，不要有任何多余的解释、引号、或 Markdown 格式。

文章标题：${article.title}
文章内容参考：
${prefixText}`;

            try {
                const { text: description } = await completeViaGateway({
                    system: systemPrompt,
                    messages: [{ role: "user", content: userPrompt }]
                });

                const cleanDescription = description.trim().replace(/^["']|["']$/g, '');
                console.log(`  -> Generated Description: ${cleanDescription}`);

                await client.query(`
                    UPDATE articles
                    SET description = $1, updated_at = NOW()
                    WHERE id = $2
                `, [cleanDescription, article.id]);

                console.log(`  -> Saved to DB.`);
            } catch (aiErr: any) {
                console.error(`  -> Failed to generate description:`, aiErr.message);
            }
        }
    } finally {
        await client.end();
    }
}

main().catch(console.error);
