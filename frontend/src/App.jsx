import { useDispatch, useSelector } from 'react-redux'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector(state => state.auth)
  if (!token) return <Navigate to="/login" replace />
  return children
}

function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
