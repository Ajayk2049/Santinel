import Navbar from '../components/Navbar'
import DarkVeil from '../components/DarkVeil'
import '../components/DarkVeil.css'
import { motion } from 'framer-motion'
import { Shield, Zap } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'

export default function Home() {
  const { token } = useSelector(state => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true })
    }
  }, [token, navigate])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white">
      <div className="absolute top-0 left-0 right-0 z-50">
        <Navbar isLanding />
      </div>
      <div className="absolute inset-0 z-0">
        <DarkVeil
          hueShift={50}
          noiseIntensity={0.07}
          scanlineIntensity={0}
          speed={0.7}
          scanlineFrequency={0}
          warpAmount={0.8}
          resolutionScale={1.25}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
            <Shield className="w-3.5 h-3.5" /> Mission Critical Monitoring
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/20">
            SENTINEL
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The ultimate API Fleet Monitor & Incident Tracker. 
            Keep your services under heavy surveillance with real-time telemetry, 
            latency tracking, and instant failure detection.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <Link
              to={token ? "/dashboard" : "/login"}
              className="px-10 py-4 bg-primary text-primary-foreground font-black uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(20,184,166,0.5)]"
            >
              <Zap className="w-5 h-5 fill-current" /> Initialize Session
            </Link>
          </div>
        </motion.div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-12 text-xs font-medium text-muted-foreground/50 uppercase tracking-[0.2em]">
          <span className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full" /> Real-time Pings</span>
          <span className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full" /> Latency Analysis</span>
          <span className="flex items-center gap-2"><div className="w-1 h-1 bg-primary rounded-full" /> Global Uptime</span>
        </div>
      </div>
    </div>
  )
}
