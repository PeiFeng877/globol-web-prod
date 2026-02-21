import { CollectionConfig } from 'payload'

export const PseoTemplates: CollectionConfig = {
    slug: 'pseo-templates',
    labels: {
        singular: { en: 'Pseo Template', zh: '模板' },
        plural: { en: 'Pseo Templates', zh: '模板集' },
    },
    admin: {
        useAsTitle: 'vibe',
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'vibe',
            type: 'text',
            required: true,
            unique: true, // e.g., 'romantic', 'fun', 'cozy', 'adventurous'
            index: true,
        },
        {
            name: 'titleTemplate',
            type: 'text',
            required: true,
            localized: true,
            admin: {
                description: 'e.g., "Best {{vibe_name}} Date Ideas in {{city_name}}"',
            }
        },
        {
            name: 'descriptionTemplate',
            type: 'textarea',
            required: true,
            localized: true,
            admin: {
                description: 'SEO description template. You can use {{city_name}} and {{vibe_name}}',
            }
        },
        {
            name: 'heroContent',
            type: 'richText',
            localized: true,
            admin: {
                description: 'Rich text content shown above the date locations. Variables like {{city_name}} will be replaced.',
            }
        },
    ],
}
