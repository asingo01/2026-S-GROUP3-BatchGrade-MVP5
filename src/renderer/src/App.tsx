import { HashRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './components/AuthContext'
import Grading from './pages/Grading'
import Home from './pages/Home'
import Login from './pages/Login'
import Gradebook from './pages/Gradebook'
import StudentDashboard from './pages/StudentDashboard'
import InstructorDashboard from './pages/InstructorDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import StudentUploadInterface from './pages/studentUploadInterface'
import { STUDENT_ROLE, INSTRUCTOR_ROLE } from '../../main/database/schema'

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
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/studentdashboard"
            element={
              <ProtectedRoute requiredRoles={[STUDENT_ROLE]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/instructordashboard"
            element={
              <ProtectedRoute requiredRoles={[INSTRUCTOR_ROLE]}>
                <InstructorDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/grading" element={<Grading />} />

          <Route 
            path="/studentUploadInterface" 
            element={
            <ProtectedRoute requiredRoles={[STUDENT_ROLE]}>
              <StudentUploadInterface /> 
            </ProtectedRoute>
            }
            />
          <Route path="/gradebook" element={<Gradebook />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  )
}

export default App
