import type { CollectionConfig } from 'payload'

export const LegalTexts: CollectionConfig = {
    slug: 'legal-texts',
    admin: {
        useAsTitle: 'title',
    },
    access: {
        create: () => true,
        read: () => true,
        update: () => true,
        delete: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            localized: true,
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            index: true,
        },
        {
            name: 'content',
            type: 'richText',
            required: true,
            localized: true,
        },
        {
            name: 'lastUpdated',
            type: 'date',
        },
    ],
}
