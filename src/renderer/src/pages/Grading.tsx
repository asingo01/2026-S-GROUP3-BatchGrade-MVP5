import { useNavigate } from "react-router-dom"

function Grading(): React.JSX.Element {
    const navigate = useNavigate()

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Grading Page</h1>
      <p>This is the Grading screen.</p>

    <div style={{ marginTop: "2rem" }}>
        <button onClick={() => navigate("/")} style={{ marginLeft: "1rem" }}>
            Go to home
        </button>
    </div>

    </div>
  )
}

export default Grading