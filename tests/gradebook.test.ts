import { describe, it, expect, beforeEach } from 'vitest'

// Wipes gradebook tables before each test in FK-safe order
beforeEach(async () => {
  const { getDb } = await import('../src/main/database/index')
  const { grades, submissions, assignments, sections, courses, users } = await import(
    '../src/main/database/schema'
  )
  getDb().delete(grades).run()
  getDb().delete(submissions).run()
  getDb().delete(assignments).run()
  getDb().delete(sections).run()
  getDb().delete(courses).run()
  getDb().delete(users).run()
})

// Helper: inserts a user row
async function seedUser(email: string) {
  const { getDb } = await import('../src/main/database/index')
  const { users } = await import('../src/main/database/schema')
  return getDb().insert(users).values({ email, password: 'pw' }).returning().get()
}

// Helper: inserts a section row (requires course + instructor)
async function seedSection() {
  const { getDb } = await import('../src/main/database/index')
  const { courses, sections, instructors } = await import('../src/main/database/schema')
  const user = await seedUser(`sec_seed_${Date.now()}@test.com`)
  getDb().insert(instructors).values({ uuid: user.uuid, firstName: 'I', lastName: 'J' }).run()
  const course = getDb()
    .insert(courses)
    .values({ courseCode: `C${Date.now()}`, title: 'Course', credits: 3 })
    .returning()
    .get()
  return getDb()
    .insert(sections)
    .values({ courseId: course.uuid, instructorId: user.uuid, semester: 'Spring 2026' })
    .returning()
    .get()
}

// Helper: inserts an assignment row (requires a section)
async function seedAssignment(sectionId: string) {
  const { getDb } = await import('../src/main/database/index')
  const { assignments } = await import('../src/main/database/schema')
  return getDb()
    .insert(assignments)
    .values({ sectionId, title: 'HW1', dueDate: 1743465600 })
    .returning()
    .get()
}

// ─── Assignments ─────────────────────────────────────────────────────────────

describe('Gradebook Assignment Schema', () => {
  it('existingSection_insertAssignment_generatesUuidAndStoresFields', async () => {
    const { getDb } = await import('../src/main/database/index')
    const { assignments } = await import('../src/main/database/schema')
    const section = await seedSection()

    const result = getDb()
      .insert(assignments)
      .values({ sectionId: section.uuid, title: 'PA1', dueDate: 1743465600 })
      .returning()
      .get()

    expect(result.uuid).toBeTruthy()
    expect(result.title).toBe('PA1')
    expect(result.sectionId).toBe(section.uuid)
  })

  it('twoAssignments_selectAll_returnsBothRecords', async () => {
    const { getDb } = await import('../src/main/database/index')
    const { assignments } = await import('../src/main/database/schema')
    const section = await seedSection()

    getDb().insert(assignments).values({ sectionId: section.uuid, title: 'PA1', dueDate: 1743465600 }).run()
    getDb().insert(assignments).values({ sectionId: section.uuid, title: 'PA2', dueDate: 1744070400 }).run()

    expect(getDb().select().from(assignments).all()).toHaveLength(2)
  })
})

// ─── Submissions ─────────────────────────────────────────────────────────────

