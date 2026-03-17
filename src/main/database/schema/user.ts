import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql, InferSelectModel, InferInsertModel } from 'drizzle-orm'

export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>
export type UpdateUser = Pick<User, 'uuid'> & Partial<Pick<User, 'email' | 'password'>>

/**
 * Users table.
 *
 * Passwords are stored as bcrypt hashes never plaintext.
 * `created_at` is stored as Unix epoch seconds via SQLite's `unixepoch()`.
 */
export const users = sqliteTable('users', {
  uuid: text('uuid')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  role: text('role')
    .notNull()
    .default("student"), // Role
  createdAt: integer('created_at', { mode: 'number' })
    .notNull()
    .default(sql`(unixepoch())`)
})
