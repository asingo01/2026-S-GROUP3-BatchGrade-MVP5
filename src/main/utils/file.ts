// Potentially Temporary File: May be deleted in the future.
/* TEST ONLY DELETE WHEN DONE */
// This info was more or less copied from: https://www.electronjs.org/docs/latest/tutorial/ipc
// Fitted to our project needs
import { dialog } from 'electron'

async function selectFile(): Promise<string | undefined> {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile']
  })
  if (!canceled) {
    return filePaths[0]
  }
  return undefined
}

async function stringifyFile(filePath: string): Promise<string> {
  const fs = await import('fs/promises')
  const fileContent = await fs.readFile(filePath, 'utf-8')
  return fileContent
}

export { selectFile, stringifyFile }
/* TEST ONLY DELETE WHEN DONE */
