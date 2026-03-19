import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import { IpcPing } from '../components/IpcPing'
import NavBar from '../components/Navbar'
import { UserPanel } from '../components/UserPanel'

function Home(): React.JSX.Element {
  const navigate = useNavigate()

  return (
    <>
      <NavBar />

      <div className="hero-container">
        <div className="hero-item"></div>

        <div className="hero-item">
          <header className="header">
            <h1 className="title" style={{ marginLeft: '42%' }}>
              <span className="react">BatchGrade</span>
            </h1>
            <p className="creator" style={{ marginLeft: '33%' }}>
              Automated Grading System
            </p>
          </header>

          <div className="test-buttons" style={{ marginLeft: '6rem' }}>
            <button className="secondary-button" onClick={() => navigate('/studentdashboard')}>
              Student Dashboard
            </button>

            <button
              className="secondary-button"
              onClick={() => navigate('/grading')}
              style={{ margin: '2rem' }}
            >
              Grading
            </button>

            <button className="secondary-button" onClick={() => navigate('/instructordashboard')}>
              Instructor Dashboard
            </button>
          </div>

          <div className="actions">
            <div className="action" style={{ marginLeft: '40%' }}>
              <IpcPing />
            </div>
          </div>

          <div className="p-6">
            <UserPanel />
          </div>
        </div>
      </div>

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

      <Footer />
    </>
  )
}

export default Home
