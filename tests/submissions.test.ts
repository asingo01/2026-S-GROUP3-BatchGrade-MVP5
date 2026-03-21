import { describe, it, expect, beforeEach } from 'vitest'
import { createSubmission, getSubmissionById } from '../src/main/database/queries/submissionService'
import fs from 'fs'
import path from 'path'
import os from 'os'

// Helper to create a real temp file for testing
function createTempFile(name: string, content: string): string {
  const tempPath = path.join(os.tmpdir(), name)
  fs.writeFileSync(tempPath, content)
  return tempPath
}

// Helper to clean up temp files after use
function removeTempFile(filePath: string): void {
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
}

// Wipes the submissions table before each test so they don't affect each other
beforeEach(async () => {
  const { getDb } = await import('../src/main/database/index')
  const { submissions } = await import('../src/main/database/schema')
  getDb().delete(submissions).run()
})

describe('Submission Queries', () => {
  it('Creates a submission and returns a record', () => {
    const tempPath = createTempFile('test.cpp', '#include <iostream>')
    const submission = createSubmission({
      studentId:    'student-uuid-1',
      assignmentId: 'assignment-uuid-1',
      fileName:     'test.cpp',
      filePath:     tempPath,
    })
    expect(submission.submissionId).toBeTruthy()
    expect(submission.fileName).toBe('test.cpp')
    expect(submission.status).toBe('PENDING')
    expect(submission.fileSize).toBeGreaterThan(0)
    removeTempFile(tempPath)
  })

  it('Stores file content as base64', () => {
    const content  = '#include <iostream>'
    const tempPath = createTempFile('base64test.cpp', content)
    const submission = createSubmission({
      studentId:    'student-uuid-1',
      assignmentId: 'assignment-uuid-1',
      fileName:     'base64test.cpp',
      filePath:     tempPath,
    })
    const decoded = Buffer.from(submission.fileContent, 'base64').toString('utf-8')
    expect(decoded).toBe(content)
    removeTempFile(tempPath)
  })

  it('Retrieves a submission by ID', () => {
    const tempPath = createTempFile('getbyid.cpp', 'int main() {}')
    const created  = createSubmission({
      studentId:    'student-uuid-1',
      assignmentId: 'assignment-uuid-1',
      fileName:     'getbyid.cpp',
      filePath:     tempPath,
    })
    const found = getSubmissionById(created.submissionId)
    expect(found).toBeDefined()
    expect(found?.submissionId).toBe(created.submissionId)
    removeTempFile(tempPath)
  })

  it('Returns undefined for a non-existent submission ID', () => {
    const result = getSubmissionById('fake-uuid')
    expect(result).toBeUndefined()
  })

  it('Throws when file is empty', () => {
    const tempPath = createTempFile('empty.cpp', '')
    expect(() =>
      createSubmission({
        studentId:    'student-uuid-1',
        assignmentId: 'assignment-uuid-1',
        fileName:     'empty.cpp',
        filePath:     tempPath,
      })
    ).toThrow('is empty')
    removeTempFile(tempPath)
  })

  it('Throws when file exceeds 500 KB limit', () => {
    const tempPath = createTempFile('big.cpp', 'x'.repeat(501 * 1024))
    expect(() =>
      createSubmission({
        studentId:    'student-uuid-1',
        assignmentId: 'assignment-uuid-1',
        fileName:     'big.cpp',
        filePath:     tempPath,
      })
    ).toThrow('exceeds the maximum allowed size of 500 KB')
    removeTempFile(tempPath)
  })

  it('Records correct file size in bytes', () => {
    const content  = 'int main() { return 0; }'
    const tempPath = createTempFile('size.cpp', content)
    const submission = createSubmission({
      studentId:    'student-uuid-1',
      assignmentId: 'assignment-uuid-1',
      fileName:     'size.cpp',
      filePath:     tempPath,
    })
    expect(submission.fileSize).toBe(Buffer.byteLength(content))
    removeTempFile(tempPath)
  })

  it('Sets initial status to PENDING', () => {
    const tempPath = createTempFile('pending.cpp', 'int main() {}')
    const submission = createSubmission({
      studentId:    'student-uuid-1',
      assignmentId: 'assignment-uuid-1',
      fileName:     'pending.cpp',
      filePath:     tempPath,
    })
    expect(submission.status).toBe('PENDING')
    removeTempFile(tempPath)
  })

  it('Throws when file path does not exist', () => {
    expect(() =>
      createSubmission({
        studentId:    'student-uuid-1',
        assignmentId: 'assignment-uuid-1',
        fileName:     'ghost.cpp',
        filePath:     '/nonexistent/path/ghost.cpp',
      })
    ).toThrow()
  })
})