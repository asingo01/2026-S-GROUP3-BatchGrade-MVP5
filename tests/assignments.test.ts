import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createAssignment,
  deleteAssignment,
  getAllAssignments,
  updateAssignment
} from '../src/main/database/queries/assignment'

beforeEach(async () => {
  const { getDb } = await import('../src/main/database/index')
  const { assignments, sections, courses, users } = await import('../src/main/database/schema')

  getDb().delete(assignments).run()
  getDb().delete(sections).run()
  getDb().delete(courses).run()
  getDb().delete(users).run()
})

/**
 * @brief Creates a valid section record for assignment foreign-key tests.
 *
 * @details
 * The assignments table requires a valid sectionId. Since sections depends on
 * courses and users, this helper creates all required parent records and
 * returns the new section UUID.
 *
 * @return Promise resolving to the created section UUID.
 */
async function createTestSection(): Promise<string> {
  const { getDb } = await import('../src/main/database/index')
  const { users, courses, sections } = await import('../src/main/database/schema')

  const instructorUuid = crypto.randomUUID()

  getDb()
    .insert(users)
    .values({
      uuid: instructorUuid,
      email: `instructor-${instructorUuid}@test.com`,
      password: 'pw',
      role: 'instructor'
    })
    .run()

  const course = getDb()
    .insert(courses)
    .values({
      courseCode: `CS${Math.floor(Math.random() * 10000)}`,
      title: 'Test Course',
      description: 'Test course description',
      credits: 3
    })
    .returning()
    .get()

  if (!course) {
    throw new Error('Failed to create test course')
  }

  const section = getDb()
    .insert(sections)
    .values({
      courseId: course.uuid,
      instructorId: instructorUuid,
      semester: 'Spring 2026'
    })
    .returning()
    .get()

  if (!section) {
    throw new Error('Failed to create test section')
  }

  return section.uuid
}

/**
 * @brief Tests for assignment query CRUD operations.
 *
 * @details
 * These tests verify that assignments can be created, listed, updated,
 * deleted, and that expected error paths are handled correctly.
 */
