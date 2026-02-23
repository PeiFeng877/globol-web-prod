import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { Articles } from './collections/Articles'
import { LegalTexts } from './collections/Legal'
import { Destinations } from './collections/Destinations'
import { PseoTemplates } from './collections/PseoTemplates'
import { DateLocations } from './collections/DateLocations'
import { en } from '@payloadcms/translations/languages/en'
import { zh } from '@payloadcms/translations/languages/zh'
import { locales, defaultLocale } from './i18n/settings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: 'users',
  },
  collections: [
    {
      slug: 'users',
      auth: true,
      labels: {
        singular: { en: 'User', zh: '用户' },
        plural: { en: 'Users', zh: '用户' },
      },
      fields: [],
    },
    {
      slug: 'media',
      upload: true,
      labels: {
        singular: { en: 'Media', zh: '媒体库' },
        plural: { en: 'Media', zh: '媒体库' },
      },
      access: {
        create: () => true,
        read: () => true,
        update: () => true,
        delete: () => true,
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
    Articles,
    LegalTexts,
    Destinations,
    PseoTemplates,
    DateLocations,
  ],
  i18n: {
    supportedLanguages: { en, zh },
  },
  plugins: [
    vercelBlobStorage({
      collections: {
        media: {
          prefix: process.env.VERCEL_ENV === 'production' ? 'prod' : 'dev',
        },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  secret: process.env.PAYLOAD_SECRET || 'secret-key',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
