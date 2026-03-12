import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { users } from './user'

/**
 * Base Profiles
 * Link to users.uuid.
 */

// Instructors: Storing intructor's info
export const instructors = sqliteTable('instructors', {
  uuid: text('uuid')
    .primaryKey()
    .references(() => users.uuid, { onDelete: 'cascade' }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull()
})

// Students: Storing student's info
export const students = sqliteTable('students', {
  uuid: text('uuid')
    .primaryKey()
    .references(() => users.uuid, { onDelete: 'cascade' }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull()
})

// Teaching Assistants: storing TA's info
export const teaching_assistants = sqliteTable('teaching_assistants', {
  uuid: text('uuid')
    .primaryKey()
    .references(() => users.uuid, { onDelete: 'cascade' }),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull()
})

/**
 * Courses & Sections
 */

// Courses:
export const courses = sqliteTable('courses', {
  uuid: text('uuid')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseCode: text('course_code').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  credits: integer('credits').notNull()
})

// Sections:
export const sections = sqliteTable('sections', {
  uuid: text('uuid')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  courseId: text('course_id')
    .notNull()
    .references(() => courses.uuid),
  instructorId: text('instructor_id')
    .notNull()
    .references(() => users.uuid),
  semester: text('semester').notNull()
})

// Enrollments
export const enrollments = sqliteTable('enrollments', {
  uuid: text('uuid')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  studentId: text('student_id')
    .notNull()
    .references(() => users.uuid),
  sectionId: text('section_id')
    .notNull()
    .references(() => sections.uuid)
})
