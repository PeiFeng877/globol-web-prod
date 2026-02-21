import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// Map locales to exactly what Payload schema expects
const LOCALE_MAP: Record<string, string> = {
    en: 'en',
    zh: 'zh',
    de: 'de',
    es: 'es',
    fr: 'fr',
    hi: 'hi',
    id: 'id',
    it: 'it',
    ja: 'ja',
    ko: 'ko',
    nl: 'nl',
    pt: 'pt',
    ru: 'ru',
    th: 'th',
    vi: 'vi',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLexicalText = (htmlContent: string): any => {
    // A simplified conversion: for seeding, we wrap the raw markdown/html inside a lexical paragraph.
    // Realistically you'd want a proper Markdown -> Lexical AST converter, but this works for MVP seeding.
    return {
        root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            direction: null,
            children: [
                {
                    type: 'paragraph',
                    format: '',
                    indent: 0,
                    version: 1,
                    direction: null,
                    children: [
                        {
                            mode: 'normal',
                            text: htmlContent, // Storing markdown raw text for now
                            type: 'text',
                            version: 1,
                        },
                    ],
                },
            ],
        },
    }
}

async function seedArticles() {
    const payload = await getPayload({ config: configPromise })
    console.log('Seeding all multidimensional articles into Payload DB...')

    const articlesDir = path.join(process.cwd(), 'src/content/articles')
    const locales = fs.readdirSync(articlesDir).filter(dir => !dir.startsWith('.'))

    let count = 0

    for (const locale of locales) {
        const localeDir = path.join(articlesDir, locale)
        if (!fs.statSync(localeDir).isDirectory()) continue

        const files = fs.readdirSync(localeDir).filter(f => f.endsWith('.md'))

        for (const file of files) {
            const filePath = path.join(localeDir, file)
            const fileContent = fs.readFileSync(filePath, 'utf-8')
            const { data, content } = matter(fileContent)

            const slug = file.replace('.md', '')
            const language = (LOCALE_MAP[locale] || 'en') as 'en' | 'zh' | 'de' | 'es' | 'fr' | 'hi' | 'id' | 'it' | 'ja' | 'ko' | 'nl' | 'pt' | 'ru' | 'th' | 'vi'
            // The slug serves perfectly as the translation group ID (e.g. "cute-date-ideas")
            const translationGroupId = slug

            // Check if it already exists to avoid duplicates
            const existing = await payload.find({
                collection: 'articles',
                where: {
                    and: [
                        { slug: { equals: slug } },
                        { language: { equals: language } }
                    ]
                }
            })

            if (existing.docs.length > 0) {
                console.log(`[SKIP] Already exists: ${slug} (${language})`)
                continue
            }

            await payload.create({
                collection: 'articles',
                data: {
                    title: data.title || slug,
                    slug: slug,
                    description: data.description || '',
                    content: getLexicalText(content),
                    language: language,
                    translationGroupId: translationGroupId,
                    publishedAt: new Date().toISOString()
                }
            })
            console.log(`[CREATED] ${slug} (${language})`)
            count++
        }
    }

    console.log(`\n✅ Seeding complete! Inserted ${count} new article versions.`)
    process.exit(0)
}

seedArticles().catch((err) => {
    console.error(err)
    process.exit(1)
})
