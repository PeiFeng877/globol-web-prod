import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONTENT_DIR = path.join(__dirname, '../src/content/articles/en');
const PUBLIC_DIR = path.join(__dirname, '../public');
const API_URL = 'http://localhost:3001/api';

async function processImages() {
    console.log('Starting Image Restore...');

    const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));

    for (const file of files) {
        const filePath = path.join(CONTENT_DIR, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(content);

        const slug = file.replace('.md', '');
        const heroImage = data.heroImage;

        if (!heroImage) {
            console.log(`[SKIP] No heroImage found in ${slug}`);
            continue;
        }

        // Try to locate image locally
        const imagePath = path.join(PUBLIC_DIR, heroImage.replace(/^\//, ''));
        if (!fs.existsSync(imagePath)) {
            console.error(`[ERROR] Image not found on disk: ${imagePath}`);
            continue;
        }

        console.log(`Processing: ${slug} -> ${heroImage}`);

        try {
            // 1. Upload to Media collection
            const fileBuffer = fs.readFileSync(imagePath);
            const mimeType = imagePath.endsWith('.png') ? 'image/png' :
                imagePath.endsWith('.jpg') || imagePath.endsWith('.jpeg') ? 'image/jpeg' :
                    imagePath.endsWith('.webp') ? 'image/webp' :
                        imagePath.endsWith('.avif') ? 'image/avif' : 'application/octet-stream';

            const fileObj = new File([fileBuffer], path.basename(imagePath), { type: mimeType });
            const formData = new FormData();
            // Required structure for Payload File Upload via REST
            formData.append('file', fileObj);
            formData.append('alt', data.title || slug);

            console.log(`  Uploading media...`);
            const mediaRes = await fetch(`${API_URL}/media`, {
                method: 'POST',
                headers: {
                    // Payload relies on multipart/form-data boundary provided by fetch
                    'Authorization': `users API-Key-auth-if-needed` // Assuming public create access is authorized
                },
                body: formData,
            });

            if (!mediaRes.ok) {
                throw new Error(`Media Upload Failed: ${await mediaRes.text()}`);
            }

            const mediaData = await mediaRes.json();
            const mediaId = mediaData.doc.id;
            console.log(`  -> Uploaded as Media ID: ${mediaId} (${mediaData.doc.url})`);

            // 2. Query all Articles across locales that match this slug
            const articlesRes = await fetch(`${API_URL}/articles?where[slug][equals]=${slug}&limit=20`);
            const articlesData = await articlesRes.json();

            let patchedCount = 0;
            for (const article of articlesData.docs) {
                // 3. Patch the heroImage field with the ID
                const patchRes = await fetch(`${API_URL}/articles/${article.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ heroImage: mediaId }),
                });

                if (patchRes.ok) {
                    patchedCount++;
                } else {
                    console.error(`  [ERROR] Failed to patch article ID ${article.id}`);
                }
            }

            console.log(`  -> Patched ${patchedCount} article records for slug ${slug}\n`);

        } catch (error) {
            console.error(`[ERROR] Processing ${slug}:`, error);
        }
    }
}

processImages().catch(console.error);
