import { HashRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Grading from "./pages/Grading"

import Gradebook from "./pages/Gradebook"

// Routes work functionally by iumnporting the page to the top, and then creating the route below. What this will do is give you the ability to create
// a new .tsx inside of pages, and then you can create buttons/navigation that point from whatever page you're on to this route the route will then
// go to the appropriate page/.tsx file.

// note some things such as "/" is always home/root this is a design paradigm

// As far as the routes go individually, these point to the mvps that we have currently.
// login -> login/landing
// dashboard -> is the student/teacher ui (these should definitely be different routes/pages)
// grading -> is the grade book, and should also probably be separated into grading.teacher / grading.student.

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