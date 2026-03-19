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
import { useNavigate } from 'react-router-dom'
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
  // -----------------------------------------------------------
  // Navigation Hook
  // -----------------------------------------------------------
  // Allows programmatic navigation between application routes
  const navigate = useNavigate()

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
        <div className="hero-item"></div>

        <div className="hero-item">
          {/* Application Title */}
          <header className="header">
            <h1 className="title" style={{ marginLeft: '42%' }}>
              <span className="react">BatchGrade</span>
            </h1>
            <p className="creator" style={{ marginLeft: '33%' }}>
              Automated Grading System
            </p>
          </header>

          {/*-----------------------------------------------------------
            Navigation Buttons
              Provide quick access to major system interfaces
            -----------------------------------------------------------*/}
          <div className="test-buttons" style={{ marginLeft: '6rem' }}>
            {/* Test navigate to Student Dashboard */}
            <button className="secondary-button" onClick={() => navigate('/studentdashboard')}>
              Student Dashboard
            </button>

            {/* Test navigate to Grading Interface */}
            <button
              className="secondary-button"
              onClick={() => navigate('/grading')}
              style={{ margin: '2rem' }}
            >
              Grading
            </button>

            {/* Test navigate to Instructor Dashboard */}
            <button className="secondary-button" onClick={() => navigate('/instructordashboard')}>
              Instructor Dashboard
            </button>
          </div>

          {/*-----------------------------------------------------------
            System Actions
              Used for development/testing utilities
            -----------------------------------------------------------*/}
          <div className="actions">
            <div className="action" style={{ marginLeft: '40%' }}>
              <IpcPing />
            </div>
          </div>

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
        About Section
          Overview of the BatchGrade platform
        -----------------------------------------------------------*/}
      <div className="about-container">
        <h1 className="title" style={{ marginLeft: '45%' }}>
          About
        </h1>
        <p className="about-blot" style={{ padding: '0 2rem 0 2rem' }}>
          <span className="emphasis">Batchgrade</span> is a locally hosted automated grading
          platform designed to streamline the evaluation of programming assignments in academic
          environments. The system enables instructors to compile, test, and manage submissions
          through an integrated gradebook interface, while students receive consistent and
          structured feedback. Built with a modular web-based architechture and local deployment
          capability, BatchGrade eliminates reliance on costly cloud-based services. By reducing
          grading time and improving assessment reliability, the platform increases instructional
          efficiency and supports scalable computer science education.
        </p>
      </div>

      {/*-----------------------------------------------------------
        Page Footer
        -----------------------------------------------------------*/}
      <Footer />
    </>
  )
}

export default Home
