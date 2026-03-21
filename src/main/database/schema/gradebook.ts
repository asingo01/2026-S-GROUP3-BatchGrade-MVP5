import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { sections } from './academic'
import { users } from './user'

export const assignments = sqliteTable('assignments', {
  uuid: text('uuid')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  sectionId: text('section_id')
    .notNull()
    .references(() => sections.uuid),
  title: text('title').notNull(),
  dueDate: integer('due_date').notNull() // Change the variable type to date type
})

export const submissions = sqliteTable('submissions', {
  uuid: text('uuid')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  assignmentId: text('assignment_id')
    .notNull()
    .references(() => assignments.uuid),
  studentId: text('student_id')
    .notNull()
    .references(() => users.uuid),
  fileContent: text('file_content'),
  fileName: text('file_name').notNull().default('N/A'),
  fileSize: integer('file_size').notNull().default(0),
  status: text('status').notNull().default('not submitted'), // "submittted", "pending", "not submitted", "graded"
  submittedAt: integer('submitted_at').default(sql`(unixepoch())`)
})

export const grades = sqliteTable('grades', {
  uuid: text('uuid')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  submissionId: text('submission_id')
    .notNull()
    .references(() => submissions.uuid),
  instructorId: text('instructor_id')
    .notNull()
    .references(() => users.uuid),
  score: integer('score').notNull(),
  feedback: text('feedback'),
  gradedAt: integer('graded_at').default(sql`(unixepoch())`)
})
