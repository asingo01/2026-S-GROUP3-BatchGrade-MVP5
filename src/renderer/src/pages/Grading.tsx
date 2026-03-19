import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { CompileCppResult, GccInstallationInfo, RunCppResult } from '../../../shared/compiler'

function Grading(): React.JSX.Element {
  const navigate = useNavigate()

  const [gccStatus, setGccStatus] = useState<GccInstallationInfo | null>(null)
  const [compileResult, setCompileResult] = useState<CompileCppResult | null>(null)
  const [runResult, setRunResult] = useState<RunCppResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [manualPath, setManualPath] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [stdinText, setStdinText] = useState('')
  const [isCompiling, setIsCompiling] = useState(false)
  const [isRunning, setIsRunning] = useState(false)

  function handleSetManualPath(): void {
    window.api.compiler
      .setGccPath(manualPath)
      .then((result) => {
        setGccStatus(result)
        setErrorMessage(null)
      })
      .catch((error) => {
        console.error('Error setting GCC path:', error)
        setErrorMessage('Could not save manual GCC path.')
      })
  }

  function handleSelectCppFiles(): void {
    window.api.file
      .selectCppFiles()
      .then((files) => {
        setSelectedFiles(files)
        setCompileResult(null)
        setRunResult(null)
        setErrorMessage(null)
      })
      .catch((error) => {
        console.error('Error selecting C++ files:', error)
        setErrorMessage('Could not select C++ files.')
      })
  }

  function handleCompileCpp(): void {
    setIsCompiling(true)
    setErrorMessage(null)
    setCompileResult(null)
    setRunResult(null)

    window.api.compiler
      .compileCpp({
        sourceFiles: selectedFiles
      })
      .then((result) => {
        setCompileResult(result)
      })
      .catch((error) => {
        console.error('Error compiling C++ files:', error)
        setErrorMessage('Could not compile the selected files.')
      })
      .finally(() => {
        setIsCompiling(false)
      })
  }

  function handleRunProgram(): void {
    if (!compileResult?.executablePath) {
      setErrorMessage('Compile the program first.')
      return
    }

    setIsRunning(true)
    setErrorMessage(null)
    setRunResult(null)

    window.api.compiler
      .runCompiledProgram({
        executablePath: compileResult.executablePath,
        stdin: stdinText,
        timeoutMs: 5000
      })
      .then((result) => {
        setRunResult(result)
      })
      .catch((error) => {
        console.error('Error running compiled program:', error)
        setErrorMessage('Could not run the compiled program.')
      })
      .finally(() => {
        setIsRunning(false)
      })
  }

  useEffect(() => {
    window.api.compiler
      .getGccStatus()
      .then((result) => {
        setGccStatus(result)
      })
      .catch((error) => {
        console.error('Error getting GCC status:', error)
        setErrorMessage('Could not load GCC status.')
      })
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '20px',
        paddingBottom: '40px',
        backgroundColor: 'transparent',
        color: 'white'
      }}
    >
      <div style={{ maxWidth: '1180px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '6px', fontSize: '28px' }}>Grading Page</h1>
        <p style={{ marginBottom: '12px', fontSize: '14px' }}>
          This page is for checking gcc, compiling C++ files, and running the program.
        </p>

        {errorMessage && (
          <div
            style={{
              backgroundColor: '#5a1f1f',
              border: '1px solid red',
              padding: '10px',
              marginBottom: '12px'
            }}
          >
            <p>{errorMessage}</p>
          </div>
        )}

        <div
          style={{
            border: '1px solid gray',
            padding: '12px',
            marginBottom: '12px',
            backgroundColor: '#2b2b2b'
          }}
        >
          <h2 style={{ marginBottom: '8px', fontSize: '20px' }}>GCC Detection</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.1fr 1.2fr',
              gap: '14px',
              alignItems: 'start'
            }}
          >
            <div>
              {!gccStatus && !errorMessage && <p>Checking for GCC...</p>}

              {gccStatus && (
                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                  <p>Status: {gccStatus.status}</p>
                  <p>Message: {gccStatus.message}</p>
                  <p>Platform: {gccStatus.platform}</p>
                  <p>Path: {gccStatus.path ?? 'Not set'}</p>
                </div>
              )}
            </div>

            <div>
              <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>Set GCC Path Manually</h3>
              <input
                type="text"
                value={manualPath}
                onChange={(e) => setManualPath(e.target.value)}
                placeholder="Enter full path to gcc or g++"
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '8px',
                  backgroundColor: '#111',
                  color: 'white',
                  border: '1px solid #6b7280'
                }}
              />
              <button
                onClick={handleSetManualPath}
                style={{
                  padding: '9px 14px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: '2px solid #93c5fd',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Save GCC Path
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '12px'
          }}
        >
          <div
            style={{
              border: '1px solid gray',
              padding: '12px',
              backgroundColor: '#2b2b2b',
              alignSelf: 'start'
            }}
          >
            <h2 style={{ marginBottom: '10px', fontSize: '20px' }}>Compile C++ Files</h2>

            <button
              onClick={handleSelectCppFiles}
              style={{
                padding: '9px 14px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: '2px solid #93c5fd',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Choose C++ Files
            </button>

            {selectedFiles.length > 0 && (
              <div style={{ marginTop: '10px', fontSize: '14px' }}>
                <p>Selected Files:</p>
                <ul
                  style={{
                    paddingLeft: '20px',
                    marginTop: '6px',
                    maxHeight: '100px',
                    overflowY: 'auto'
                  }}
                >
                  {selectedFiles.map((file) => (
                    <li key={file} style={{ marginBottom: '6px', overflowWrap: 'anywhere' }}>
                      {file}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={handleCompileCpp}
              disabled={isCompiling || selectedFiles.length === 0}
              style={{
                padding: '9px 14px',
                marginTop: '10px',
                backgroundColor: isCompiling || selectedFiles.length === 0 ? '#4b5563' : '#f59e0b',
                color: 'white',
                border: '2px solid #fde68a',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: isCompiling || selectedFiles.length === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              {isCompiling ? 'Compiling...' : 'Compile'}
            </button>

            {compileResult && (
              <div style={{ marginTop: '12px', borderTop: '1px solid gray', paddingTop: '10px' }}>
                <h3 style={{ fontSize: '17px' }}>Compile Result</h3>
                <div style={{ fontSize: '14px', lineHeight: '1.45' }}>
                  <p>Message: {compileResult.message}</p>
                  <p>Compile Success: {compileResult.compileSuccess ? 'Yes' : 'No'}</p>
                  <p>Compiler: {compileResult.compilerPath ?? 'Not available'}</p>
                  <p>Executable: {compileResult.executablePath ?? 'Not created'}</p>
                </div>

                <h4 style={{ marginTop: '10px', fontSize: '15px' }}>Compile Standard Output</h4>
                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                    backgroundColor: '#111',
                    padding: '8px',
                    border: '1px solid gray',
                    marginTop: '6px',
                    maxHeight: '120px',
                    overflowY: 'auto',
                    fontSize: '12px'
                  }}
                >
                  {compileResult.stdout || 'No stdout output.'}
                </pre>

                <h4 style={{ marginTop: '10px', fontSize: '15px' }}>Compile Standard Error</h4>
                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                    backgroundColor: '#111',
                    padding: '8px',
                    border: '1px solid gray',
                    marginTop: '6px',
                    maxHeight: '120px',
                    overflowY: 'auto',
                    fontSize: '12px'
                  }}
                >
                  {compileResult.stderr || 'No stderr output.'}
                </pre>
              </div>
            )}
          </div>

          <div
            style={{
              border: '1px solid gray',
              padding: '12px',
              backgroundColor: '#2b2b2b',
              alignSelf: 'start'
            }}
          >
            <h2 style={{ marginBottom: '10px', fontSize: '20px' }}>Run Program</h2>

            <textarea
              value={stdinText}
              onChange={(e) => setStdinText(e.target.value)}
              placeholder="Optional program input"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '8px',
                backgroundColor: '#111',
                color: 'white',
                border: '1px solid #6b7280',
                fontSize: '13px'
              }}
            />

            <button
              onClick={handleRunProgram}
              disabled={isRunning || !compileResult?.compileSuccess || !compileResult.executablePath}
              style={{
                padding: '9px 14px',
                marginTop: '10px',
                backgroundColor:
                  isRunning || !compileResult?.compileSuccess || !compileResult.executablePath
                    ? '#4b5563'
                    : '#16a34a',
                color: 'white',
                border: '2px solid #86efac',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor:
                  isRunning || !compileResult?.compileSuccess || !compileResult.executablePath
                    ? 'not-allowed'
                    : 'pointer'
              }}
            >
              {isRunning ? 'Running...' : 'Run'}
            </button>

            {runResult && (
              <div style={{ marginTop: '12px', borderTop: '1px solid gray', paddingTop: '10px' }}>
                <h3 style={{ fontSize: '17px' }}>Run Result</h3>
                <div style={{ fontSize: '14px', lineHeight: '1.45' }}>
                  <p>Message: {runResult.message}</p>
                  <p>Execution Success: {runResult.executionSuccess ? 'Yes' : 'No'}</p>
                  <p>Timed Out: {runResult.timedOut ? 'Yes' : 'No'}</p>
                </div>

                <h4 style={{ marginTop: '10px', fontSize: '15px' }}>Program Standard Output</h4>
                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                    backgroundColor: '#111',
                    padding: '8px',
                    border: '1px solid gray',
                    marginTop: '6px',
                    maxHeight: '120px',
                    overflowY: 'auto',
                    fontSize: '12px'
                  }}
                >
                  {runResult.stdout || 'No stdout output.'}
                </pre>

                <h4 style={{ marginTop: '10px', fontSize: '15px' }}>Program Standard Error</h4>
                <pre
                  style={{
                    whiteSpace: 'pre-wrap',
                    overflowWrap: 'anywhere',
                    backgroundColor: '#111',
                    padding: '8px',
                    border: '1px solid gray',
                    marginTop: '6px',
                    maxHeight: '120px',
                    overflowY: 'auto',
                    fontSize: '12px'
                  }}
                >
                  {runResult.stderr || 'No stderr output.'}
                </pre>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          style={{
            padding: '9px 14px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: '2px solid #93c5fd',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Go to home
        </button>
      </div>
    </div>
  )
}

export default Grading
