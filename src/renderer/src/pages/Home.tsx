import Footer from '../components/Footer'
import { IpcPing } from '../components/IpcPing'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

function Home(): React.JSX.Element {
  const navigate = useNavigate();
  return (
    <>
      <NavBar />

      <div className="hero-container">
        <div className="hero-item">
          <header className="header">
            <h1 className="title">
              <span className="react">BatchGrade</span>
            </h1>
            <p className="creator">Automated Grading System</p>
          </header>
        </div>

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

            <button className="secondary-button" onClick={() => navigate('/studentUploadInterface')}>
               SUI
            </button>
          </div>
        <div className="hero-item">
          <header className="header">
            <h1 className="title signup">Sign Up</h1>
            <p>Register & Connect with BatchGrade.</p>
          </header>

          <div className="actions">
            <div className="action">
              <IpcPing />
            </div>
          </div>

          <div className="p-6">
            <UserPanel />
          </div>
        </div>
      </div>

      <div className="about-container">
        <h1 className="title about">About</h1>
        <p className="about-blot">
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

      <Footer />
    </>
  )
}

export default Home
