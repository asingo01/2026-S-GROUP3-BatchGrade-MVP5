import { getDb } from '../index'
import { courses, sections } from '../schema'
import type { Course, NewCourse, Section, NewSection } from '../schema'

export function createCourse(data: NewCourse): Course {
  const created = getDb().insert(courses).values(data).returning().get()
  if (!created) {
    throw new Error('Failed to create course')
  }
  return created
}

export function createSection(data: NewSection): Section {
  const created = getDb().insert(sections).values(data).returning().get()
  if (!created) {
    throw new Error('Failed to create section')
  }
  return created
}

export function getAllCourses(): Course[] {
  return getDb().select().from(courses).all()
}

export function getAllSections(): Section[] {
  return getDb().select().from(sections).all()
}
