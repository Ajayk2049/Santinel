import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Wifi } from 'lucide-react'
import DarkVeil from './DarkVeil'
import Navbar from './Navbar'
import './DarkVeil.css'

const AuthLayout = ({ children, isLogin }) => {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-background p-4 relative overflow-hidden">
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

      <div className="relative z-10 w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="w-full p-6 rounded-2xl border border-white/10 bg-card/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden max-h-[85vh] overflow-y-auto scrollbar-hide">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl transition-colors" />

          <div className="flex flex-col items-center mb-6 relative z-10">
            <div className="flex items-center gap-2">
              <Link to="/" className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:scale-105 transition-transform">
                <Wifi className="w-5 h-5 text-primary-foreground" />
              </Link>
              <h1 className="text-sm font-black tracking-tight text-white">
                {isLogin ? 'MISSION CONTROL' : 'JOIN THE FLEET'}
              </h1>
            </div>
            <p className="text-muted-foreground text-center mt-2 text-sm max-w-[280px]">
              {isLogin
                ? 'Authorized access required. Identify your credentials to proceed.'
                : 'Protocol initiation. Create your unique operator identity.'}
            </p>
          </div>

          {children}

          <div className="mt-8 text-center text-xs">
            <span className="text-muted-foreground font-medium">{isLogin ? "New operator detected? " : "Operational already? "}</span>
            <Link to={isLogin ? "/signup" : "/login"} className="text-primary font-bold hover:underline underline-offset-4 decoration-primary/30">
              {isLogin ? 'Request Access' : 'Sign In'}
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AuthLayout
