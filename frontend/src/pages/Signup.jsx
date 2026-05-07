import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'

const Signup = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
    <AuthLayout isLogin={false}>
      {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" />{error}</div>}
      {success && <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />{success}</div>}

      <form id="signup-form" onSubmit={handleSignup} method="POST" className="space-y-3 relative z-10">
        <div className="space-y-2">
          <label htmlFor="signup-email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Operator ID</label>
          <input
            id="signup-email"
            type="email"
            name="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username email"
            className="w-full px-4 py-2 rounded-xl border border-white/5 bg-black/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-white placeholder:text-white/20"
            placeholder="operator@sentinel.sys" required />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label htmlFor="signup-password" title="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Access Protocol</label>
            <div className="group relative">
              <Info className="w-4 h-4 text-primary/60 cursor-help" />
              <div className="absolute bottom-full right-0 mb-3 w-64 p-3 bg-black/95 text-white text-[10px] leading-relaxed rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none border border-primary/30 backdrop-blur-xl translate-y-2 group-hover:translate-y-0">
                <span className="text-primary font-bold">REQUIREMENT:</span> Minimum 8 characters, alphanumeric sequence required.
              </div>
            </div>
          </div>
          <input
            id="signup-password"
            type="password"
            name="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full px-4 py-2 rounded-xl border border-white/5 bg-black/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-white placeholder:text-white/20"
            placeholder="••••••••" required />
        </div>
        <div className="space-y-2">
          <label htmlFor="signup-confirm-password" title="confirm-password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Confirm Protocol</label>
          <input
            id="signup-confirm-password"
            type="password"
            name="confirm-password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            className="w-full px-4 py-2 rounded-xl border border-white/5 bg-black/40 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all text-white placeholder:text-white/20"
            placeholder="••••••••" required />
        </div>
        <button type="submit" className="w-full py-3.5 bg-primary text-primary-foreground rounded-xl font-black uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all mt-4 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
          Create Identity
        </button>
      </form>
    </AuthLayout>
  )
}

export default Signup
