/*
  submitCppSubmission.ts
    - Validates C++ submission requests (assignment, student, files)
    - Creates a unique submission directory under Electron userData
    - Copies source files preserving relative paths
    - Writes a submission manifest JSON with metadata for grading
 */

import { randomUUID } from 'node:crypto'
import { copyFile, mkdir, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'

import { app } from 'electron'

import type { SubmitCppRequest, SubmitCppResult } from '../../shared/submission'
import { getCommonWorkingDirectory, getSubmissionRelativePath } from '../utils/sourceFiles'

export async function submitCppSubmission(request: SubmitCppRequest): Promise<SubmitCppResult> {
  if (!request.assignmentId) {
    return {
      submissionSuccess: false,
      submissionId: null,
      assignmentId: request.assignmentId,
      studentId: request.studentId,
      submissionDirectory: null,
      manifestPath: null,
      submittedAt: null,
      submittedFiles: [],
      message: 'Select an assignment before submitting.'
    }
  }

  if (!request.studentId) {
    return {
      submissionSuccess: false,
      submissionId: null,
      assignmentId: request.assignmentId,
      studentId: request.studentId,
      submissionDirectory: null,
      manifestPath: null,
      submittedAt: null,
      submittedFiles: [],
      message: 'Student identity is required before submitting.'
    }
  }

  if (request.sourceFiles.length === 0) {
    return {
      submissionSuccess: false,
      submissionId: null,
      assignmentId: request.assignmentId,
      studentId: request.studentId,
      submissionDirectory: null,
      manifestPath: null,
      submittedAt: null,
      submittedFiles: [],
      message: 'Select at least one source file before submitting.'
    }
  }

  const submissionId = randomUUID()
  const submittedAt = new Date().toISOString()
  const timestampDirectory = submittedAt.replace(/[:.]/g, '-')
  const rootDirectory = getCommonWorkingDirectory(request.sourceFiles)
  const submissionDirectory = join(
    app.getPath('userData'),
    'submissions',
    request.studentId,
    request.assignmentId,
    `${timestampDirectory}-${submissionId}`
  )

  await mkdir(submissionDirectory, { recursive: true })

  const submittedFiles = await Promise.all(
    request.sourceFiles.map(async (filePath) => {
      const relativePath = getSubmissionRelativePath(rootDirectory, filePath)
      const targetPath = join(submissionDirectory, relativePath)

      await mkdir(dirname(targetPath), { recursive: true })
      await copyFile(filePath, targetPath)

      return {
        originalPath: filePath,
        relativePath,
        fileName: basename(filePath)
      }
    })
  )

  const manifestPath = join(submissionDirectory, 'submission-manifest.json')

  await writeFile(
    manifestPath,
    JSON.stringify(
      {
        formatVersion: 1,
        submissionId,
        assignmentId: request.assignmentId,
        studentId: request.studentId,
        submittedAt,
        sourceRoot: rootDirectory,
        submittedFiles,
        compileSnapshot: request.compileSnapshot
      },
      null,
      2
    ),
    'utf8'
  )

  return {
    submissionSuccess: true,
    submissionId,
    assignmentId: request.assignmentId,
    studentId: request.studentId,
    submissionDirectory,
    manifestPath,
    submittedAt,
    submittedFiles,
    message: 'Submission saved for later grading.'
  }
}
