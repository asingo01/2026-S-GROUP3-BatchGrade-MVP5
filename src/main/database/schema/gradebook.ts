import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { sql, InferSelectModel, InferInsertModel  } from 'drizzle-orm'
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
  dueDate: integer('due_date').notNull(),

  gradingCriteria: text('grading_criteria'),
  solutionType: text('solution_type'),
  solutionFileName: text('solution_file_name'),
  solutionFilePath: text('solution_file_path'),
  expectedOutputText: text('expected_output_text'),
  createdByUserUuid: text('created_by_user_uuid').references(() => users.uuid),
  createdAt: integer('created_at').notNull().default(sql`(unixepoch())`)
})

export type Assignment = InferSelectModel<typeof assignments>
export type NewAssignment = InferInsertModel<typeof assignments>
export type UpdateAssignment = Pick<Assignment, 'uuid'> & Partial<NewAssignment>

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
