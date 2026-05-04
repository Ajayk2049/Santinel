import { useState, useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setToken } from './store/authSlice'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import { AlertCircle, CheckCircle2, Info, ArrowLeft, Wifi } from 'lucide-react'
import { motion } from 'framer-motion'
import DarkVeil from './components/DarkVeil'
import './components/DarkVeil.css'
import Home from './pages/Home'
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector(state => state.auth)
  if (!token) return <Navigate to="/login" replace />
  return children
}

function AppContent() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = useSelector(state => state.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await axios.post('http://localhost:5500/api/auth/login', { email, password })
      dispatch(setToken(res.data.token))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.')
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    try {
      await axios.post('http://localhost:5500/api/auth/signup', { email, password })
      setSuccess('Registration successful! You can now sign in.')
      setConfirmPassword('')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Check requirements.')
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      
      <Route path="/login" element={
        <AuthWrapper isLogin={true} error={error} success={success} email={email} password={password} 
          setEmail={setEmail} setPassword={setPassword} handleSubmit={handleLogin} />
      } />
      
      <Route path="/signup" element={
        <AuthWrapper isLogin={false} error={error} success={success} email={email} password={password} 
          confirmPassword={confirmPassword} setEmail={setEmail} setPassword={setPassword} 
          setConfirmPassword={setConfirmPassword} handleSubmit={handleSignup} />
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main><Dashboard /></main>
          </div>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

const AuthWrapper = ({ isLogin, error, success, email, password, confirmPassword, setEmail, setPassword, setConfirmPassword, handleSubmit }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <DarkVeil hueShift={50} noiseIntensity={0.03} scanlineIntensity={0} speed={0.4} warpAmount={0.4} />
      </div>
      
      <div className="absolute top-6 left-6 z-20">
        <Link to="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-all bg-background/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 hover:border-primary/50 shadow-lg">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <div className="absolute top-6 right-6 z-20">
         <Navbar onlyToggle />
      </div>
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-card/40 backdrop-blur-2xl shadow-2xl z-10 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl transition-colors" />
        
        <div className="flex flex-col items-center mb-8 relative z-10">
          <Link to="/" className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:scale-105 transition-transform">
            <Wifi className="w-8 h-8 text-primary-foreground" />
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-white">
            {isLogin ? 'MISSION CONTROL' : 'JOIN THE FLEET'}
          </h1>
          <p className="text-muted-foreground text-center mt-2 text-sm max-w-[280px]">
            {isLogin 
              ? 'Authorized access required. Identify your credentials to proceed.' 
              : 'Protocol initiation. Create your unique operator identity.'}
          </p>
        </div>

        {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}
        {success && <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />{success}</div>}

        <form onSubmit={handleSubmit} method="POST" action="#" className="space-y-5 relative z-10">
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Operator ID</label>
            <input 
              id="email"
              type="email" 
              name="email"
              value={email} 
              onChange={e => setEmail(e.target.value)}
              autoComplete="username email"
              className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-white placeholder:text-white/20"
              placeholder="operator@sentinel.sys" required />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label htmlFor="password" title="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Access Protocol</label>
              {!isLogin && (
                <div className="group relative">
                  <Info className="w-4 h-4 text-primary/60 cursor-help" />
                  <div className="absolute bottom-full right-0 mb-3 w-64 p-3 bg-black/95 text-white text-[10px] leading-relaxed rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none border border-primary/30 backdrop-blur-xl translate-y-2 group-hover:translate-y-0">
                    <span className="text-primary font-bold">REQUIREMENT:</span> Minimum 8 characters, alphanumeric sequence required.
                  </div>
                </div>
              )}
            </div>
            <input 
              id="password"
              type="password" 
              name="password"
              value={password} 
              onChange={e => setPassword(e.target.value)}
              autoComplete={isLogin ? "current-password" : "new-password"}
              className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-white placeholder:text-white/20"
              placeholder="••••••••" required />
          </div>
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="confirm-password" title="confirm-password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Confirm Protocol</label>
              <input 
                id="confirm-password"
                type="password" 
                name="confirm-password"
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-white placeholder:text-white/20"
                placeholder="••••••••" required />
            </div>
          )}
          <button type="submit" className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-black uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all mt-4 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
            {isLogin ? 'Initiate Session' : 'Create Identity'}
          </button>
        </form>

        <div className="mt-8 text-center text-xs">
          <span className="text-muted-foreground font-medium">{isLogin ? "New operator detected? " : "Operational already? "}</span>
          <Link to={isLogin ? "/signup" : "/login"} className="text-primary font-bold hover:underline underline-offset-4 decoration-primary/30">
            {isLogin ? 'Request Access' : 'Sign In'}
          </Link>
        </div>
      </motion.div>
    </div>
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
