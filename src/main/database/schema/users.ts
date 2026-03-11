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
  createdAt: integer('created_at', { mode: 'number' })
    .notNull()
    .default(sql`(unixepoch())`)
})


/**
 * Assignment table
 * 
 * Stores assignemnt configurations for MVP-5
 */
export const assignments = sqliteTable('assignements', {
    uuid: text('uuid')
    .primarykey()
    .$defaultFn(() => crypto.randomUUID()),

    name: text('name').notNull(),                          // name of file
    dueDate: text('due_date').notNull(),                   // due date
    grading_criteria: text('grading_criteria').notNull(),  // grading criteria 


    // FR10: instructors solution(s) choice: file or text
    solutionType: text('solution_type').notNull(),         // file or text

    // If type is file
    solutionFileName: text('solution_file_name'),
    solutionFilePath: text('solution_file_path'),

    // if type is text
    expectedOutputText: text('expected_output_text'),

    // create by
    createdByUserUuid: text('created_by_user_uuid'),

    createdAt: integer('created_at', { mode: 'number' })
      .notNull()
      .default(sql`(unixepoch())`)
})