describe('Submission Schema', () => {
  it('existingAssignmentAndStudent_insertSubmission_defaultsToNotSubmittedStatus', async () => {
    const { getDb } = await import('../src/main/database/index')
    const { submissions } = await import('../src/main/database/schema')
    const section = await seedSection()
    const assignment = await seedAssignment(section.uuid)
    const student = await seedUser('sub_stu@test.com')

    const result = getDb()
      .insert(submissions)
      .values({ assignmentId: assignment.uuid, studentId: student.uuid, fileName: 'main.cpp', fileSize: 1024 })
      .returning()
      .get()

    expect(result.uuid).toBeTruthy()
    expect(result.status).toBe('not submitted')
    expect(result.fileName).toBe('main.cpp')
    expect(result.fileSize).toBe(1024)
  })

  it('submissionWithFileContent_insert_storesContent', async () => {
    const { getDb } = await import('../src/main/database/index')
    const { submissions } = await import('../src/main/database/schema')
    const section = await seedSection()
    const assignment = await seedAssignment(section.uuid)
    const student = await seedUser('sub_stu2@test.com')

    const result = getDb()
      .insert(submissions)
      .values({
        assignmentId: assignment.uuid,
        studentId: student.uuid,
        fileName: 'solution.cpp',
        fileSize: 512,
        fileContent: '#include<iostream>',
        status: 'submitted'
      })
      .returning()
      .get()

    expect(result.fileContent).toBe('#include<iostream>')
    expect(result.status).toBe('submitted')
  })

  it('submissionInserted_submittedAtField_isPopulatedAutomatically', async () => {
    const { getDb } = await import('../src/main/database/index')
    const { submissions } = await import('../src/main/database/schema')
    const section = await seedSection()
    const assignment = await seedAssignment(section.uuid)
    const student = await seedUser('sub_stu3@test.com')

    const result = getDb()
      .insert(submissions)
      .values({ assignmentId: assignment.uuid, studentId: student.uuid, fileName: 'a.cpp', fileSize: 100 })
      .returning()
      .get()

    expect(result.submittedAt).toBeTruthy()
  })

  it('submissionWithDefaultFileName_insert_usesNADefault', async () => {
    const { getDb } = await import('../src/main/database/index')
    const { submissions } = await import('../src/main/database/schema')
    const section = await seedSection()
    const assignment = await seedAssignment(section.uuid)
    const student = await seedUser('sub_stu4@test.com')

    const result = getDb()
      .insert(submissions)
      // fileName and fileSize not provided — rely on defaults
      .values({ assignmentId: assignment.uuid, studentId: student.uuid })
      .returning()
      .get()

    expect(result.fileName).toBe('N/A')
    expect(result.fileSize).toBe(0)
  })
})

// ─── Grades ──────────────────────────────────────────────────────────────────

describe('Grade Schema', () => {
  it('existingSubmissionAndInstructor_insertGrade_generatesUuidAndStoresScore', async () => {
    const { getDb } = await import('../src/main/database/index')
    const { submissions, grades } = await import('../src/main/database/schema')
    const section = await seedSection()
    const assignment = await seedAssignment(section.uuid)
    const student = await seedUser('grade_stu@test.com')
    const instructor = await seedUser('grade_prof@test.com')

    const submission = getDb()
      .insert(submissions)
      .values({ assignmentId: assignment.uuid, studentId: student.uuid })
      .returning()
      .get()

    const result = getDb()
      .insert(grades)
      .values({ submissionId: submission.uuid, instructorId: instructor.uuid, score: 95 })
      .returning()
      .get()

    expect(result.uuid).toBeTruthy()
    expect(result.score).toBe(95)
    expect(result.instructorId).toBe(instructor.uuid)
  })

  it('gradeWithFeedback_insert_storesFeedbackText', async () => {
    const { getDb } = await import('../src/main/database/index')
    const { submissions, grades } = await import('../src/main/database/schema')
    const section = await seedSection()
    const assignment = await seedAssignment(section.uuid)
    const student = await seedUser('grade_stu2@test.com')
    const instructor = await seedUser('grade_prof2@test.com')

    const submission = getDb()
      .insert(submissions)
      .values({ assignmentId: assignment.uuid, studentId: student.uuid })
      .returning()
      .get()

    const result = getDb()
      .insert(grades)
      .values({
        submissionId: submission.uuid,
        instructorId: instructor.uuid,
        score: 80,
        feedback: 'Good work but missing edge cases'
      })
      .returning()
      .get()

    expect(result.feedback).toBe('Good work but missing edge cases')
    expect(result.gradedAt).toBeTruthy()
  })

  it('gradeWithZeroScore_insert_storesZero', async () => {
    const { getDb } = await import('../src/main/database/index')
    const { submissions, grades } = await import('../src/main/database/schema')
    const section = await seedSection()
    const assignment = await seedAssignment(section.uuid)
    const student = await seedUser('grade_stu3@test.com')
    const instructor = await seedUser('grade_prof3@test.com')

    const submission = getDb()
      .insert(submissions)
      .values({ assignmentId: assignment.uuid, studentId: student.uuid })
      .returning()
      .get()

    const result = getDb()
      .insert(grades)
      .values({ submissionId: submission.uuid, instructorId: instructor.uuid, score: 0 })
      .returning()
      .get()

    expect(result.score).toBe(0)
  })
})