describe('Assignment Queries', () => {
  /**
   * @brief Verifies that an assignment can be created successfully.
   *
   * @return Nothing.
   */
  it('Creates an assignment', async () => {
    const sectionId = await createTestSection()

    const assignment = createAssignment({
      title: 'FizzBuzz',
      sectionId,
      dueDate: Math.floor(new Date('2026-03-31').getTime() / 1000),
      gradingCriteria: '10 points',
      solutionType: 'text',
      expectedOutputText: '1 2 Fizz',
      solutionFileName: null,
      solutionFilePath: null,
      createdByUserUuid: null
    })

    expect(assignment.title).toBe('FizzBuzz')
    expect(assignment.sectionId).toBe(sectionId)
    expect(assignment.uuid).toBeTruthy()
    expect(assignment.createdAt).toBeGreaterThan(0)
  })

  /**
   * @brief Verifies that all assignments are returned.
   *
   * @return Nothing.
   */
  it('Gets all assignments', async () => {
    const sectionId = await createTestSection()

    createAssignment({
      title: 'A1',
      sectionId,
      dueDate: Math.floor(new Date('2026-04-01').getTime() / 1000),
      gradingCriteria: '5 points',
      solutionType: 'text',
      expectedOutputText: 'ok',
      solutionFileName: null,
      solutionFilePath: null,
      createdByUserUuid: null
    })

    createAssignment({
      title: 'A2',
      sectionId,
      dueDate: Math.floor(new Date('2026-04-02').getTime() / 1000),
      gradingCriteria: '15 points',
      solutionType: 'file',
      expectedOutputText: null,
      solutionFileName: 'solution.cpp',
      solutionFilePath: 'pending://solution.cpp',
      createdByUserUuid: null
    })

    expect(getAllAssignments()).toHaveLength(2)
  })

  /**
   * @brief Verifies that an assignment can be updated.
   *
   * @return Nothing.
   */
  it('Updates an assignment', async () => {
    const sectionId = await createTestSection()

    const assignment = createAssignment({
      title: 'Old Name',
      sectionId,
      dueDate: Math.floor(new Date('2026-04-10').getTime() / 1000),
      gradingCriteria: 'rubric v1',
      solutionType: 'text',
      expectedOutputText: 'old output',
      solutionFileName: null,
      solutionFilePath: null,
      createdByUserUuid: null
    })

    const updated = updateAssignment({
      uuid: assignment.uuid,
      title: 'New Name',
      gradingCriteria: 'rubric v2'
    })

    expect(updated.title).toBe('New Name')
    expect(updated.gradingCriteria).toBe('rubric v2')
    expect(updated.sectionId).toBe(sectionId)
  })

    /**
   * @brief Verifies that all optional assignment fields can be updated.
   *
   * @return Nothing.
   */
  it('Updates all assignment fields', async () => {
    const sectionId1 = await createTestSection()
    const sectionId2 = await createTestSection()

    const assignment = createAssignment({
      title: 'Original Title',
      sectionId: sectionId1,
      dueDate: Math.floor(new Date('2026-05-01').getTime() / 1000),
      gradingCriteria: 'old rubric',
      solutionType: 'text',
      expectedOutputText: 'old output',
      solutionFileName: null,
      solutionFilePath: null,
      createdByUserUuid: null
    })

    const updated = updateAssignment({
      uuid: assignment.uuid,
      title: 'Updated Title',
      sectionId: sectionId2,
      dueDate: Math.floor(new Date('2026-05-15').getTime() / 1000),
      gradingCriteria: 'new rubric',
      solutionType: 'file',
      solutionFileName: 'answer.cpp',
      solutionFilePath: 'pending://answer.cpp',
      expectedOutputText: null,
      createdByUserUuid: null
    })

    expect(updated.title).toBe('Updated Title')
    expect(updated.sectionId).toBe(sectionId2)
    expect(updated.dueDate).toBe(Math.floor(new Date('2026-05-15').getTime() / 1000))
    expect(updated.gradingCriteria).toBe('new rubric')
    expect(updated.solutionType).toBe('file')
    expect(updated.solutionFileName).toBe('answer.cpp')
    expect(updated.solutionFilePath).toBe('pending://answer.cpp')
    expect(updated.expectedOutputText).toBeNull()
  })

  /**
   * @brief Verifies that an assignment can be deleted.
   *
   * @return Nothing.
   */
  it('Deletes an assignment', async () => {
    const sectionId = await createTestSection()

    const assignment = createAssignment({
      title: 'Delete Me',
      sectionId,
      dueDate: Math.floor(new Date('2026-04-15').getTime() / 1000),
      gradingCriteria: '1 point',
      solutionType: 'text',
      expectedOutputText: 'bye',
      solutionFileName: null,
      solutionFilePath: null,
      createdByUserUuid: null
    })

    deleteAssignment(assignment.uuid)

    expect(getAllAssignments()).toHaveLength(0)
  })

  /**
   * @brief Verifies that updating a non-existent assignment throws an error.
   *
   * @return Nothing.
   */
  it('Throws when updating an assignment that does not exist', () => {
    expect(() =>
      updateAssignment({
        uuid: 'fake-uuid',
        title: 'Does Not Exist'
      })
    ).toThrow('Assignment not found')
  })

  /**
   * @brief Verifies that deleting a non-existent assignment throws an error.
   *
   * @return Nothing.
   */
  it('Throws when deleting an assignment that does not exist', () => {
    expect(() => deleteAssignment('fake-uuid')).toThrow('Assignment not found')
  })

  /**
   * @brief Verifies that updating without any fields throws an error.
   *
   * @return Nothing.
   */
  it('Throws when updating without any fields', async () => {
    const sectionId = await createTestSection()

    const assignment = createAssignment({
      title: 'No Update Fields',
      sectionId,
      dueDate: Math.floor(new Date('2026-04-20').getTime() / 1000),
      gradingCriteria: '5 points',
      solutionType: 'text',
      expectedOutputText: 'output',
      solutionFileName: null,
      solutionFilePath: null,
      createdByUserUuid: null
    })

    expect(() =>
      updateAssignment({
        uuid: assignment.uuid
      })
    ).toThrow('No fields provided to update')
  })

    /**
   * @brief Verifies that createAssignment throws when the insert fails.
   *
   * @return Nothing.
   */
  it('Throws when assignment creation fails', async () => {
    vi.resetModules()

    vi.doMock('../src/main/database/index', () => ({
      getDb: () => ({
        insert: () => ({
          values: () => ({
            returning: () => ({
              get: () => undefined
            })
          })
        })
      })
    }))

    const { createAssignment } = await import('../src/main/database/queries/assignment')

    expect(() =>
      createAssignment({
        title: 'Should Fail',
        sectionId: 'fake-section',
        dueDate: Math.floor(new Date('2026-06-01').getTime() / 1000),
        gradingCriteria: 'none',
        solutionType: 'text',
        expectedOutputText: 'x',
        solutionFileName: null,
        solutionFilePath: null,
        createdByUserUuid: null
      })
    ).toThrow('Failed to create assignment')

    vi.doUnmock('../src/main/database/index')
    vi.resetModules()
  })
})