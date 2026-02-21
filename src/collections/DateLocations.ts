import { CollectionConfig } from 'payload'

export const DateLocations: CollectionConfig = {
    slug: 'date-locations',
    admin: {
        useAsTitle: 'title',
        defaultColumns: ['title', 'destination', 'vibe'],
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'destination',
            type: 'relationship',
            relationTo: 'destinations',
            required: true,
            index: true,
        },
        {
            name: 'vibe',
            type: 'text',
            required: true,
            index: true,
        },
        {
            name: 'description',
            type: 'textarea',
            required: true,
        },
        {
            name: 'tips',
            type: 'text',
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
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
                description: 'The language of this location entity.',
            },
        },
        {
            name: 'translationGroupId',
            type: 'text',
            admin: {
                position: 'sidebar',
                description: 'A shared ID or tag to group translations of the same location.',
            },
        },
    ],
}
