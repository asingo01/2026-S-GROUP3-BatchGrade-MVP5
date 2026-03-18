/*
  compileCppFiles:
    - Keeps only implementation files: .cpp, .cc, .cxx
    - Ignores header files
    - Compiles all source files together
    - Creates a temporary executable
    - Places executable into a temporary folder
    - Returns compilation output
*/
import { execFile } from 'child_process'
import { mkdtemp } from 'fs/promises'
import { tmpdir } from 'os'
import { dirname, extname, join } from 'path'
import { promisify } from 'util'

import type { CompileCppRequest, CompileCppResult } from '../../shared/compiler'

const execFileAsync = promisify(execFile)

/* 
  Finds the common parent directory for a list of source files.
  If no files are provided, returns the current working directory.
*/
function getCommonWorkingDirectory(sourceFiles: string[]): string {
  if (sourceFiles.length == 0) { // If sourceFiles is empty -> go back to current working directory
    return process.cwd()
  }

  // Start with first files' directory as the initial prefix
  let currentPrefix = dirname(sourceFiles[0])

  // Iterate over remaining files
  for (const sourceFile of sourceFiles.slice(1)) {
    const nextDirectory = dirname(sourceFile)

    // Keep shortening prefix until it becomes empty or next directory starts with the current directory
    while (currentPrefix.length > 0 && !nextDirectory.toLowerCase().startsWith(currentPrefix.toLowerCase())) {
      currentPrefix = dirname(currentPrefix)
    }
  }

  return currentPrefix
}

// Filters a list of file paths and returns only C++ implementation files
function getCppFiles(sourceFiles: string[]): string[] {
  return sourceFiles.filter((filePath) => {
    const ext = extname(filePath).toLowerCase()

    return ext === '.cpp' || ext === '.cc' || ext === '.cxx' || ext === '.cp'
  })
}

async function compileCppFiles(compilerPath: string, request: CompileCppRequest): Promise<CompileCppResult> {
  const cppFiles = getCppFiles(request.sourceFiles)

  if (cppFiles.length == 0) {
    return {
      compileSuccess: false,
      compilerPath,
      executablePath: null,
      sourceFiles: request.sourceFiles,
      stdout: '',
      stderr: '',
      message: 'Select at least one C++ source file.'
    }
  }

  // The compiled program goes into a temporary folder -> the student's project directory with build artifacts
  const tempDirectory = await mkdtemp(join(tmpdir(), 'batchgrade-'))
  let executableName = 'batchgrade-program'
  if (process.platform === 'win32') {
    executableName = 'batchgrade-program.exe'
  }
  const executablePath = join(tempDirectory, executableName)
  const workingDir = getCommonWorkingDirectory(request.sourceFiles)

  try {
    // Compile all implementation files together into one executable
    const compileRes = await execFileAsync(compilerPath, [...cppFiles, '-o', executablePath], {
      cwd: workingDir,
      windowsHide: true,
      timeout: 15000 // 15 seconds
    })

    return {
      compileSuccess: true,
      compilerPath,
      executablePath,
      sourceFiles: request.sourceFiles,
      stdout: compileRes.stdout,
      stderr: compileRes.stderr,
      message: 'Compilation success.'
    }
  } catch (error) {
    const compileError = error as {
      stdout?: string
      stderr?: string
      message: string
    }

    return {
      compileSuccess: false,
      compilerPath,
      executablePath: null,
      sourceFiles: request.sourceFiles,
      stdout: compileError.stdout ?? '',
      stderr: compileError.stderr ?? compileError.message,
      message: 'Compilation failed.'
    }
  }

}

export { compileCppFiles }
