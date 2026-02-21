import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CONTENT_DIR = path.join(__dirname, '../src/content/articles')
const API_URL = 'http://localhost:3000/api/articles'

// Helper to convert Markdown body to Payload's Lexical format (basic mapping)
// For a production migration, you'd want a robust md-to-lexical converter.
// Here we just store the raw markdown as text for simplicity of the migration step.
function convertToLexical(markdown: string) {
    return {
        root: {
            type: 'root',
            format: '',
            indent: 0,
            version: 1,
            children: [
                {
                    type: 'paragraph',
                    format: '',
                    indent: 0,
                    version: 1,
                    children: [
                        {
                            detail: 0,
                            format: 0,
                            mode: 'normal',
                            style: '',
                            text: markdown,
                            type: 'text',
                            version: 1,
                        },
                    ],
                },
            ],
        },
    }
}

async function migrate() {
    console.log('Starting migration...')

    if (!fs.existsSync(CONTENT_DIR)) {
        console.error(`Content directory not found: ${CONTENT_DIR}`)
        return
    }

    const locales = fs.readdirSync(CONTENT_DIR)

    // Group files by slug
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const articlesBySlug: Record<string, Record<string, any>> = {}

    for (const locale of locales) {
        const localeDir = path.join(CONTENT_DIR, locale)
        if (!fs.statSync(localeDir).isDirectory()) continue

        const files = fs.readdirSync(localeDir).filter((f) => f.endsWith('.md'))

        for (const file of files) {
            const slug = file.replace('.md', '')
            const filePath = path.join(localeDir, file)
            const fileContent = fs.readFileSync(filePath, 'utf-8')
            const { data, content } = matter(fileContent)

            if (!articlesBySlug[slug]) articlesBySlug[slug] = {}
            articlesBySlug[slug][locale] = { data, content }
        }
    }

    // Process each unique article slug
    for (const [slug, localeData] of Object.entries(articlesBySlug)) {
        console.log(`\nProcessing article: ${slug}`)

        // 1. Create or ensure the base article exists using the 'en' locale (default)
        const baseLocale = 'en'
        const fallbackLocale = Object.keys(localeData)[0]
        const primaryLocale = localeData[baseLocale] ? baseLocale : fallbackLocale
        const primaryItem = localeData[primaryLocale]

        const payloadData = {
            title: primaryItem.data.title || slug,
            slug: slug,
            description: primaryItem.data.description || '',
            content: convertToLexical(primaryItem.content),
            publishedAt: primaryItem.data.date ? new Date(primaryItem.data.date).toISOString() : new Date().toISOString(),
        }

        let articleId = null

        try {
            // Check if it exists first
            const checkRes = await fetch(`${API_URL}?where[slug][equals]=${slug}`)
            const checkData = await checkRes.json()

            if (checkData.docs && checkData.docs.length > 0) {
                articleId = checkData.docs[0].id
                console.log(`Found existing article ID: ${articleId}`)
            } else {
                // Create new
                const createRes = await fetch(`${API_URL}?locale=${primaryLocale}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payloadData),
                })
                if (!createRes.ok) throw new Error(JSON.stringify(await createRes.json()))
                const createdData = await createRes.json()
                articleId = createdData.doc.id
                console.log(`Created new article ID: ${articleId}`)
            }

            // 2. Update remaining locales
            for (const [locale, item] of Object.entries(localeData)) {
                if (locale === primaryLocale && checkData?.docs?.length === 0) continue // Skip if we just created it

                const localizedData = {
                    title: item.data.title || slug,
                    description: item.data.description || '',
                    content: convertToLexical(item.content),
                }

                const updateRes = await fetch(`${API_URL}/${articleId}?locale=${locale}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(localizedData),
                })

                if (!updateRes.ok) {
                    console.error(`  x Failed to update locale [${locale}] for ${slug}:`, await updateRes.json())
                } else {
                    console.log(`  ✓ Updated locale [${locale}] for ${slug}`)
                }
            }
        } catch (error) {
            console.error(`Error processing ${slug}:`, error)
        }
    }

    console.log('\nMigration complete.')
}

