/**
 * Login.tsx
 *
 * Description:
 * This component implements the login interface for the BatchGrade
 * application. Users must first select their role (student or instructor)
 * after which they are prompted to enter their email and password.
 *
 * The component performs basic validation and retrieves user records
 * from the backend through the Electron IPC API. If a valid user is
 * found, the authentication state is updated via the AuthenContext and
 * the user is redirected to the appropriate dashboard.
 *
 * Primary Responsibilities:
 *  - Allow the user to select their login role
 *  - Collect login credentials (email and password)
 *  - Validate the login attempt
 *  - Authenticate the user through AuthContext
 *  - Redirect the user to the correct dashboard
 */
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { User } from '../../../shared/types'
import { useAuth } from '../components/AuthContext'

/**
 * Login Component
 *
 * Provides the login interface and authentication logic
 * for users attempting to access the BatchGrade Platform
 *
 * @returns Login(): React.JSX.Element
 */
function Login(): React.JSX.Element {
  // -----------------------------------------------------------
  // Navigation Hook
  // -----------------------------------------------------------
  // React Router navigation hook for redirecting users
  const navigate = useNavigate()

  // Access login function from global authentication context
  const { login } = useAuth()

  // -----------------------------------------------------------
  // Component State
  // -----------------------------------------------------------
  // Tracks which role the user selects during login
  const [role, setRole] = useState<'student' | 'instructor' | null>(null)

  // Stores user credential input
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Stores login error messages
  const [error, setError] = useState<string | null>(null)

  // -----------------------------------------------------------
  // Login Handler
  // -----------------------------------------------------------
  /**
   * Handles the login attempt by validating credentials
   * and retrieving user records from the backend
   */
  async function handleLogin(): Promise<void> {
    // Reset any previous error state
    setError(null)

    // Retrieve all registered users from backend
    const users: User[] = await window.api.users.getAll()

    // Attempt to find a user with a matching email
    const foundUser = users.find((user) => user.email === email)

    // If no matching user exists, display error
    if (!foundUser) {
      setError('User does not exist')
      return
    }

    // Basic password validation
    // (actual password verification assumed to occur on backend)
    if (password.length === 0) {
      setError('Password required')
      return
    }

    // -----------------------------------------------------------
    // Successful Login
    // -----------------------------------------------------------

    // Update global authentication state with role from database
    login(email, foundUser.role)

    // Redirect user based on role from database
    if (foundUser.role === 'student') {
      navigate('/studentdashboard')
    } else if (foundUser.role === 'instructor') {
      navigate('/instructordashboard')
    }
  }

  // -----------------------------------------------------------
  // Render Login Interface
  // -----------------------------------------------------------

  return (
    <div className="login-container">
      {/*-----------------------------------------------------------
        Login Header
      -----------------------------------------------------------*/}
      <div className="login-title">
        <header className="header">
          <h1 className="title">
            <span className="react" style={{ marginLeft: '48%' }}>
              Login
            </span>
          </h1>
          <p className="creator" style={{ marginLeft: '25%' }}>
            Please select approriate role:
          </p>
        </header>
      </div>

      <div className="login-item">
        {/*-----------------------------------------------------------
          Role Selection Screen
            Displayed before login credentials are entered
          -----------------------------------------------------------*/}
        {!role && (
          <main className="main">
            <div className="home-buttons">
              {/* Student login selection */}
              <button className="role-buttons student" onClick={() => setRole('student')}>
                Student Login
              </button>

              {/* Instructor login selection */}
              <button
                className="role-buttons instructor"
                onClick={() => setRole('instructor')}
                style={{ padding: '2rem' }}
              >
                Instructor Login
              </button>

              {/* Return to home page */}
              <button className="secondary-button" onClick={() => navigate('/')}>
                Go Home
              </button>
            </div>
          </main>
        )}

        {/*-----------------------------------------------------------
            Credential Input Form
              Displayed after role selection
            -----------------------------------------------------------*/}
        {role && (
          <div className="login-modal">
            <div className="login-form">
              {/* Dynamic title based on selected role */}
              <h2>{role === 'student' ? 'Student Login' : 'Instructor Login'}</h2>

              {/* Email input */}
              <input
                type="text"
                placeholder="Email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              {/* Password input */}
              <input
                type="password"
                placeholder="Password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Display login error message if present */}
              {error && <div className="login-error">{error}</div>}

              {/*-----------------------------------------------------------
                  Login Action Buttons
                -----------------------------------------------------------*/}
              <div className="login-actions">
                {/* Submit login reques */}
                <button
                  className="submit-button"
                  onClick={handleLogin}
                  style={{ paddingRight: '2rem' }}
                >
                  Login
                </button>

                {/* Cancel login and reset form */}
                <button
                  className="cancel-button"
                  onClick={() => {
                    setRole(null)
                    setEmail('')
                    setPassword('')
                    setError(null)
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
