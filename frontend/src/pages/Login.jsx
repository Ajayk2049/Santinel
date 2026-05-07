import { useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setToken } from '../store/authSlice'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

  return (
    <AuthLayout isLogin={true}>
      {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}
      {success && <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />{success}</div>}

      <form id="login-form" onSubmit={handleLogin} method="POST" className="space-y-3 relative z-10">
        <div className="space-y-2">
          <label htmlFor="login-email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Operator ID</label>
          <input
            id="login-email"
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
            <label htmlFor="login-password" title="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Access Protocol</label>
          </div>
          <input
            id="login-password"
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-white placeholder:text-white/20"
            placeholder="••••••••" required />
        </div>
        <button type="submit" className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-black uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all mt-4 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
          Initiate Session
        </button>
      </form>
    </AuthLayout>
  )
}

export default Login
