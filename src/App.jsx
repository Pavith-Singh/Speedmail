import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Signin from "./Signin"
import Register from "./register"
import Home from "./Home"
import Dashboard from "./dashboard"

// Im stupid, I don't know how to use react-router-dom
// I don't know how to use react-router-dom
// I don't know how to use react-router-dom
// I don't know how to use react-router-dom

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App

