import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import ServiceRow from "../components/ServiceRow"
import { usePolling } from "../hooks/usePolling"
import { addService, fetchServices } from "../store/fleetSlice"
import { Plus, X, Activity, Radar, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Dashboard() {
  usePolling(15000)
  const dispatch = useDispatch()
  const { services } = useSelector((state) => state.fleet)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)
  const [newService, setNewService] = useState({ name: "", url: "", pingInterval: 30 })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const incidents = services.filter(s => s.status !== 'UP').length
  const healthy = services.length - incidents

  const handleAddService = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    
    // Basic validation check
    if (!newService.url.startsWith('http')) {
      alert("Protocol Error: Target Endpoint must include http:// or https://")
      return
    }

    setIsSubmitting(true)
    try {
      console.log("Initializing Protocol Execution:", newService);
      const result = await dispatch(addService({ ...newService, isActive: true })).unwrap()
      console.log("Protocol Executed Successfully:", result);
      
      // Optimistic close
      setIsModalOpen(false)
      setNewService({ name: "", url: "", pingInterval: 30 })
      
      // Immediate fetch for sync
      await dispatch(fetchServices())
    } catch (err) {
      console.error("Protocol initialization failed:", err)
      alert(`System Error: ${err.message || 'Unknown protocol failure'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 relative overflow-hidden">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-start gap-8 mb-10">
        <div className="space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-primary mb-1">
              <Radar className="w-5 h-5 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em]">System Tracking</span>
            </div>
            <h1 className="text-4xl font-black tracking-tighter text-white leading-none">MISSION CONTROL</h1>
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold opacity-40">Fleet Surveillance Protocol: Active</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="group relative flex items-center gap-3 px-6 py-3 bg-zinc-900 text-white border-2 border-primary/10 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-black hover:text-primary hover:border-primary transition-all duration-300 shadow-[0_0_20px_rgba(20,184,166,0.05)]"
            >
              <Plus className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">Start Tracking</span>
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="px-6 py-4 rounded-xl border border-primary/30 bg-zinc-900/80 backdrop-blur-md min-w-[140px] shadow-[0_0_15px_rgba(20,184,166,0.05)]">
            <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-1">Total Fleet</p>
            <p className="text-2xl font-black text-white">{services.length}</p>
          </div>
          <div className="px-6 py-4 rounded-xl border border-primary/30 bg-zinc-900/80 backdrop-blur-md min-w-[140px] shadow-[0_0_15px_rgba(20,184,166,0.05)]">
            <p className="text-[9px] text-green-500/60 font-black uppercase tracking-widest mb-1">Healthy</p>
            <p className="text-2xl font-black text-white">{healthy}</p>
          </div>
          <div className="px-6 py-4 rounded-xl border border-primary/30 bg-zinc-900/80 backdrop-blur-md min-w-[140px] shadow-[0_0_15px_rgba(20,184,166,0.05)]">
            <p className="text-[9px] text-red-500/60 font-black uppercase tracking-widest mb-1">Incidents</p>
            <p className="text-2xl font-black text-white">{incidents}</p>
          </div>
        </div>
      </header>

      <div className="w-full rounded-2xl border border-primary/20 bg-zinc-900/30 backdrop-blur-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-primary/10 bg-white/[0.01]">
              <th className="py-4 pl-6 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Service Module</th>
              <th className="py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Real-time Latency</th>
              <th className="py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Avg Pulse (10)</th>
              <th className="py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Condition</th>
              <th className="py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Protocol</th>
              <th className="py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Response Payload</th>
              <th className="py-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">Actions</th>
              <th className="py-4 pr-6 text-right text-[9px] font-black uppercase tracking-widest text-muted-foreground">Last Ping</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <ServiceRow 
                key={service.id} 
                service={service} 
                onViewPayload={() => setSelectedService(service)} 
              />
            ))}
          </tbody>
        </table>
        
        {services.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24">
            <Activity className="w-10 h-10 text-muted-foreground/10 mb-4" />
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-[9px] opacity-30">No active telemetry signals detected</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
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
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)} 
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors group relative z-[1020]"
                >
                  <X className="w-5 h-5 text-muted-foreground group-hover:text-white transition-colors" />
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
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-zinc-900 text-white border border-white/5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all"
                  >
                    Dismiss
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`flex-[2] py-4 bg-primary text-primary-foreground rounded-xl font-black uppercase tracking-widest text-[10px] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Initializing...' : 'Execute Protocol'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedService(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-[50vw] h-[75vh] max-w-[800px] bg-zinc-950 border border-primary/30 rounded-2xl overflow-hidden relative z-[1110] shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Radar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">{selectedService.name}</h3>
                    <p className="text-[10px] text-muted-foreground font-mono">{selectedService.url}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedService(null)} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>
              <div className="flex-1 p-8 overflow-auto">
                <div className="bg-black/50 rounded-xl border border-white/5 p-6 font-mono text-xs text-primary/90 leading-relaxed min-h-full">
                  <pre className="whitespace-pre-wrap">{selectedService.lastMessage || "// No telemetry payload captured in current cycle"}</pre>
                </div>
              </div>
              <div className="px-8 py-5 bg-zinc-900/30 border-t border-white/5 flex justify-end items-center gap-4">
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mr-auto">Protocol Intelligence Unit</span>
                <button 
                  onClick={() => setSelectedService(null)}
                  className="px-10 py-2.5 bg-primary text-primary-foreground rounded-lg text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)]"
                >
                  OK
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
