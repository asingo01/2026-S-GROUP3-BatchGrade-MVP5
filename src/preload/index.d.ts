import { ElectronAPI } from '@electron-toolkit/preload'
import type { UsersAPI, AssignmentsAPI } from './types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      users: UsersAPI,
      assignments: AssignmentsAPI
    }
  }
}
