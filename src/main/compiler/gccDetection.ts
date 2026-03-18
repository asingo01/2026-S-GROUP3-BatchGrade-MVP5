/* eslint-disable prettier/prettier */
// Compiler Detection Service

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

import type { GccInstallationInfo, SupportedPlatform } from '../../shared/compiler'

const execFileAsync = promisify(execFile)

async function gccCommand(command: string): Promise<string | null> {
  try { // Need error handling -> If command fails, it returns null safely
    const res = await execFileAsync(command, ['--version'], {
      windowsHide: true,
      timeout: 8000 // 8000 ms or 8 sec
    })

    if (res.stdout || res.stderr) {
      return command
    }
    else {
      return null
    }
  }
  catch {
    return null
  }
}

async function detectGccInstallation(): Promise<GccInstallationInfo> {
  let platform : SupportedPlatform = 'unknown'
  if (process.platform === 'win32') {
    platform = 'win32'
  }                                                                                                       
  if (process.platform === 'darwin') {
    platform = 'darwin'
  }                                                                                                  
  if (process.platform === 'linux') {
    platform = 'linux'
  }

  const detectCompilerCommand = (await gccCommand('g++') ?? await gccCommand('gcc'))
  
  if (detectCompilerCommand) {
    return {
      compilerId: 'gcc',
      status: 'ready',
      platform,
      path: detectCompilerCommand,
      message: "GCC found."
    }
  }
  else {
    return {
      compilerId: 'gcc',
      status: 'missing',
      platform,
      path: detectCompilerCommand,
      message: "No GCC found."
    }
  }
}

export { detectGccInstallation }
