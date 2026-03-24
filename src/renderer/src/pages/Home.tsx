/**
 * Homes.tsx
 *
 * Description:
 * This component serves as the main landing page for BatchGrade.
 * It provides navigation to the major system interfaces (Student Dashboard,
 * Instructor Dashboard, and Grading) while also presenting a brief overview
 * of the platform
 *
 * The page layout consists of:
 *  - A navigation bar
 *  - A hero section containing navigation buttons and system actions
 *  - An informational 'About' section describing the project
 *  - A footer
 */
import { IpcPing } from '../components/IpcPing'
import { UserPanel } from '../components/UserPanel'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'

/**
 * Home Component
 *
 * The Home component renders the primary landing page interface
 * and provides navigation to key areas of the BatchGrade system
 *
 * @returns Home(): React.JSX.Element
 */
function Home(): React.JSX.Element {
  return (
    <>
      {/*-----------------------------------------------------------
        Navigation Bar
        -----------------------------------------------------------*/}
      <NavBar />

      {/*-----------------------------------------------------------
        Hero Section
          Main landing content and navigation controls
        -----------------------------------------------------------*/}
      <div className="hero-container">
        {/* Spacer element used for layout alignment */}
        <div className="hero-item">
          {/* Application Title */}
          <header className="header">
            <h1 className="title">BatchGrade</h1>
            <p className="subtitle">Automated Grading System</p>
          </header>

          {/*-----------------------------------------------------------
            System Actions
              Used for development/testing utilities
            -----------------------------------------------------------*/}
          <div className="actions">
            <div className="action">
              <IpcPing />
            </div>
          </div>
        </div>

        <div className="hero-item">
          <header className="header">
            <h1 className="title signup">Sign Up</h1>
            <p>Register & Connect with BatchGrade.</p>
          </header>

          {/*-----------------------------------------------------------
            User Information Panel
              Displays current authenticated user data
            -----------------------------------------------------------*/}
          <div className="p-6">
            <UserPanel />
          </div>
        </div>
      </div>

      {/*-----------------------------------------------------------
        Page Footer
        -----------------------------------------------------------*/}
      <Footer />
    </>
  )
}

export default Home
