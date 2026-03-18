import { ElectronAPI } from '@electron-toolkit/preload'
import type { UsersAPI, CompilerAPI } from './types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      users: UsersAPI
      /* TEST ONLY DELETE WHEN DONE */
      file: {
        select: () => Promise<string | undefined>
        selectCppFiles: () => Promise<string[]>
        stringify: (filePath: string) => Promise<string>
      }
      /* TEST ONLY DELETE WHEN DONE */
      compiler: CompilerAPI
    }
  }
}
