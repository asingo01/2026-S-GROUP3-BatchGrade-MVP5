import { eq } from 'drizzle-orm'
import { getDb } from '../index'
import fs from 'fs'
import { submissions, NewSubmission, Submission } from '../schema'


// ai-gen start (Claude Sonnet 4.6, 2)
const MAX_FILE_SIZE = 500 * 1024 // 500 KB soft limit for file size

/*
 * createSubmission: Inserts a new submission record into SQLite via Drizzle ORM.
 * Reads the file from disk, encodes it as base64, and stores it as text so
 * the submission is retrievable regardless of original file location.
 * Input: studentId, assignmentId, fileName, and the filePath on disk.
 * Output: The newly created Submission record.
*/
export function createSubmission(input: {
  studentId: string
  assignmentId: string
  fileName: string
  filePath: string
}): Submission {
  const db = getDb()

  const fileBuffer  = fs.readFileSync(input.filePath)
  const fileSize    = fileBuffer.byteLength
  const fileContent = fileBuffer.toString('base64')

  // Reject empty files
  if (fileSize === 0) {
    throw new Error(`Submitted file "${input.fileName}" is empty.`)
  }

  // Reject large files
  if (fileSize > MAX_FILE_SIZE) {
    throw new Error(
      `File "${input.fileName}" exceeds the maximum allowed size of 500 KB. ` +
      `Submitted file size: ${(fileSize / 1024).toFixed(1)} KB.`
    )
  }

  const newSubmission: Omit<NewSubmission, 'submissionId' | 'submittedAt'> = {
    studentId: input.studentId,
    assignmentId: input.assignmentId,
    fileName: input.fileName,
    fileContent,
    fileSize,
    status: 'PENDING',
  }

  db.insert(submissions).values(newSubmission).run()

  const created = db
    .select()
    .from(submissions)
    .where(eq(submissions.fileName, input.fileName))
    .orderBy(submissions.submittedAt)
    .get()

  if (!created) throw new Error('Failed to create submission record.')
  return created
}
// ai-gen end
/**
 * getSubmissionById: Retrieves a single submission record by its UUID.
 * Input: A string submissionId for the target submission.
 * Output: A Submission record, or undefined if not found.
 */
export function getSubmissionById(submissionId: string): Submission | undefined {
  const db = getDb()
  return db
    .select()
    .from(submissions)
    .where(eq(submissions.submissionId, submissionId))
    .get()
}