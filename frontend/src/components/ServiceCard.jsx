import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Activity, Globe, Clock, AlertCircle, CheckCircle2, Zap } from "lucide-react"

export default function ServiceCard({ service }) {
  const [statusChanged, setStatusChanged] = useState(false)
  const isUp = service.status === "UP"

  useEffect(() => {
    setStatusChanged(true)
    const timer = setTimeout(() => setStatusChanged(false), 1000)
    return () => clearTimeout(timer)
  }, [isUp])

  const shakeAnimation = {
    x: [0, -5, 5, -5, 5, 0],
    transition: { duration: 0.4 }
  }

  const pulseAnimation = {
    scale: [1, 1.02, 1],
    transition: { duration: 0.3 }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        borderColor: isUp ? "rgba(255,255,255,0.05)" : "rgba(239, 68, 68, 0.3)",
        backgroundColor: isUp ? "rgba(255,255,255,0.02)" : "rgba(239, 68, 68, 0.05)",
        ...(statusChanged ? (isUp ? pulseAnimation : shakeAnimation) : {})
      }}
      transition={{ duration: 0.3 }}
      className={`relative p-6 rounded-2xl border backdrop-blur-sm shadow-xl overflow-hidden group`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white tracking-tight leading-none mb-1.5">{service.name}</h3>
            <p className="text-[10px] text-muted-foreground truncate max-w-[140px] font-mono">{service.url}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isUp ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
          {isUp ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
          {isUp ? "Healthy" : "Incident"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-primary/60" /> Current
          </span>
          <span className="text-sm font-mono font-bold text-white">{service.lastResponseTimeMs || 0}ms</span>
        </div>
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-primary/60" /> Avg (10)
          </span>
          <span className="text-sm font-mono font-bold text-white">{Math.round(service.avgResponseTime || 0)}ms</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Status Protocol</span>
        <span className={`text-xs font-mono font-bold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
          HTTP {service.lastStatusCode || '---'}
        </span>
      </div>

      {!isUp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 bg-red-500/5 pointer-events-none"
        />
      )}
    </motion.div>
  )
}
