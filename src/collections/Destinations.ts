import { CollectionConfig } from 'payload'

export const Destinations: CollectionConfig = {
    slug: 'destinations',
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
