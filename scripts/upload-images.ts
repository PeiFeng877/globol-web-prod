import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const CONTENT_DIR = path.join(__dirname, '../src/content/articles/en')
const API_URL = 'http://localhost:3000/api'

async function uploadImages() {
    console.log('Starting Image Upload Migration...')

    if (!fs.existsSync(CONTENT_DIR)) {
        console.error(`Content directory not found: ${CONTENT_DIR}`)
        return
    }

    const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.md'))

    for (const file of files) {
        const slug = file.replace('.md', '')
        const filePath = path.join(CONTENT_DIR, file)
        const fileContent = fs.readFileSync(filePath, 'utf-8')
        const { data } = matter(fileContent)

        console.log(`\nProcessing article: ${slug}`)

        try {
            // 1. Find the article ID
            const res = await fetch(`${API_URL}/articles?where[slug][equals]=${slug}`)
            const json = await res.json()

            if (!json.docs || json.docs.length === 0) {
                console.warn(`Article not found in CMS for slug: ${slug}, skipping.`)
                continue
            }

            const articleId = json.docs[0].id

            // 2. Read Local Image
            const imagePath = data.heroImage
            const category = data.category || 'Relationships'

            if (!imagePath) {
                console.log(`No heroImage in frontmatter for ${slug}, only updating category...`)
                await updateArticleCategory(articleId, category)
                continue
            }

            const absImagePath = path.join(__dirname, '../public', imagePath)

            if (!fs.existsSync(absImagePath)) {
                console.warn(`Local image not found: ${absImagePath}`)
                await updateArticleCategory(articleId, category)
                continue
            }

            // 3. Upload Image to Media Collection
            const imageBuffer = fs.readFileSync(absImagePath)
            const fileName = path.basename(absImagePath)

            // Using Blob for fetch formData
            const fileBlob = new Blob([imageBuffer], { type: 'image/webp' })
            const formData = new FormData()
            formData.append('file', fileBlob, fileName)
            formData.append('alt', data.title || slug)

            console.log(`Uploading ${fileName}...`)
            const uploadRes = await fetch(`${API_URL}/media`, {
                method: 'POST',
                body: formData,
            })

            if (!uploadRes.ok) {
                const errorText = await uploadRes.text()
                console.error(`  x Failed to upload ${fileName}:`, errorText)
                continue
            }

            const mediaDoc = await uploadRes.json()
            const mediaId = mediaDoc.doc.id
            console.log(`  ✓ Uploaded media. ID: ${mediaId}`)

            // 4. Update Article with Hero Image and Category
            console.log(`Updating article ${slug} with media ID and category...`)
            const updateRes = await fetch(`${API_URL}/articles/${articleId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    heroImage: mediaId,
                    category: category,
                }),
            })

            if (!updateRes.ok) {
                console.error(`  x Failed to update article ${slug}:`, await updateRes.text())
            } else {
                console.log(`  ✓ Updated article ${slug} successfully.`)
            }

        } catch (error) {
            console.error(`Error processing ${slug}:`, error)
        }
    }

    console.log('\nImage Upload Migration complete.')
}

async function updateArticleCategory(articleId: string, category: string) {
    const updateRes = await fetch(`${API_URL}/articles/${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category }),
    })
    if (!updateRes.ok) {
        console.error(`  x Failed to update article category:`, await updateRes.text())
    } else {
        console.log(`  ✓ Updated article category successfully.`)
    }
}

uploadImages().catch(console.error)
