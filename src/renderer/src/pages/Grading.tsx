// Temporary!!! Frontend must change
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
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
    <div style={{ padding: '2rem' }}>
      <h1>Grading Page</h1>

      {errorMessage && (
        <div style={{ marginBottom: '1rem', color: 'red' }}>
          <p>{errorMessage}</p>
        </div>
      )}

      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
        <h2>GCC Detection</h2>

        {!gccStatus && !errorMessage && <p>Checking for GCC...</p>}

        {gccStatus && (
          <div>
            <p>Status: {gccStatus.status}</p>
            <p>Message: {gccStatus.message}</p>
            <p>Platform: {gccStatus.platform}</p>
            <p>Path: {gccStatus.path ?? 'Not set'}</p>
          </div>
        )}

        <div style={{ marginTop: '1rem' }}>
          <h3>Set GCC Path Manually</h3>
          <input
            type="text"
            value={manualPath}
            onChange={(e) => setManualPath(e.target.value)}
            placeholder="Enter full path to gcc or g++"
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          />
          <button onClick={handleSetManualPath}>Save GCC Path</button>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h3>Compile C++ Files</h3>
          <button onClick={handleSelectCppFiles}>Choose C++ Files</button>

          {selectedFiles.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <p>Selected Files:</p>
              {selectedFiles.map((file) => (
                <p key={file}>{file}</p>
              ))}
            </div>
          )}

          <button
            onClick={handleCompileCpp}
            disabled={isCompiling || selectedFiles.length === 0}
            style={{ marginTop: '0.5rem' }}
          >
            {isCompiling ? 'Compiling...' : 'Compile'}
          </button>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h3>Run Program</h3>
          <textarea
            value={stdinText}
            onChange={(e) => setStdinText(e.target.value)}
            placeholder="Optional program input"
            style={{ width: '100%', minHeight: '120px', marginTop: '0.5rem', padding: '0.5rem' }}
          />
          <button
            onClick={handleRunProgram}
            disabled={isRunning || !compileResult?.compileSuccess || !compileResult.executablePath}
            style={{ marginTop: '0.5rem' }}
          >
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>

        {compileResult && (
          <div style={{ marginTop: '1rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
            <h3>Compile Result</h3>
            <p>Message: {compileResult.message}</p>
            <p>Compile Success: {compileResult.compileSuccess ? 'Yes' : 'No'}</p>
            <p>Compiler: {compileResult.compilerPath ?? 'Not available'}</p>
            <p>Executable: {compileResult.executablePath ?? 'Not created'}</p>

            <h4>Compile Standard Output</h4>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {compileResult.stdout || 'No stdout output.'}
            </pre>

            <h4>Compile Standard Error</h4>
            <pre style={{ whiteSpace: 'pre-wrap' }}>
              {compileResult.stderr || 'No stderr output.'}
            </pre>
          </div>
        )}

        {runResult && (
          <div style={{ marginTop: '1rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
            <h3>Run Result</h3>
            <p>Message: {runResult.message}</p>
            <p>Execution Success: {runResult.executionSuccess ? 'Yes' : 'No'}</p>
            <p>Timed Out: {runResult.timedOut ? 'Yes' : 'No'}</p>

            <h4>Program Standard Output</h4>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{runResult.stdout || 'No stdout output.'}</pre>

            <h4>Program Standard Error</h4>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{runResult.stderr || 'No stderr output.'}</pre>
          </div>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <button onClick={() => navigate('/')} style={{ marginLeft: '1rem' }}>
          Go to home
        </button>
      </div>
    </div>
  )
}

export default Grading
