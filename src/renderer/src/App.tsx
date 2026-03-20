/**
 * App.tsx
 *
 * Description:
 * This file defines the main application component and configures
 * the routing system for the BatchGrade platform. The routing
 * structure determines which pages component is rendered based on
 * the current URL path.
 *
 * The application uses React Router to manage navigation between
 * the following primary views:
 *  - Home (landing page)
 *  - Login
 *  - Student Dashboard
 *  - Instructor Dashboard
 *  - Grading Interface
 *
 * The routing system is wrapped in an AuthProvider to allow all
 * pages within the application to access shared authentication
 * state (login status, user information, etc.)
 */
import { HashRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Grading from './pages/Grading'
import Gradebook from './pages/Gradebook'
import StudentDashboard from './pages/StudentDashboard'
import InstructorDashboard from './pages/InstructorDashboard'
import ProtectedRoute from './components/ProtectedRoute'

/**
 * App Component
 *
 * The App component serves as the root component for the BatchGrade
 * application. It establishes global providers and configures all
 * application routes.
 *
 * Routing is implemented using React Router. Each route maps a URL
 * path to a corresponding page component located. in the /pages
 * directory
 *
 * For example:
 *    '/'   -> Home page
 *    '/login'    -> Login page
 *    '/studentdashboard'   -> Student interface
 *    '/instructordashboard'    -> Instructor interface
 *    '/grading'    -> Grading interface
 *
 * Additional routes can be added by:
 *    1. Creating a new page component inside the /page directory.
 *    2. Importing the component at the top of this file.
 *    3. Adding a corresponding <Route> element within the <Routes> block.
 *
 * @returns App(): React.JSX.Element
 */

function App(): React.JSX.Element {
  return (
    /*-----------------------------------------------------------
      Authentication Provider
        Provides global authentication state to the
        entire application
      -----------------------------------------------------------*/
    <AuthProvider>
      {/*-----------------------------------------------------------
        Router Configuration
          HashRouter is used for routing to ensure
          compatibility with static or local hosting
        -----------------------------------------------------------*/}
      <HashRouter>
        {/*-----------------------------------------------------------
          Application Routes
            Each route maps a URL path to a specific page
          -----------------------------------------------------------*/}
        <Routes>
          {/* Landing Home Page */}
          <Route path="/" element={<Home />} />
          {/* Login Page */}
          <Route path="/login" element={<Login />} />
          {/* Student Interface */}
          <Route
            path="/studentdashboard"
            element={
              <ProtectedRoute requiredRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          {/* Instructor Interface (role-protected) */}
          <Route
            path="/instructordashboard"
            element={
              <ProtectedRoute requiredRoles={['instructor']}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          {/* Grading Interface */}
          <Route path="/grading" element={<Grading />} />
          <Route path="/gradebook" element={<Gradebook />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}

export default App