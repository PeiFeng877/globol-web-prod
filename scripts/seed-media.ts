import path from 'path'
import fs from 'fs'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

function getFilesRecursively(dir: string, fileList: string[] = []) {
    if (!fs.existsSync(dir)) return fileList
    const files = fs.readdirSync(dir)
    for (const file of files) {
        const filePath = path.join(dir, file)
        if (fs.statSync(filePath).isDirectory()) {
            getFilesRecursively(filePath, fileList)
        } else {
            // Filter out non-image files like .DS_Store
            if (/\.(png|jpe?g|gif|webp|avif|svg)$/i.test(file)) {
                fileList.push(filePath)
            }
        }
    }
    return fileList
}

async function seedMedia() {
    const payload = await getPayload({ config: configPromise })
    console.log('Seeding existing images into Payload Media...')

    const assetsDir = path.join(process.cwd(), 'public/assets')
    const avatarsDir = path.join(process.cwd(), 'public/avatars')

    const mediaFiles = [
        ...getFilesRecursively(assetsDir),
        ...getFilesRecursively(avatarsDir),
    ]

    let count = 0
    for (const filePath of mediaFiles) {
        const filename = path.basename(filePath)

        // Check if filename already exists
        const existing = await payload.find({
            collection: 'media',
            where: {
                filename: { equals: filename }
            },
        })

        if (existing.docs.length > 0) {
            console.log(`[SKIP] Media already exists: ${filename}`)
            continue
        }

        try {
            await payload.create({
                collection: 'media',
                data: {
                    alt: filename.replace(/\.[^/.]+$/, ''), // filename without extension
                },
                filePath: filePath,
            })
            console.log(`[CREATED] Media: ${filename}`)
            count++
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            console.error(`[ERROR] Failed to save media ${filename}:`, err.message)
        }
    }

    console.log(`\n✅ Media Seeding complete! Uploaded ${count} new files via Payload.`)
    process.exit(0)
}

seedMedia().catch((err) => {
    console.error(err)
    process.exit(1)
})
