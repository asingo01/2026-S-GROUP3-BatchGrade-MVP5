import path from 'path'
import { createRequire } from 'node:module'

const nodeRequire = createRequire(import.meta.url)

/**
 * Resolves the absolute path to the application database file.
 *
 * - Production (packaged): `<userData>/batchgrade.db`
 * - Development: `./dev.db` relative to the project root
 *
 * Uses a dynamic `require` so this file can be safely imported outside of
 * the Electron runtime (e.g. drizzle.config.ts, tests).
 *
 * @returns Absolute path to the database file.
 */
export function getDbPath(): string {
  try {
    if (!process.versions.electron) {
      return path.resolve('./dev.db')
    }

    const { app } = nodeRequire('electron') as typeof import('electron')
    if (app.isPackaged) {
      return path.join(app.getPath('userData'), 'batchgrade.db')
    }
  } catch {
    // Running outside Electron (e.g. drizzle-kit, tests)
  }

  return path.resolve('./dev.db')
}
