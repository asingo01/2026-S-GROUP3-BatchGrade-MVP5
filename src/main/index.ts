import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { initDb } from './database/index'
import type { NewUser, UpdateUser } from './database/schema'
import { getAllUsers, createUser, updateUser, deleteUser } from './database/queries'
import { createSubmission, getSubmissionById } from './database/queries/submissionService'
import { dialog } from 'electron'


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

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Users CRUD
  ipcMain.handle('users:getAll', () => getAllUsers())
  ipcMain.handle('users:create', (_e, data: NewUser) => createUser(data))
  ipcMain.handle('users:update', (_e, data: UpdateUser) => updateUser(data))
  ipcMain.handle('users:delete', (_e, uuid: string) => deleteUser(uuid))

  // openFile operation FR1
  ipcMain.handle('dialog:openFile', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    // Only allows c++ files for now
    filters: [{ name: 'Source Files', extensions: ['cpp'] }]
  })
  if (result.canceled) return null
  return result.filePaths[0]
  })

  // Submissions CRUD
  ipcMain.handle('submissions:create', (_e, data: {
    studentId: string
    assignmentId: string
    fileName: string
    filePath: string
  }) => createSubmission(data))

  ipcMain.handle('submissions:getById', (_e, submissionId: string) =>
    getSubmissionById(submissionId)
  )

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
