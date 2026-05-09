import { Wifi, User, LogOut, Plus, FolderPlus, ArrowLeft } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { clearAuth } from "../store/authSlice"
import { setActiveWorkspace } from "../store/fleetSlice"
import { useState } from "react"
import CreateWorkspaceModal from "./CreateWorkspaceModal"

export default function Navbar({ onStartTracking, onlyToggle, isLanding }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector(state => state.auth)
  const { activeWorkspace } = useSelector(state => state.fleet)
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false)

  const getUserName = () => {
    if (!token || token === 'null') return ""
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return "Operator";
      const payload = JSON.parse(atob(parts[1]))
      const email = payload.sub || payload.email || ""
      return email.split('@')[0] || "Operator"
    } catch (e) {
      return "Operator"
    }
  }

  const handleLogout = () => {
    dispatch(clearAuth())
    navigate('/')
  }

  if (onlyToggle) return null

  return (
    <nav className="flex items-center justify-between px-10 py-8 bg-transparent transition-all relative z-[50]">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(20,184,166,0.4)] group-hover:scale-105 transition-transform">
            <Wifi className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-black tracking-tighter text-white">SENTINEL</span>
        </Link>

        {token && activeWorkspace && (
          <button
            onClick={() => dispatch(setActiveWorkspace(null))}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Dashboard
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {token ? (
          <>
            <div className="flex items-center gap-3 mr-4">
              <button 
                onClick={onStartTracking}
                className="group relative flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white border border-primary/10 rounded-xl font-black uppercase tracking-[0.2em] text-[9px] hover:bg-black hover:text-primary hover:border-primary transition-all duration-300 shadow-[0_0_20px_rgba(20,184,166,0.05)]"
              >
                <Plus className="w-3.5 h-3.5" />
                Start Tracking
              </button>

              {!activeWorkspace && (
                <button 
                  onClick={() => setIsWorkspaceModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-2.5 bg-teal-500 text-black border border-transparent rounded-xl font-black uppercase tracking-[0.2em] text-[9px] hover:bg-black hover:text-teal-500 hover:border-teal-500 transition-colors duration-300 shadow-[0_0_20px_rgba(20,184,166,0.2)]"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  Create Workspace
                </button>
              )}
            </div>

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
          </>
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

      <CreateWorkspaceModal 
        isOpen={isWorkspaceModalOpen} 
        onClose={() => setIsWorkspaceModalOpen(false)} 
      />
    </nav>
  )
}
