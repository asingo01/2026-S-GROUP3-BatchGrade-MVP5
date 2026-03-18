/* eslint-disable prettier/prettier */
import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { initDb } from './database/index'
import type { NewUser, UpdateUser } from './database/schema'
import { getAllUsers, createUser, updateUser, deleteUser } from './database/queries'

/* TEST ONLY DELETE WHEN DONE */
import { selectFile, stringifyFile } from './utils/file'
/* TEST ONLY DELETE WHEN DONE */

// @ Issue 9: Implement Automated Build & Compilation
import { detectGccInstallation } from './compiler/gccDetection'
import type { GccInstallationInfo } from '../shared/compiler'

let gccStatusPromise: Promise<GccInstallationInfo> | undefined
/*
  Need this helper function in case a user changes compiler settings or a compile step needs to revalidate the path
*/
function refreshGccStatus(): Promise<GccInstallationInfo> {
  gccStatusPromise = detectGccInstallation()
  return gccStatusPromise
}

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.batchgrade.app')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Initialize the database
  initDb()

  // Detect GCC during startup
  refreshGccStatus() // For renderers (Front-end developers): Use this to query a ready-made status object.

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Users CRUD
  ipcMain.handle('users:getAll', () => getAllUsers())
  ipcMain.handle('users:create', (_e, data: NewUser) => createUser(data))
  ipcMain.handle('users:update', (_e, data: UpdateUser) => updateUser(data))
  ipcMain.handle('users:delete', (_e, uuid: string) => deleteUser(uuid))

  // Compiler Status
  ipcMain.handle('compiler:getGccStatus', async () => gccStatusPromise ?? refreshGccStatus())

  /* TEST ONLY DELETE WHEN DONE */
  // File selection
  ipcMain.handle('file:select', () => selectFile())
  ipcMain.handle('file:stringify', (_e, filePath: string) => stringifyFile(filePath))
  /* TEST ONLY DELETE WHEN DONE */

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
