import { Wifi, User, LogOut } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setToken } from "../store/authSlice"

export default function Navbar({ onlyToggle, isLanding }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector(state => state.auth)

  const getUserName = () => {
    if (!token) return ""
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const email = payload.sub || ""
      return email.split('@')[0]
    } catch (e) {
      return "Operator"
    }
  }

  const handleLogout = () => {
    dispatch(setToken(null))
    navigate('/')
  }

  if (onlyToggle) return null // Theme toggle removed as requested

  return (
    <nav className="flex items-center justify-between px-10 py-8 bg-transparent transition-all">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.4)] group-hover:scale-105 transition-transform">
          <Wifi className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="text-xl font-black tracking-tighter text-white">SENTINEL</span>
      </Link>

      <div className="flex items-center gap-4">
        {token ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
              <User className="w-4 h-4 text-primary shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
              <span className="text-xs font-black text-white uppercase tracking-[0.2em]">
                {getUserName()}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white transition-all"
              title="Terminate Session"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : isLanding && (
          <>
            <Link 
              to="/login"
              className="text-xs font-black uppercase tracking-widest text-white/70 hover:text-primary transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link 
              to="/signup"
              className="text-xs font-black uppercase tracking-widest bg-primary text-primary-foreground px-5 py-2.5 rounded-lg hover:brightness-110 transition-all shadow-[0_0_15px_rgba(20,184,166,0.2)]"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
