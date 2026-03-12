import { HashRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Grading from "./pages/Grading"

import Gradebook from "./pages/Gradebook"

function App(): React.JSX.Element {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/grading" element={<Grading />} />
        <Route path="/gradebook" element={<Gradebook />} />
      </Routes>
    </HashRouter>
  )
}

export default App