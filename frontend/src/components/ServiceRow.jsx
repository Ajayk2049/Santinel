import { motion } from "framer-motion"
import { Activity, CheckCircle2, AlertCircle, Clock, Zap, Eye, Trash2, RotateCw } from "lucide-react"
import { useDispatch } from "react-redux"
import { deleteService, retryPing, fetchServices } from "../store/fleetSlice"

export default function ServiceRow({ service, onViewPayload }) {
  const dispatch = useDispatch()
  const isUp = service.status === "UP"

  const handleDelete = async () => {
    if (window.confirm(`Protocol: Terminate surveillance on ${service.name}?`)) {
      await dispatch(deleteService(service.id))
    }
  }

  const handleRetry = async () => {
    await dispatch(retryPing(service.id))
    setTimeout(() => dispatch(fetchServices()), 1000)
  }

  return (
    <motion.tr 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group border-b border-primary/5 hover:bg-zinc-800/40 transition-colors"
    >
      <td className="py-5 pl-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isUp ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'}`}>
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-white text-sm tracking-tight">{service.name}</p>
            <p className="text-[10px] text-muted-foreground font-mono truncate max-w-[200px]">{service.url}</p>
          </div>
        </div>
      </td>
      
      <td className="py-5">
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs font-mono font-bold text-white">{service.lastResponseTimeMs || 0}ms</span>
        </div>
      </td>

      <td className="py-5">
        <div className="flex items-center gap-2">
          <Zap className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs font-mono font-bold text-white">{Math.round(service.avgResponseTime || 0)}ms</span>
        </div>
      </td>

      <td className="py-5">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isUp ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
          {isUp ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
          {isUp ? "Healthy" : "Incident"}
        </div>
      </td>

      <td className="py-5">
        <div className="flex flex-col">
          <span className={`text-[10px] font-mono font-black ${isUp ? 'text-green-500' : 'text-red-500'}`}>
            HTTP {service.lastStatusCode || '---'}
          </span>
          <span className="text-[8px] text-muted-foreground font-mono uppercase tracking-tighter opacity-60">
            Cycle: {service.pingInterval || 30}s
          </span>
        </div>
      </td>

      <td className="py-5">
        <button 
          onClick={onViewPayload}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-white hover:border-primary/50 transition-all"
        >
          <Eye className="w-3 h-3" /> View Payload
        </button>
      </td>

      <td className="py-5">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRetry}
            className="p-1.5 rounded-lg bg-zinc-900 border border-white/5 text-muted-foreground hover:text-primary hover:border-primary/50 transition-all active:scale-95"
            title="Retry Protocol"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1.5 rounded-lg bg-zinc-900 border border-white/5 text-muted-foreground hover:text-red-500 hover:border-red-500/50 transition-all active:scale-95"
            title="Terminate Tracking"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>

      <td className="py-5 pr-6 text-right">
        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
          {service.lastTimestamp ? new Date(service.lastTimestamp).toLocaleTimeString() : '---'}
        </span>
      </td>
    </motion.tr>
  )
}
