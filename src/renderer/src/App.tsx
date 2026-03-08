import Versions from './components/Versions'
import { IpcPing } from './components/IpcPing'
import { UserPanel } from './components/UserPanel'
import electronLogo from './assets/electron.svg'
/* TEST ONLY DELETE WHEN DONE */
import { useState } from 'react'
/* TEST ONLY DELETE WHEN DONE */

// ─── App ──────────────────────────────────────────────────────────────────────

function App(): React.JSX.Element {
  /* TEST ONLY DELETE WHEN DONE */
  const [filePath, setFilePath] = useState<string | undefined>(undefined)
  const handleFileSelect = (): void => {
    window.api.file.select().then((filePath) => {
      if (filePath) {
        setFilePath(filePath)
        console.log('Selected file:', filePath)
      } else {
        console.log('File selection was canceled.')
        setFilePath("Cancelled")
      }
    }).catch((error) => {
      console.error('Error selecting file:', error)
      setFilePath("Error")
    })
  }
  /* TEST ONLY DELETE WHEN DONE */


  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <IpcPing />
        </div>
      </div>

      <div className="p-6">
        <UserPanel />
      </div>

      {/* TEST ONLY DELETE WHEN DONE */}
      <button onClick={handleFileSelect} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200">
        Select File
      </button>

      {filePath && <p className="mt-2 text-sm text-gray-600">Selected File: {filePath}</p>}
      {/* TEST ONLY DELETE WHEN DONE */}


      <Versions />
    </>
  )
}

export default App
