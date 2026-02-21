import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
    slug: 'articles',
    labels: {
        singular: { en: 'Article', zh: '文章' },
        plural: { en: 'Articles', zh: '文章' },
    },
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
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            index: true,
        },
        {
            name: 'description',
            type: 'textarea',
        },
        {
            name: 'content',
            type: 'richText',
            required: true,
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
        {
            name: 'language',
            type: 'select',
            required: true,
            defaultValue: 'en',
            options: [
                { label: 'English', value: 'en' },
                { label: 'Chinese (Simplified)', value: 'zh' },
                { label: 'German', value: 'de' },
                { label: 'Spanish', value: 'es' },
                { label: 'French', value: 'fr' },
                { label: 'Hindi', value: 'hi' },
                { label: 'Indonesian', value: 'id' },
                { label: 'Italian', value: 'it' },
                { label: 'Japanese', value: 'ja' },
                { label: 'Korean', value: 'ko' },
                { label: 'Dutch', value: 'nl' },
                { label: 'Portuguese', value: 'pt' },
                { label: 'Russian', value: 'ru' },
                { label: 'Thai', value: 'th' },
                { label: 'Vietnamese', value: 'vi' },
            ],
            admin: {
                position: 'sidebar',
                description: 'The language of this article entity.',
            },
        },
        {
            name: 'translationGroupId',
            type: 'text',
            admin: {
                position: 'sidebar',
                description: 'A shared ID or tag to group translations of the same article (e.g., "cute-date-ideas").',
            },
        },
    ],
}
