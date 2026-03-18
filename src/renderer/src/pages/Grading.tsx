import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { GccInstallationInfo } from '../../../shared/compiler'

function Grading(): React.JSX.Element {
  const navigate = useNavigate()

  const [gccStatus, setGccStatus] = useState<GccInstallationInfo | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
      <p>This is the Grading screen.</p>

      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
        <h2>GCC Detection</h2>

        {errorMessage && <p>{errorMessage}</p>}

        {!gccStatus && !errorMessage && <p>Checking for GCC...</p>}

        {gccStatus && (
          <div>
            <p>Status: {gccStatus.status}</p>
            <p>Message: {gccStatus.message}</p>
            <p>Platform: {gccStatus.platform}</p>
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