async function migrateLegal() {
    console.log('\n--- Starting Legal Texts migration ---')
    const LEGAL_DIR = path.join(__dirname, '../src/content/legal')
    const LEGAL_API = 'http://localhost:3000/api/legal-texts'

    if (!fs.existsSync(LEGAL_DIR)) {
        console.error(`Legal directory not found: ${LEGAL_DIR}`)
        return
    }

    const locales = fs.readdirSync(LEGAL_DIR)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const docsBySlug: Record<string, Record<string, any>> = {}

    for (const locale of locales) {
        const localeDir = path.join(LEGAL_DIR, locale)
        if (!fs.statSync(localeDir).isDirectory()) continue

        const files = fs.readdirSync(localeDir).filter((f) => f.endsWith('.md'))

        for (const file of files) {
            const slug = file.replace('.md', '')
            const filePath = path.join(localeDir, file)
            const fileContent = fs.readFileSync(filePath, 'utf-8')
            const { data, content } = matter(fileContent)

            if (!docsBySlug[slug]) docsBySlug[slug] = {}
            docsBySlug[slug][locale] = { data, content }
        }
    }

    for (const [slug, localeData] of Object.entries(docsBySlug)) {
        console.log(`\nProcessing legal text: ${slug}`)

        const baseLocale = 'en'
        const fallbackLocale = Object.keys(localeData)[0]
        const primaryLocale = localeData[baseLocale] ? baseLocale : fallbackLocale
        const primaryItem = localeData[primaryLocale]

        // Map titles manually if frontmatter title is missing (mostly just privacy/terms)
        let title = primaryItem.data.title || slug
        if (!primaryItem.data.title) {
            title = slug === 'privacy' ? 'Privacy Policy' : slug === 'terms' ? 'Terms of Service' : slug
        }

        const payloadData = {
            title,
            slug,
            content: convertToLexical(primaryItem.content),
        }

        let docId = null

        try {
            const checkRes = await fetch(`${LEGAL_API}?where[slug][equals]=${slug}`)
            const checkData = await checkRes.json()

            if (checkData.docs && checkData.docs.length > 0) {
                docId = checkData.docs[0].id
                console.log(`Found existing legal doc ID: ${docId}`)
            } else {
                const createRes = await fetch(`${LEGAL_API}?locale=${primaryLocale}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payloadData),
                })
                if (!createRes.ok) throw new Error(JSON.stringify(await createRes.json()))
                const createdData = await createRes.json()
                docId = createdData.doc.id
                console.log(`Created new legal doc ID: ${docId}`)
            }

            for (const [locale, item] of Object.entries(localeData)) {
                if (locale === primaryLocale && checkData?.docs?.length === 0) continue

                let locTitle = item.data.title || slug
                if (!item.data.title) {
                    if (locale === 'zh') {
                        locTitle = slug === 'privacy' ? '隐私政策' : slug === 'terms' ? '服务条款' : slug
                    } else {
                        locTitle = slug === 'privacy' ? 'Privacy Policy' : slug === 'terms' ? 'Terms of Service' : slug
                    }
                }

                const localizedData = {
                    title: locTitle,
                    content: convertToLexical(item.content),
                }

                const updateRes = await fetch(`${LEGAL_API}/${docId}?locale=${locale}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(localizedData),
                })

                if (!updateRes.ok) {
                    console.error(`  x Failed to update locale [${locale}] for ${slug}:`, await updateRes.json())
                } else {
                    console.log(`  ✓ Updated locale [${locale}] for ${slug}`)
                }
            }
        } catch (error) {
            console.error(`Error processing ${slug}:`, error)
        }
    }
    console.log('\nLegal Texts migration complete.')
}

async function runAll() {
    await migrate()
    await migrateLegal()
}

runAll().catch(console.error)
