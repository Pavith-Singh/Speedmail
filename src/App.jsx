import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Signin from "./Signin"
import Register from "./register"
import Home from "./Home"
import Dashboard from "./dashboard"



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

