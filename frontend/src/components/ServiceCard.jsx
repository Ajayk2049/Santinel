import { motion, AnimatePresence } from "framer-motion"
import { Activity, Globe, Clock, AlertCircle, CheckCircle2 } from "lucide-react"

export default function ServiceCard({ service }) {
  const isUp = service.lastStatusCode >= 200 && service.lastStatusCode < 300

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        borderColor: isUp ? "transparent" : "rgba(239, 68, 68, 0.5)",
        backgroundColor: isUp ? "var(--card)" : "rgba(239, 68, 68, 0.05)"
      }}
      transition={{ duration: 0.3 }}
      className={`relative p-6 rounded-xl border shadow-sm overflow-hidden group`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-none mb-1">{service.alias}</h3>
            <p className="text-sm text-muted-foreground truncate max-w-[200px]">{service.url}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isUp ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          {isUp ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
          {isUp ? "Healthy" : "Incident"}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="w-3 h-3" /> Latency
          </span>
          <span className="text-sm font-mono font-medium">{service.lastResponseTimeMs}ms</span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Activity className="w-3 h-3" /> Status
          </span>
          <span className={`text-sm font-mono font-medium ${isUp ? 'text-green-500' : 'text-red-500'}`}>
            {service.lastStatusCode || '---'}
          </span>
        </div>
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
