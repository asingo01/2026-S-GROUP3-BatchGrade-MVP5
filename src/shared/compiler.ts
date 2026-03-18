export type SupportedPlatform = 'win32' | 'darwin' | 'linux' | 'unknown' // TODO: Provide AI assistance citation here - https://chatgpt.com/share/69ba4ac0-5164-800e-a5a5-a253a4ee6de0

export type GccInstallationInfo = {
  compilerId: 'gcc'
  status: 'ready' | 'missing'
  platform: SupportedPlatform
  path: string | null
  // compilationMessage: 'success' | 'failed'
  // TODO: Revalidate the location/prompt to install
  message: string
  installInstruction: string | null// the user is prompted to install with instructions for their OS if they don't have a compiler installed
}
