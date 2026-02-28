import path from 'path'

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
    const { app } = require('electron')
    if (app.isPackaged) {
      return path.join(app.getPath('userData'), 'batchgrade.db')
    }
  } catch {
    // Running outside Electron (e.g. drizzle-kit, tests)
  }

  return path.resolve('./dev.db')
}