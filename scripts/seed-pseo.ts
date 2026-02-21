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

async function seed() {
    const payload = await getPayload({ config: configPromise })

    console.log('Seeding PSEO data...')

    // 1. Create Destination: Tokyo
    console.log('Creating Destination: Tokyo')
    const tokyoRes = await payload.find({
        collection: 'destinations',
        where: { slug: { equals: 'tokyo' } },
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let tokyoId: any
    if (tokyoRes.docs.length > 0) {
        tokyoId = tokyoRes.docs[0].id
        console.log('Tokyo already exists.')
    } else {
        const tokyo = await payload.create({
            collection: 'destinations',
            data: {
                name: 'Tokyo',
                slug: 'tokyo',
                country: 'Japan',
                description: 'The bustling capital of Japan, seamlessly blending the ultramodern and the traditional.',
            },
        })
        tokyoId = tokyo.id
        console.log('Created Destination: Tokyo')
    }

    // 2. Create PseoTemplates
    const vibes = ['romantic', 'fun', 'cozy', 'adventurous']
    for (const vibe of vibes) {
        const templateRes = await payload.find({
            collection: 'pseo-templates',
            where: { vibe: { equals: vibe } },
        })

        if (templateRes.docs.length === 0) {
            await payload.create({
                collection: 'pseo-templates',
                data: {
                    vibe: vibe,
                    titleTemplate: `The Best {{vibe_name}} Date Ideas in {{city_name}}`,
                    descriptionTemplate: `Looking for a {{vibe_name}} date? Discover the top spots for couples in {{city_name}}.`,
                    heroContent: getLexicalText(`Here are some handpicked {{vibe_name}} experiences to make your date in {{city_name}} unforgettable.`),
                },
            })
            console.log(`Created PseoTemplate for vibe: ${vibe}`)
        } else {
            console.log(`PseoTemplate for ${vibe} already exists.`)
        }
    }

    // 3. Create DateLocations for Tokyo
    const mockLocations = [
        {
            title: 'Tokyo Skytree Sunset',
            vibe: 'romantic',
            description: 'Watch the breathtaking sunset over the sprawling city from the tallest structure in Japan.',
            tips: 'Book tickets online in advance to skip the line perfectly at sunset hour.',
        },
        {
            title: 'Mario Kart Street Racing',
            vibe: 'fun',
            description: 'Dress up in fun costumes and drive go-karts around the busy streets of Akihabara.',
            tips: 'You will need an International Driving Permit. Avoid rush hour!',
        },
        {
            title: 'Jimbocho Book Town Cafe',
            vibe: 'cozy',
            description: 'Wander through the endless used book stores and settle into a quiet traditional kissaten for hand-drip coffee.',
            tips: 'Many cafes are small and quiet; perfect for a slow, intimate conversation.',
        },
        {
            title: 'Mount Takao Hiking',
            vibe: 'adventurous',
            description: 'Take a short train ride from Shinjuku and hike up Mount Takao. Reward yourselves with hot soba noodles at the top.',
            tips: 'Take trail 6 for a more adventurous path alongside a scenic stream.',
        }
    ]

    for (const loc of mockLocations) {
        const locRes = await payload.find({
            collection: 'date-locations',
            where: {
                and: [
                    { title: { equals: loc.title } },
                    { destination: { equals: tokyoId } },
                ],
            },
        })

        if (locRes.docs.length === 0) {
            await payload.create({
                collection: 'date-locations',
                data: {
                    title: loc.title,
                    destination: tokyoId,
                    vibe: loc.vibe,
                    description: loc.description,
                    tips: loc.tips,
                },
            })
            console.log(`Created DateLocation: ${loc.title}`)
        } else {
            console.log(`DateLocation ${loc.title} already exists.`)
        }
    }

    console.log('Seeding complete! ✨')
    process.exit(0)
}

seed().catch((err) => {
    console.error(err)
    process.exit(1)
})
