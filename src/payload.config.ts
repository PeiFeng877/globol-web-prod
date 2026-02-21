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
      fields: [],
    },
    {
      slug: 'media',
      upload: true,
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
  localization: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    fallback: true,
  },
  plugins: [
    vercelBlobStorage({
      collections: {
        media: true,
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
