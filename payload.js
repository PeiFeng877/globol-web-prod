import { buildConfig } from 'payload'

export default buildConfig({
  admin: { user: 'users' },
  collections: [{ slug: 'users', fields: [] }],
  db: { default: true },
})
