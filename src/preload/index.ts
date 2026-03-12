import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { UsersAPI, AssignmentsAPI } from './types'

const usersApi: UsersAPI = {
  getAll: () => ipcRenderer.invoke('users:getAll'),
  create: (data) => ipcRenderer.invoke('users:create', data),
  update: (data) => ipcRenderer.invoke('users:update', data),
  delete: (uuid) => ipcRenderer.invoke('users:delete', uuid)
}

/**
 * @brief Preload API for assignment CRUD operations.
 */
const assignmentsApi: AssignmentsAPI = {
  getAll: () => ipcRenderer.invoke('assignments:getAll'),
  create: (data) => ipcRenderer.invoke('assignments:create', data),
  update: (data) => ipcRenderer.invoke('assignments:update', data),
  delete: (uuid) => ipcRenderer.invoke('assignments:delete', uuid)
}


// Custom APIs for renderer
const api = {
  users: usersApi,
  assignments: assignmentsApi
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
