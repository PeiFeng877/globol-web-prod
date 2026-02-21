import type { CollectionConfig } from 'payload'

export const LegalTexts: CollectionConfig = {
    slug: 'legal-texts',
    labels: {
        singular: { en: 'Legal Text', zh: '法律声明' },
        plural: { en: 'Legal Texts', zh: '法律声明' },
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
            name: 'content',
            type: 'richText',
            required: true,
        },
        {
            name: 'lastUpdated',
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
                description: 'The language of this text entity.',
            },
        },
        {
            name: 'translationGroupId',
            type: 'text',
            admin: {
                position: 'sidebar',
                description: 'A shared ID or tag to group translations of the same legal text.',
            },
        },
    ],
}
