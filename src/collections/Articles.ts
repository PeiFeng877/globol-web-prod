import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
    slug: 'articles',
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
            name: 'description',
            type: 'textarea',
            localized: true,
        },
        {
            name: 'content',
            type: 'richText',
            required: true,
            localized: true,
        },
        {
            name: 'author',
            type: 'relationship',
            relationTo: 'users',
        },
        {
            name: 'heroImage',
            type: 'upload',
            relationTo: 'media',
        },
        {
            name: 'publishedAt',
            type: 'date',
        },
    ],
}
