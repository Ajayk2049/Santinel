import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import ServiceGrid from "../components/ServiceGrid"
import EditServiceModal from "../components/EditServiceModal"
import ServiceDetailModal from "../components/ServiceDetailModal"
import { usePolling } from "../hooks/usePolling"
import { addService, fetchServices } from "../store/fleetSlice"
import { Plus, X, Activity, Radar, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Dashboard() {
  usePolling(15000)
  const dispatch = useDispatch()
  const { services } = useSelector((state) => state.fleet)
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [detailedService, setDetailedService] = useState(null)
  
  const [newService, setNewService] = useState({ name: "", url: "", pingInterval: 30 })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeFilter, setActiveFilter] = useState('ALL')

  const incidents = services.filter(s => s.status !== 'UP').length
  const healthy = services.length - incidents

  const handleAddService = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    
    if (!newService.url.startsWith('http')) {
      alert("Protocol Error: Target Endpoint must include http:// or https://")
      return
    }

    setIsSubmitting(true)
    try {
      await dispatch(addService({ ...newService, isActive: true })).unwrap()
      setIsAddModalOpen(false)
      setNewService({ name: "", url: "", pingInterval: 30 })
      await dispatch(fetchServices())
    } catch (err) {
      alert(`System Error: ${err.message || 'Unknown protocol failure'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 relative overflow-hidden">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-start gap-8 mb-16">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-primary mb-1">
              <Radar className="w-5 h-5 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">System Tracking</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter text-white leading-none">MISSION CONTROL</h1>
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold opacity-40">Fleet Surveillance Protocol: Active</p>
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="group relative flex items-center gap-3 px-8 py-4 bg-zinc-900 text-white border-2 border-primary/10 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black hover:text-primary hover:border-primary transition-all duration-300 shadow-[0_0_20px_rgba(20,184,166,0.05)]"
          >
            <Plus className="w-4 h-4 relative z-10" />
            <span className="relative z-10">Start Tracking</span>
          </button>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => setActiveFilter('ALL')}
            className={`px-8 py-6 rounded-2xl border transition-all duration-300 min-w-[160px] text-left ${activeFilter === 'ALL' ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(20,184,166,0.1)]' : 'border-white/5 bg-zinc-900/50 hover:border-white/20'}`}
          >
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1 opacity-40">Total Fleet</p>
            <p className="text-3xl font-black text-white">{services.length}</p>
          </button>
          
          <button 
            onClick={() => setActiveFilter('UP')}
            className={`px-8 py-6 rounded-2xl border transition-all duration-300 min-w-[160px] text-left ${activeFilter === 'UP' ? 'border-green-500 bg-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : 'border-green-500/10 bg-green-500/5 hover:border-green-500/30'}`}
          >
            <p className="text-[10px] text-green-500/60 font-black uppercase tracking-widest mb-1">Healthy</p>
            <p className="text-3xl font-black text-white">{healthy}</p>
          </button>
          
          <button 
            onClick={() => setActiveFilter('DOWN')}
            className={`px-8 py-6 rounded-2xl border transition-all duration-300 min-w-[160px] text-left ${activeFilter === 'DOWN' ? 'border-red-500 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'border-red-500/10 bg-red-500/5 hover:border-red-500/30'}`}
          >
            <p className="text-[10px] text-red-500/60 font-black uppercase tracking-widest mb-1">Incidents</p>
            <p className="text-3xl font-black text-white">{incidents}</p>
          </button>
        </div>
      </header>

      <main>
        {services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-3xl">
            <Activity className="w-16 h-16 text-muted-foreground/10 mb-6" />
            <p className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-xs opacity-30">No active telemetry signals detected</p>
          </div>
        ) : (
          <ServiceGrid 
            onSelect={setDetailedService} 
            onEdit={setEditingService} 
            activeFilter={activeFilter}
          />
        )}
      </main>

      {/* Add Service Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="w-full max-w-md bg-zinc-950 border border-primary/30 rounded-2xl p-8 relative z-[1010] shadow-[0_0_50px_rgba(20,184,166,0.15)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
              <div className="flex justify-between items-center mb-8 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Radar className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight text-white uppercase">Initialize Service</h2>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 rounded-lg hover:bg-white/5 transition-colors group">
                  <X className="w-5 h-5 text-muted-foreground group-hover:text-white" />
                </button>
              </div>

              <form onSubmit={handleAddService} className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Service Name</label>
                  <input 
                    type="text" 
                    value={newService.name}
                    onChange={e => setNewService({...newService, name: e.target.value})}
                    placeholder="Auth Portal" 
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 focus:border-primary/50 outline-none transition-all text-white placeholder:text-white/20"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Endpoint</label>
                  <input 
                    type="text" 
                    value={newService.url}
                    onChange={e => setNewService({...newService, url: e.target.value})}
                    placeholder="https://api.sentinel.sys/v1" 
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 focus:border-primary/50 outline-none transition-all text-white placeholder:text-white/20"
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ping Protocol Frequency</label>
                  <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-xl px-4 py-3">
                    <Clock className="w-4 h-4 text-primary" />
                    <select 
                      value={newService.pingInterval} 
                      onChange={e => setNewService({...newService, pingInterval: parseInt(e.target.value)})}
                      className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer flex-1"
                    >
                      {[5, 10, 15, 30, 60, 120, 300].map(s => (
                        <option key={s} value={s} className="bg-zinc-900">{s} Seconds</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 bg-zinc-900 text-white border border-white/5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all">Dismiss</button>
                  <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-primary text-primary-foreground rounded-xl font-black uppercase tracking-widest text-[10px] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] disabled:opacity-50">
                    {isSubmitting ? 'Initializing...' : 'Execute Protocol'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <EditServiceModal 
        service={editingService} 
        isOpen={!!editingService} 
        onClose={() => setEditingService(null)} 
      />

      {/* Intelligence Modal */}
      <ServiceDetailModal 
        service={detailedService} 
        isOpen={!!detailedService} 
        onClose={() => setDetailedService(null)} 
      />
    </div>
  )
}
