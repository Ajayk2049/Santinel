import { motion } from "framer-motion"
import { Globe, Clock, AlertCircle, CheckCircle2, Zap, ShieldCheck, Edit3, RotateCw, Trash2 } from "lucide-react"
import { useDispatch } from "react-redux"
import { deleteService, retryPing, fetchServices } from "../store/fleetSlice"

export default function ServiceCard({ service, onSelect, onEdit }) {
  const dispatch = useDispatch()
  const isUp = service.status === "UP"
  const uptime = (typeof service.uptimePercentage === 'number') ? service.uptimePercentage.toFixed(1) : "100.0"

  const handleDelete = async (e) => {
    e.stopPropagation()
    if (window.confirm(`Terminate Protocol: Remove ${service.name} from surveillance?`)) {
      await dispatch(deleteService(service.id))
    }
  }

  const handleRefresh = async (e) => {
    e.stopPropagation()
    await dispatch(retryPing(service.id))
    setTimeout(() => dispatch(fetchServices()), 1000)
  }

  const handleEdit = (e) => {
    e.stopPropagation()
    onEdit(service)
  }


  return (
    <motion.div
      layout
      onClick={() => onSelect(service)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={!isUp ? {
        opacity: 1,
        scale: 1,
        borderColor: "rgba(239, 68, 68, 0.5)",
        backgroundColor: "rgba(239, 68, 68, 0.02)"
      } : {
        opacity: 1,
        scale: 1,
        borderColor: "rgba(20, 184, 166, 0.5)",
        backgroundColor: "rgba(255,255,255,0.02)"
      }}
      whileHover={{ y: -5, borderColor: "rgba(20, 184, 166, 0.4)" }}
      className={`relative p-6 rounded-2xl border backdrop-blur-sm shadow-xl overflow-hidden group bg-zinc-900/50 cursor-pointer transition-all`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isUp ? 'bg-primary/10 text-primary' : 'bg-red-500/10 text-red-500'}`}>
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white tracking-tight leading-none mb-1.5">{service.name}</h3>
            <p className="text-[10px] text-muted-foreground truncate max-w-[120px] font-mono opacity-60">{service.url}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isUp ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
            {isUp ? "Healthy" : "Incident"}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-4 mb-6 bg-white/[0.02] rounded-2xl border border-white/5 relative group-hover:bg-white/[0.04] transition-colors">
        <span className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mb-1 opacity-40">Uptime Stability</span>
        <div className="flex items-baseline gap-1">
          <span className={`text-4xl font-black tracking-tighter ${isUp ? 'text-white' : 'text-red-500'}`}>{uptime}</span>
          <span className="text-sm font-bold text-muted-foreground/40">%</span>
        </div>

        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all bg-zinc-950/90 rounded-2xl backdrop-blur-sm">
          <button onClick={handleEdit} className="p-2.5 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-xl transition-all border border-white/5" title="Edit Config">
            <Edit3 className="w-4 h-4" />
          </button>
          <button onClick={handleRefresh} className="p-2.5 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-xl transition-all border border-white/5" title="Sync Telemetry">
            <RotateCw className="w-4 h-4" />
          </button>
          <button onClick={handleDelete} className="p-2.5 bg-white/5 hover:bg-red-500/20 hover:text-red-500 rounded-xl transition-all border border-white/5" title="Terminate Signal">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-primary/60" /> Latency
          </span>
          <span className="text-sm font-mono font-bold text-white">{service.lastResponseTimeMs || 0}ms</span>
        </div>
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-primary/60" /> Avg Pulse
          </span>
          <span className="text-sm font-mono font-bold text-white">{Math.round(service.avgResponseTime || 0)}ms</span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-3.5 h-3.5 ${isUp ? 'text-primary/40' : 'text-red-500/40'}`} />
          <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Protocol Secured</span>
        </div>
        <span className={`text-[10px] font-mono font-black ${isUp ? 'text-green-500' : 'text-red-500'}`}>
          HTTP {service.lastStatusCode || '---'}
        </span>
      </div>
    </motion.div>
  )
}
