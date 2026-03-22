import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql, InferSelectModel, InferInsertModel } from 'drizzle-orm'

export type Submission = InferSelectModel<typeof submissions>
export type NewSubmission = InferInsertModel<typeof submissions>
export type UpdateSubmission = Pick<Submission, 'submissionId'> & Partial<Pick<Submission, 'status'>>

/**
 * Submission table.
 *
 * Stores metadata for each student file submission.
 * `submitted_at` is stored as Unix epoch seconds via SQLite's `unixepoch()`.
 */
export const submissions = sqliteTable('submissions', {
  submissionId: text('submission_id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  assignmentId: text('assignment_id').notNull(),
  studentId: text('student_id').notNull(),
  fileName: text('file_name').notNull(),
  fileContent: text('file_content').notNull(),
  fileSize: integer('file_size').notNull(),
  status: text('status').notNull().default('PENDING'),
  submittedAt: integer('submitted_at', { mode: 'number' })
    .notNull()
    .default(sql`(unixepoch())`),
})
