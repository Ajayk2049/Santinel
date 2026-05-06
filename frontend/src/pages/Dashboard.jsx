import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import ServiceCard from "../components/ServiceCard"
import { usePolling } from "../hooks/usePolling"
import { addService, fetchServices } from "../store/fleetSlice"
import { LayoutGrid, AlertTriangle, ShieldCheck, Plus, X, Activity } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Dashboard() {
  usePolling(15000)
  const dispatch = useDispatch()
  const { services } = useSelector((state) => state.fleet)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newService, setNewService] = useState({ name: "", url: "" })
  
  const incidents = services.filter(s => s.status === 'DOWN').length
  const healthy = services.length - incidents

  const handleAddService = async (e) => {
    e.preventDefault()
    try {
      await dispatch(addService({ ...newService, isActive: true })).unwrap()
      setTimeout(() => dispatch(fetchServices()), 1000)
      setNewService({ name: "", url: "" })
      setIsModalOpen(false)
    } catch (err) {
      console.error("Protocol initialization failed:", err)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-10 relative overflow-hidden">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tighter text-white">MISSION CONTROL</h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Fleet Telemetry: Active</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)]"
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Total Fleet</p>
              <p className="text-2xl font-black text-white">{services.length}</p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Healthy</p>
              <p className="text-2xl font-black text-white">{healthy}</p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Incidents</p>
              <p className="text-2xl font-black text-white">{incidents}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
      
      {services.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.02]">
          <div className="p-4 rounded-full bg-white/5 mb-6">
            <Activity className="w-8 h-8 text-muted-foreground opacity-20" />
          </div>
          <p className="text-muted-foreground font-medium mb-6">No active signals detected in your fleet.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold uppercase tracking-widest text-xs hover:brightness-110 transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)]"
          >
            Initiate First Protocol
          </button>
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-card border border-white/10 rounded-2xl p-8 relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl" />
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black tracking-tight text-white uppercase">Initialize Service</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <form onSubmit={handleAddService} className="space-y-6">
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
                    type="url" 
                    value={newService.url}
                    onChange={e => setNewService({...newService, url: e.target.value})}
                    placeholder="https://api.sentinel.sys/v1" 
                    className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 focus:border-primary/50 outline-none transition-all text-white placeholder:text-white/20"
                    required 
                  />
                </div>
                <button type="submit" className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-black uppercase tracking-widest text-xs hover:brightness-110 active:scale-[0.98] transition-all mt-4 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                  Execute Protocol
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
