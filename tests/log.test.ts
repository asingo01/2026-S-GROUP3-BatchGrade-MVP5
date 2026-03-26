import { describe, it, expect, beforeEach } from 'vitest'

// Wipes log tables before each test in FK-safe order
beforeEach(async () => {
  const { getDb } = await import('../src/main/database/index')
  const { studentActionLogs, compileLogs, assignments, sections, courses, instructors, users } =
    await import('../src/main/database/schema')
  getDb().delete(studentActionLogs).run()
  getDb().delete(compileLogs).run()
  getDb().delete(assignments).run()
  getDb().delete(sections).run()
  getDb().delete(instructors).run()
  getDb().delete(courses).run()
  getDb().delete(users).run()
})

// Helper: inserts a user row
async function seedUser(email: string) {
  const { getDb } = await import('../src/main/database/index')
  const { users } = await import('../src/main/database/schema')
  return getDb().insert(users).values({ email, password: 'pw' }).returning().get()
}

// Helper: inserts a section (requires course + instructor)
async function seedSection(instructorUuid: string) {
  const { getDb } = await import('../src/main/database/index')
  const { courses, sections } = await import('../src/main/database/schema')
  const course = getDb()
    .insert(courses)
    .values({ courseCode: `LOG${Date.now()}`, title: 'Test Course', credits: 3 })
    .returning()
    .get()
  return getDb()
    .insert(sections)
    .values({ courseId: course.uuid, instructorId: instructorUuid, semester: 'Spring 2026' })
    .returning()
    .get()
}

// Helper: inserts an assignment (requires section)
async function seedAssignment(sectionId: string) {
  const { getDb } = await import('../src/main/database/index')
  const { assignments } = await import('../src/main/database/schema')
  return getDb()
    .insert(assignments)
    .values({ sectionId, title: 'Log Test Assignment', dueDate: 1743465600 })
    .returning()
    .get()
}

// ─── Student Action Logs ──────────────────────────────────────────────────────

describe('Student Action Log Schema', () => {
  it('existingUser_insertActionLog_generatesUuidAndStoresAction', async () => {
    const { getDb } = await import('../src/main/database/index')
    const { studentActionLogs } = await import('../src/main/database/schema')
    const user = await seedUser('logger@test.com')

    const result = getDb()
      .insert(studentActionLogs)
      .values({ userId: user.uuid, action: 'submit' })
      .returning()
      .get()

    expect(result.uuid).toBeTruthy()
    expect(result.action).toBe('submit')
    expect(result.userId).toBe(user.uuid)
  })

  it('actionLogWithAllOptionalFields_insert_storesAllFields', async () => {
    const { getDb } = await import('../src/main/database/index')
    const { studentActionLogs } = await import('../src/main/database/schema')
    const user = await seedUser('logger2@test.com')

    const result = getDb()
      .insert(studentActionLogs)
      .values({
        userId: user.uuid,
        action: 'view_grade',
        entityId: 'assignment-uuid-123',
        details: 'Student viewed their grade for PA1'
      })
      .returning()
      .get()

    expect(result.entityId).toBe('assignment-uuid-123')
    expect(result.details).toBe('Student viewed their grade for PA1')
  })

  it('actionLogInserted_createdAtField_isPopulatedAutomatically', async () => {
    const { getDb } = await import('../src/main/database/index')
    const { studentActionLogs } = await import('../src/main/database/schema')
    const user = await seedUser('logger3@test.com')

    const result = getDb()
      .insert(studentActionLogs)
      .values({ userId: user.uuid, action: 'login' })
      .returning()
      .get()

    expect(result.createdAt).toBeTruthy()
  })

  it('multipleLogsForSameUser_selectAll_returnsAllLogs', async () => {
    const { getDb } = await import('../src/main/database/index')
    const { studentActionLogs } = await import('../src/main/database/schema')
    const user = await seedUser('logger4@test.com')

    getDb().insert(studentActionLogs).values({ userId: user.uuid, action: 'login' }).run()
    getDb().insert(studentActionLogs).values({ userId: user.uuid, action: 'submit' }).run()
    getDb().insert(studentActionLogs).values({ userId: user.uuid, action: 'logout' }).run()

    expect(getDb().select().from(studentActionLogs).all()).toHaveLength(3)
  })

  it('userDeleted_cascadeDelete_removesActionLogs', async () => {
    const { getDb } = await import('../src/main/database/index')
    const { studentActionLogs, users } = await import('../src/main/database/schema')
    const user = await seedUser('logger5@test.com')
    getDb().insert(studentActionLogs).values({ userId: user.uuid, action: 'login' }).run()

    getDb().delete(users).run()

    expect(getDb().select().from(studentActionLogs).all()).toHaveLength(0)
  })
})

// ─── Compile Logs ─────────────────────────────────────────────────────────────

describe('Compile Log Schema', () => {
  it('existingStudentAndAssignment_insertSuccessCompileLog_generatesUuidAndStoresFields', async () => {
    const { getDb } = await import('../src/main/database/index')
    const { compileLogs, instructors } = await import('../src/main/database/schema')
    const student = await seedUser('compile_stu@test.com')
    const instructor = await seedUser('compile_prof@test.com')
    getDb().insert(instructors).values({ uuid: instructor.uuid, firstName: 'F', lastName: 'L' }).run()
    const section = await seedSection(instructor.uuid)
    const assignment = await seedAssignment(section.uuid)

    const result = getDb()
      .insert(compileLogs)
      .values({
        studentId: student.uuid,
        submissionId: assignment.uuid,
        status: 'success',
        exitCode: 0,
        stdout: 'Hello World',
        duration: 150
      })
      .returning()
      .get()

    expect(result.uuid).toBeTruthy()
    expect(result.status).toBe('success')
    expect(result.exitCode).toBe(0)
    expect(result.stdout).toBe('Hello World')
    expect(result.duration).toBe(150)
  })

  it('compileLogWithError_insert_storesStderr', async () => {
    const { getDb } = await import('../src/main/database/index')
    const { compileLogs, instructors } = await import('../src/main/database/schema')
    const student = await seedUser('compile_stu2@test.com')
    const instructor = await seedUser('compile_prof2@test.com')
    getDb().insert(instructors).values({ uuid: instructor.uuid, firstName: 'F', lastName: 'L' }).run()
    const section = await seedSection(instructor.uuid)
    const assignment = await seedAssignment(section.uuid)

    const result = getDb()
      .insert(compileLogs)
      .values({
        studentId: student.uuid,
        submissionId: assignment.uuid,
        status: 'error',
        exitCode: 1,
        stderr: 'error: expected ; before }',
        duration: 50
      })
      .returning()
      .get()

    expect(result.status).toBe('error')
    expect(result.exitCode).toBe(1)
    expect(result.stderr).toBe('error: expected ; before }')
  })

  it('compileLogInserted_createdAtField_isPopulatedAutomatically', async () => {
    const { getDb } = await import('../src/main/database/index')
    const { compileLogs, instructors } = await import('../src/main/database/schema')
    const student = await seedUser('compile_stu3@test.com')
    const instructor = await seedUser('compile_prof3@test.com')
    getDb().insert(instructors).values({ uuid: instructor.uuid, firstName: 'F', lastName: 'L' }).run()
    const section = await seedSection(instructor.uuid)
    const assignment = await seedAssignment(section.uuid)

    const result = getDb()
      .insert(compileLogs)
      .values({ studentId: student.uuid, submissionId: assignment.uuid, status: 'success' })
      .returning()
      .get()

    expect(result.createdAt).toBeTruthy()
  })
})
