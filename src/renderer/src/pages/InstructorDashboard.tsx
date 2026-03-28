/**
 * InstructorDashboard.tsx
 *
 * Description:
 * This component represents the instructor-facing dashboard within
 * the BatchGrade platform. The dashboard serves as the primary
 * interface for instructors once they have successfully logged in.
 *
 * In its current state, the component functions as a placeholder
 * view that demonstrates navigation flow and page structure.
 * Future development will include instructor-specific tools sush as:
 *  - Assignment management
 *  - Automated grading controls
 *  - Student submission review
 *  - Gradebook access
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import AssignmentConfigPanel from '../components/AssignmentConfigPanel'

/**
 * @brief Renders the instructor dashboard page.
 *
 * @details
 * This component provides the instructor dashboard interface after
 * authentication. For MVP-5, it includes a button that opens the
 * assignment configuration workflow so instructors can begin creating
 * and managing assignments.
 *
 * @return React JSX element for the instructor dashboard page.
 */
function InstructorDashboard(): React.JSX.Element {
  /**
   * @brief React Router navigation hook.
   *
   * @details
   * Used for programmatic navigation back to the home page.
   */
  const navigate = useNavigate()

  /**
   * @brief Controls whether the assignment configuration panel is visible.
   *
   * @details
   * When true, the AssignmentConfigPanel is rendered on the dashboard.
   * This supports UC9 by giving instructors an entry point into the
   * assignment creation workflow.
   */
  const [showAssignmentConfig, setShowAssignmentConfig] = useState(false)

  /**
   * @brief Opens the assignment configuration panel.
   *
   * @return Nothing.
   */
  function openAssignmentConfig(): void {
    setShowAssignmentConfig(true)
  }

  /**
   * @brief Closes the assignment configuration panel.
   *
   * @return Nothing.
   */
  function closeAssignmentConfig(): void {
    setShowAssignmentConfig(false)
  }

  return (
    <>
      {/*-----------------------------------------------------------
        Application Navigation Bar
      -----------------------------------------------------------*/}
      <NavBar />

      {/*-----------------------------------------------------------
        Dashboard Content Area
      -----------------------------------------------------------*/}
      <div style={{ padding: '4rem 8rem' }}>
        {/* Page Title */}
        <h1>Instructor Dashboard</h1>

        {/* Dashboard description */}
        <p>
          Manage instructor tools, configure assignments, and review grading
          workflows from this dashboard.
        </p>

        {/*-----------------------------------------------------------
          Instructor Actions
        -----------------------------------------------------------*/}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
          <button onClick={openAssignmentConfig}>
            Assignment Creation
          </button>

          <button onClick={() => navigate('/')}>
            Go to home
          </button>
        </div>

        {/*-----------------------------------------------------------
          Assignment Configuration Area
        -----------------------------------------------------------*/}
        {showAssignmentConfig && (
          <div style={{ marginTop: '2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <button onClick={closeAssignmentConfig}>
                Close Assignment Configuration
              </button>
            </div>

            <AssignmentConfigPanel />
          </div>
        )}
      </div>

      {/*-----------------------------------------------------------
        Application Footer
      -----------------------------------------------------------*/}
      <Footer />
    </>
  )
}

export default InstructorDashboard
