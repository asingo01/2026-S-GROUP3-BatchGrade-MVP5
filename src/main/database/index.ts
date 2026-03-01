import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import path from 'path'
import * as schema from './schema'
import { getDbPath } from './utils/getDbPath'
import { app } from 'electron'

let db: ReturnType<typeof drizzle<typeof schema>>

export function initDb(): ReturnType<typeof drizzle<typeof schema>> {
  const sqlite = new Database(getDbPath())

  sqlite.pragma('journal_mode = WAL')
  sqlite.pragma('synchronous = NORMAL')
  sqlite.pragma('foreign_keys = ON')

  db = drizzle(sqlite, { schema })

  // In dev, electron-vite compiles to out/main/ but does NOT copy the migrations
  // folder there. We point directly at the source migrations instead.
  // In production, migrations are copied to resources/ via extraResources in package.json.
  const migrationsFolder = app.isPackaged
    ? path.join(process.resourcesPath, 'migrations')
    : path.resolve('src/main/database/migrations')

  migrate(db, { migrationsFolder })

  return db
}

export function getDb(): ReturnType<typeof drizzle<typeof schema>> {
  if (!db) {
    throw new Error('Database not initialized. Call initDb() first.')
  }

  return db
}
