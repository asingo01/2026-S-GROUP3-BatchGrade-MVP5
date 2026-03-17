/**
 * Navbar.tsx
 *
 * Description:
 * This component implements the primary navigation bar used
 * throughout the BatchGrade application. It provides quick
 * access to login functionality and display the current
 * authentication state of the user.
 *
 * If the user is logged in, a profile avatar is displayed
 * which currently functions as a logout trigger. If the
 * user is not logged in, a login button is shown instead.
 */
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'
import avatar from '../assets/electron.svg'

/**
 * Navbar Component
 *
 * Displays the application's navigation header and manages
 * authentication-related UI elements
 *
 * @returns NavBar(): React.JSX.Element
 */
function NavBar(): React.JSX.Element {
  // -----------------------------------------------------------
  // Navigation Hook
  // -----------------------------------------------------------
  // Enables navigation between application routes
  const navigate = useNavigate()
  // Access authentication state and logout function
  const { isLoggedIn, logout } = useAuth()

  return (
    <nav className="navbar">
      {/* Application Title */}
      <span className="navbar-title">BatchGrade</span>

      {/*-----------------------------------------------------------
        Authentication Controls
      -----------------------------------------------------------*/}
      {isLoggedIn ? (
        /* Logged-in State:
            Display user avater which currently triggers logout
            when clicked. Future implementations may include
            a dropdown profile menu */
        <img
          src={avatar}
          alt="Profile"
          className="profile-image"
          onClick={() => {
            // Log the user out of the application
            logout()
            // Redirect user to the Home page
            navigate('/')
          }}
        />
      ) : (
        /* Logged-Out State:
            Display login button */
        <button
          className="primary-button"
          onClick={() => navigate('/login')}
          style={{ paddingLeft: '50vw' }}
        >
          Login
        </button>
      )}

      {/*-----------------------------------------------------------
      Application Footer
    -----------------------------------------------------------*/}
    </nav>
  )
}

export default NavBar
