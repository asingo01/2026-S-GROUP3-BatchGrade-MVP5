import { defineConfig } from 'drizzle-kit'
import { getDbPath } from './src/main/database/utils/getDbPath'

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/main/database/schema',
  out: './src/main/database/migrations',
  dbCredentials: {
    url: getDbPath()
  }
})
