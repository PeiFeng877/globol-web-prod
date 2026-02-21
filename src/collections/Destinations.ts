import { CollectionConfig } from 'payload'

export const Destinations: CollectionConfig = {
    slug: 'destinations',
    labels: {
        singular: { en: 'Destination', zh: '目的地' },
        plural: { en: 'Destinations', zh: '热门目的地' },
    },
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'slug', 'country'],
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'name',
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
            name: 'country',
            type: 'text',
            required: true,
            localized: true,
        },
        {
            name: 'description',
            type: 'textarea',
            localized: true,
        },
        {
            name: 'heroImage',
            type: 'upload',
            relationTo: 'media',
        },
    ],
}
