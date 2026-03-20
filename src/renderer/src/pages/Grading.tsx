import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import NavBar from '../components/Navbar'
import { CppWorkflowPanel } from '../components/CppWorkflowPanel'

function Grading(): React.JSX.Element {
  const navigate = useNavigate()

  return (
    <>
      <NavBar />

      <div style={{ padding: '8rem', paddingTop: '10rem' }}>
        <h1>Grading Page</h1>
        <p>
          Instructor workflow for compiling and running submissions. Execution remains a separate
          step so it can move behind a sandbox boundary later.
        </p>

        <CppWorkflowPanel
          title="Instructor Compilation Workspace"
          description="Compile selected C++ files and optionally run the compiled program for grading checks."
          allowExecution={true}
        />

        <button
          onClick={() => navigate('/')}
          style={{
            padding: '9px 14px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: '2px solid #93c5fd',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Go to home
        </button>
      </div>

      <Footer />
    </>
  )
}

export default Grading
