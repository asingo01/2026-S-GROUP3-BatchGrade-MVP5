/**
 * StudentUploadInterface.tsx
 *
 * Description:
 * This component implements the student upload interface for the BatchGrade application.
 * It provides a simple UI for students to submit their project code files for grading.
 *
 * The interface includes:
 *  - A title indicating the purpose of the page
 *  - A button to trigger the file submission process (currently simulated with an alert)
 *  - A navigation button to return to the home page
 *
 * This component is intended to be expanded in the future to include actual file upload functionality,
 * validation, and integration with the backend grading system.
 */
import { useNavigate } from 'react-router-dom'
import { Interface_Button } from '../assets/ui/Interface_Button'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'

/**
 * StudentUploadInterface Component
 *
 * Provides the interface for students to upload their project code files
 * for grading within the BatchGrade application.
 *
 * @returns StudentUploadInterface(): React.JSX.Element
 */
export function StudentUploadInterface(): React.JSX.Element {
  const navigate = useNavigate()

  const submitFileConfirmation = (): void => {
    // This should check to see if the file has been submitted, and verified
    // will return 0 for failure, 1 for true
    alert('You have submitted the file')
  }

  return (
    <>
      <NavBar />
      <div style={{ padding: '8rem' }}>
        <h1>Student Upload Interface Page</h1>

        <div className="text-submission">
          <h1>Project Code Submission</h1>
        </div>

        <div>
          <h5>This will be a button to handle the upload once implemented </h5>
        </div>

        <Interface_Button onClick={submitFileConfirmation}>Submit Code</Interface_Button>

        <button onClick={() => navigate('/')} style={{ marginLeft: '1rem' }}>
          Go to Home
        </button>
      </div>
      <Footer />
    </>
  )
}

export default StudentUploadInterface
