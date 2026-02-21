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
            localized: true,
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
            localized: true,
        },
        {
            name: 'tips',
            type: 'text',
            localized: true,
        },
        {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
        },
    ],
}
