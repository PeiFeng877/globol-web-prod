import { getPayload } from 'payload'
import configPromise from '@payload-config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLexicalText = (text: string): any => ({
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
                        text: text,
                        type: 'text',
                        version: 1,
                    },
                ],
            },
        ],
    },
})

async function seedLegal() {
    const payload = await getPayload({ config: configPromise })
    console.log('Seeding Legal data...')

    const englishPrivacy = await payload.create({
        collection: 'legal-texts',
        data: {
            title: 'Privacy Policy',
            slug: 'privacy',
            content: getLexicalText('This is a mock privacy policy for build purposes.'),
            language: 'en',
            translationGroupId: 'privacy-policy',
            lastUpdated: new Date().toISOString()
        }
    })
    console.log(`Created English Privacy Policy: ${englishPrivacy.id}`)

    const englishTerms = await payload.create({
        collection: 'legal-texts',
        data: {
            title: 'Terms of Service',
            slug: 'terms',
            content: getLexicalText('This is a mock terms of service for build purposes.'),
            language: 'en',
            translationGroupId: 'terms-of-service',
            lastUpdated: new Date().toISOString()
        }
    })
    console.log(`Created English Terms of Service: ${englishTerms.id}`)

    // Create zh versions
    const zhPrivacy = await payload.create({
        collection: 'legal-texts',
        data: {
            title: '隐私政策',
            slug: 'privacy',
            content: getLexicalText('这是一个用于构建用途的模拟隐私政策。'),
            language: 'zh',
            translationGroupId: 'privacy-policy',
            lastUpdated: new Date().toISOString()
        }
    })
    console.log(`Created Chinese Privacy Policy: ${zhPrivacy.id}`)

    const zhTerms = await payload.create({
        collection: 'legal-texts',
        data: {
            title: '服务条款',
            slug: 'terms',
            content: getLexicalText('这是一个用于构建用途的模拟服务条款。'),
            language: 'zh',
            translationGroupId: 'terms-of-service',
            lastUpdated: new Date().toISOString()
        }
    })
    console.log(`Created Chinese Terms of Service: ${zhTerms.id}`)

    console.log('Legal seeding complete! ✨')
    process.exit(0)
}

seedLegal().catch((err) => {
    console.error(err)
    process.exit(1)
})
