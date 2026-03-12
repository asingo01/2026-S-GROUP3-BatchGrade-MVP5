import { useNavigate } from "react-router-dom"
import Versions from '../components/Versions'
import { IpcPing } from '../components/IpcPing'
import { UserPanel } from '../components/UserPanel'
import electronLogo from '../assets/electron.svg'

function Home(): React.JSX.Element {
  const navigate = useNavigate()

  return (
    <>
      {/* ── Original homescreen header ── */}
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>

      {/* ── Navigation Buttons ── */}
      <div style={{ marginTop: "2rem" }}>
        <button onClick={() => navigate("/login")}>
          Go to Login
        </button>

        <button onClick={() => navigate("/dashboard")} style={{ marginLeft: "1rem" }}>
          Go to Dashboard
        </button>

        <button onClick={() => navigate("/grading")} style={{ marginLeft: "1rem" }}>
          Go to Grading
        </button>

        {/* Gradebook Button */}
        <button onClick={() => navigate('/gradebook')} style={{ marginLeft: '1rem' }}>
          Go to Gradebook
        </button>
      </div>

      <div className="actions">
        <div className="action">
          <IpcPing />
        </div>
      </div>

      <div className="p-6">
        <UserPanel />
      </div>

      <Versions />
    </>
  )
}

export default Home