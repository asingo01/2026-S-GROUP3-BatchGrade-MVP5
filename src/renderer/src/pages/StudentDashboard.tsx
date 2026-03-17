/**
 * StudentDashboard.tsx
 * 
 * Description:
 * This component represents the student-facing dashboard for the
 * BatchGrade platform. After authentication, students are directed
 * to this page where they will eventually be able to interact with
 * assignments and view grading results.
 * 
 * Planned functionality for this dashboard includes:
 *  - Viewing assigned programming exercises
 *  - Submitting code solutions
 *  - Viewing automated grading feedback
 *  - Accessing submission history
 */
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'

/**
 * StudentDashboard Component
 * 
 * Provides the primary interface for students after loggin in.
 * This page will eventually allow students to access assignments,
 * submit solutions, and review grading results.
 * 
 * @returns StudentDashboard(): React.JSX.Element
 */
function StudentDashboard(): React.JSX.Element {
  // -----------------------------------------------------------
  // Navigation Hook
  // -----------------------------------------------------------
  // Allows the component to redirect users between pages
  const navigate = useNavigate()

  return (
    <>
      {/*-----------------------------------------------------------
        Application Navigation Bar
      -----------------------------------------------------------*/}
      <NavBar />

      {/*-----------------------------------------------------------
        Dashboard Content Area
      -----------------------------------------------------------*/}
      <div style={{ padding: "8rem" }}>
        {/* Page Title */}
        <h1>Student Dashboard Page</h1>

        {/* Placeholder page description */}
        <p>This is the Student Dashboard screen.</p>

          {/*-----------------------------------------------------------
            Navigation Controls
          -----------------------------------------------------------*/}
          <div style={{ marginTop: "8rem" }}>
              {/* Return to Home page */}
              <button onClick={() => navigate("/")} style={{ marginLeft: "1rem" }}>
                  Go to home
              </button>
          </div>
      </div>

      {/*-----------------------------------------------------------
        Application Footer
      -----------------------------------------------------------*/}
      <Footer />
    </>
  )
}

export default StudentDashboard