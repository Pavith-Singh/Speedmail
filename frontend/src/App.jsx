import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Signin from "./Signin"
import Register from "./register"
import Home from "./Home"
import Dashboard from "./dashboard"
import AdminSignin from "./AdminSignin"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/adminsignin" element={<AdminSignin />} />
      </Routes>
    </Router>
  )
}

export default App

