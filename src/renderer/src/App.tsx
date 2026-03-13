import Versions from './components/Versions'
import { IpcPing } from './components/IpcPing'
import { UserPanel } from './components/UserPanel'
import electronLogo from './assets/electron.svg'
/* TEST ONLY DELETE WHEN DONE */
import { useState } from 'react'
/* TEST ONLY DELETE WHEN DONE */
import { HashRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Grading from "./pages/Grading"


function App(): React.JSX.Element {
  /* TEST ONLY DELETE WHEN DONE */
  const [filePath, setFilePath] = useState<string | undefined>(undefined)
  const [fileContent, setFileContent] = useState<string | undefined>(undefined)
  const handleFileSelect = (): void => {
    window.api.file
      .select()
      .then((filePath) => {
        if (filePath) {
          setFilePath(filePath)
          console.log('Selected file:', filePath)
        } else {
          console.log('File selection was canceled.')
          setFilePath('Cancelled')
        }
      })
      .catch((error) => {
        console.error('Error selecting file:', error)
        setFilePath('Error')
      })
  }

  const handleFileStringify = (): void => {
    if (!filePath) {
      console.warn('No file selected to stringify.')
      return
    }
    window.api.file
      .stringify(filePath)
      .then((content) => {
        setFileContent(content)
        console.log('File content:', content)
      })
      .catch((error) => {
        console.error('Error reading file:', error)
        setFileContent('Error')
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
// Routes work functionally by iumnporting the page to the top, and then creating the route below. What this will do is give you the ability to create
// a new .tsx inside of pages, and then you can create buttons/navigation that point from whatever page you're on to this route the route will then 
// go to the appropriate page/.tsx file. 

// note some things such as "/" is always home/root this is a design paradigm

// As far as the routes go individually, these point to the mvps that we have currently.
// login -> login/landing
// dashboard -> is the student/teacher ui (these should definitely be different routes/pages)
// grading -> is the grade book, and should also probably be separated into grading.teacher / grading.student.

      {/* TEST ONLY DELETE WHEN DONE */}
      <button
        onClick={handleFileSelect}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
      >
        Select File
      </button>

      {filePath && <p className="mt-2 text-sm text-gray-600">Selected File: {filePath}</p>}
      {fileContent && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold mb-2">File Content:</h3>
          <pre className="text-sm text-gray-700 overflow-auto">{fileContent}</pre>
        </div>
      )}
      {/* TEST ONLY DELETE WHEN DONE */}
      <button
        onClick={handleFileStringify}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
      >
        Stringify File
      </button>
      {/* TEST ONLY DELETE WHEN DONE */}

      <Versions />
    </>
function App(): React.JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/grading" element={<Grading />} />
      </Routes>
    </HashRouter>
  )
}

export default App