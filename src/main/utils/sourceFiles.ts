import { dirname, extname, relative, resolve, sep } from 'node:path'

export function getCommonWorkingDirectory(sourceFiles: string[]): string {
  if (sourceFiles.length === 0) {
    return process.cwd()
  }

  const directories = sourceFiles.map((filePath) => resolve(dirname(filePath)))
  const [firstDirectory, ...restDirectories] = directories
  const firstSegments = firstDirectory.split(sep)

  let sharedLength = firstSegments.length

  for (const nextDirectory of restDirectories) {
    const nextSegments = nextDirectory.split(sep)
    let index = 0

    while (
      index < sharedLength &&
      index < nextSegments.length &&
      firstSegments[index].toLowerCase() === nextSegments[index].toLowerCase()
    ) {
      index += 1
    }

    sharedLength = index
  }

  if (sharedLength === 0) {
    return dirname(resolve(sourceFiles[0]))
  }

  const sharedSegments = firstSegments.slice(0, sharedLength)
  const sharedDirectory = sharedSegments.join(sep)

  return sharedDirectory || sep
}

export function getCppImplementationFiles(sourceFiles: string[]): string[] {
  return sourceFiles.filter((filePath) => {
    const extension = extname(filePath).toLowerCase()

    return extension === '.cpp' || extension === '.cc' || extension === '.cxx' || extension === '.cp'
  })
}

export function getSubmissionRelativePath(rootDirectory: string, filePath: string): string {
  const relativePath = relative(rootDirectory, filePath)

  return relativePath && !relativePath.startsWith('..') ? relativePath : filePath.split(sep).pop() ?? filePath
}
