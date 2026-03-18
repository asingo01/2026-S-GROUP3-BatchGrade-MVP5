import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { UsersAPI, CompilerAPI } from './types'

const usersApi: UsersAPI = {
  getAll: () => ipcRenderer.invoke('users:getAll'),
  create: (data) => ipcRenderer.invoke('users:create', data),
  update: (data) => ipcRenderer.invoke('users:update', data),
  delete: (uuid) => ipcRenderer.invoke('users:delete', uuid)
}

const compilerApi: CompilerAPI = {
  getGccStatus: () => ipcRenderer.invoke('compiler:getGccStatus'),
  setGccPath: (filePath: string) => ipcRenderer.invoke('compiler:setGccPath', filePath)
}

/* TEST ONLY DELETE WHEN DONE */
const fileApi = {
  select: () => ipcRenderer.invoke('file:select'),
  stringify: (filePath: string) => ipcRenderer.invoke('file:stringify', filePath)
}
/* TEST ONLY DELETE WHEN DONE */

// Custom APIs for renderer
const api = {
  users: usersApi,
  /* TEST ONLY DELETE WHEN DONE */
  file: fileApi,
  /* TEST ONLY DELETE WHEN DONE */
  compiler: compilerApi
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
