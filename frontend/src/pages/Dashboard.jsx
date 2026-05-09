import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import ServiceGrid from "../components/ServiceGrid"
import EditServiceModal from "../components/EditServiceModal"
import ServiceDetailModal from "../components/ServiceDetailModal"
import { usePolling } from "../hooks/usePolling"
import { addService, fetchServices, fetchWorkspaces, setActiveWorkspace } from "../store/fleetSlice"
import { Plus, X, Activity, Radar, Clock, Settings, Trash2, ChevronRight, Lock, Folder, ListFilter } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "../components/Navbar"

export default function Dashboard() {
  usePolling(15000)
  const dispatch = useDispatch()
  const { services, workspaces, activeWorkspace } = useSelector((state) => state.fleet)

  useEffect(() => {
    dispatch(fetchWorkspaces())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchServices(activeWorkspace?.id))
  }, [dispatch, activeWorkspace])
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [detailedService, setDetailedService] = useState(null)
  
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeTab, setActiveTab] = useState('PARAMS')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeFilter, setActiveFilter] = useState('ALL')

  const filteredServices = activeWorkspace 
    ? services.filter(s => s.workspaceId === activeWorkspace.id)
    : services

  const incidents = filteredServices.filter(s => s.status !== 'UP').length
  const healthy = filteredServices.length - incidents

  const [newService, setNewService] = useState({ 
    name: "", 
    url: "", 
    method: "GET",
    pingInterval: 30,
    params: [{ key: "", value: "", id: Date.now() }],
    headers: [{ key: "", value: "", id: Date.now() + 1 }],
    authType: "NONE",
    authToken: "",
    body: ""
  })

  const handleAddService = async (e) => {
    e.preventDefault()
    if (isSubmitting) return
    
    if (!newService.url.startsWith('http')) {
      alert("Protocol Error: Target Endpoint must include http:// or https://")
      return
    }

    setIsSubmitting(true)
    try {
      const cleanedParams = newService.params.filter(p => p.key.trim())
      const cleanedHeaders = newService.headers.filter(h => h.key.trim())
      
      const payload = {
        ...newService,
        workspaceId: activeWorkspace?.id || null,
        params: cleanedParams.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}),
        headers: cleanedHeaders.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {}),
        isActive: true
      }

      await dispatch(addService(payload)).unwrap()
      setIsAddModalOpen(false)
      setShowAdvanced(false)
      setNewService({ 
        name: "", 
        url: "", 
        method: "GET",
        pingInterval: 30,
        params: [{ key: "", value: "", id: Date.now() }],
        headers: [{ key: "", value: "", id: Date.now() + 1 }],
        authType: "NONE",
        authToken: "",
        body: ""
      })
      await dispatch(fetchServices())
    } catch (err) {
      alert(`System Error: ${err.message || 'Unknown protocol failure'}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addRow = (type) => {
    const newRow = { key: "", value: "", id: Date.now() }
    setNewService(prev => ({
      ...prev,
      [type]: [...prev[type], newRow]
    }))
  }

  const removeRow = (type, id) => {
    setNewService(prev => ({
      ...prev,
      [type]: prev[type].filter(row => row.id !== id)
    }))
  }

  const updateRow = (type, id, field, value) => {
    setNewService(prev => ({
      ...prev,
      [type]: prev[type].map(row => row.id === id ? { ...row, [field]: value } : row)
    }))
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar onStartTracking={() => setIsAddModalOpen(true)} />
      
      <div className="p-6 md:p-10 pt-0">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-start gap-8 mb-10">
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3 text-primary mb-1">
                <Radar className="w-5 h-5 animate-pulse" />
                <span className="text-[9px] font-black uppercase tracking-[0.3em]">
                  {activeWorkspace ? `Workspace: ${activeWorkspace.name}` : "System Tracking"}
                </span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-white leading-none uppercase">
                {activeWorkspace ? activeWorkspace.name : "MISSION CONTROL"}
              </h1>
              <p className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold opacity-40">
                Fleet Surveillance Protocol: {activeWorkspace ? "Isolated" : "Active"}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setActiveFilter('ALL')}
              className={`px-8 py-4 rounded-2xl border transition-all duration-300 min-w-[140px] text-left ${activeFilter === 'ALL' ? 'border-primary bg-primary/10 shadow-[0_0_30px_rgba(20,184,166,0.1)]' : 'border-white/5 bg-zinc-900/50 hover:border-white/20'}`}
            >
              <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mb-1 opacity-40">Total</p>
              <p className="text-2xl font-black text-white">{filteredServices.length}</p>
            </button>
            
            <button 
              onClick={() => setActiveFilter('UP')}
              className={`px-8 py-4 rounded-2xl border transition-all duration-300 min-w-[140px] text-left ${activeFilter === 'UP' ? 'border-green-500 bg-green-500/10 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : 'border-green-500/10 bg-green-500/5 hover:border-green-500/30'}`}
            >
              <p className="text-[9px] text-green-500/60 font-black uppercase tracking-widest mb-1">Healthy</p>
              <p className="text-2xl font-black text-white">{healthy}</p>
            </button>
            
            <button 
              onClick={() => setActiveFilter('DOWN')}
              className={`px-8 py-4 rounded-2xl border transition-all duration-300 min-w-[140px] text-left ${activeFilter === 'DOWN' ? 'border-red-500 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'border-red-500/10 bg-red-500/5 hover:border-red-500/30'}`}
            >
              <p className="text-[9px] text-red-500/60 font-black uppercase tracking-widest mb-1">Incidents</p>
              <p className="text-2xl font-black text-white">{incidents}</p>
            </button>
          </div>
        </header>

        {!activeWorkspace && workspaces.length > 0 && (
          <div className="flex flex-row overflow-x-auto gap-4 mb-12 pb-4 no-scrollbar">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => dispatch(setActiveWorkspace(ws))}
                className="flex items-center gap-4 p-6 bg-zinc-900/50 border border-white/5 rounded-2xl min-w-[240px] hover:border-primary/40 hover:bg-zinc-900 transition-all group"
              >
                <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform">
                  <Folder className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">{ws.name}</h3>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-40">View Workspace</p>
                </div>
                <ChevronRight className="w-4 h-4 text-white/10 ml-auto group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        )}

        <main>
          {filteredServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-3xl">
              <Activity className="w-16 h-16 text-muted-foreground/10 mb-6" />
              <p className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-xs opacity-30">
                {activeWorkspace ? `No signals detected in ${activeWorkspace.name}` : "No active telemetry signals detected"}
              </p>
            </div>
          ) : (
            <ServiceGrid 
              onSelect={setDetailedService} 
              onEdit={setEditingService} 
              activeFilter={activeFilter}
            />
          )}
        </main>
      </div>

      {/* Add Service Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsAddModalOpen(false)
                setShowAdvanced(false)
              }}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden relative z-[1010] shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col md:flex-row transition-all duration-500 ${showAdvanced ? 'max-w-6xl w-full' : 'max-w-lg w-full'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`p-8 flex-1 transition-all duration-500 ${showAdvanced ? 'md:border-r border-white/5' : ''}`}>
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-primary/10 rounded-xl">
                      <Radar className="w-5 h-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-black tracking-tight text-white uppercase">Initialize Service</h2>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    {!showAdvanced && (
                      <button 
                        onClick={() => setIsAddModalOpen(false)} 
                        className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/10 transition-colors group border border-red-500/10"
                      >
                        <X className="w-5 h-5 text-red-500/40 group-hover:text-red-500 transition-colors" />
                      </button>
                    )}
                    <button 
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[9px] font-black uppercase tracking-widest ${showAdvanced ? 'bg-primary text-primary-foreground border-primary' : 'bg-zinc-900 text-white border-white/5 hover:border-primary/50'}`}
                    >
                      <Settings className={`w-3.5 h-3.5 ${showAdvanced ? 'text-primary-foreground' : 'text-primary'}`} />
                      Advanced
                    </button>
                  </div>
                </div>

                <form onSubmit={handleAddService} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Method</label>
                      <select 
                        value={newService.method}
                        onChange={e => setNewService({...newService, method: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 focus:border-primary/50 outline-none transition-all text-white font-bold text-xs appearance-none"
                      >
                        {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => (
                          <option key={m} value={m} className="bg-zinc-950">{m}</option>
                        ))}
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Service Name</label>
                      <input 
                        type="text" 
                        value={newService.name}
                        onChange={e => setNewService({...newService, name: e.target.value})}
                        placeholder="Auth Portal" 
                        className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 focus:border-primary/50 outline-none transition-all text-white placeholder:text-white/20 text-sm"
                        required 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target Endpoint</label>
                    <input 
                      type="text" 
                      value={newService.url}
                      onChange={e => setNewService({...newService, url: e.target.value})}
                      placeholder="https://api.sentinel.sys/v1" 
                      className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 focus:border-primary/50 outline-none transition-all text-white placeholder:text-white/20 text-sm font-mono"
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Ping Frequency</label>
                    <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-xl px-4 py-3">
                      <Clock className="w-4 h-4 text-primary" />
                      <select 
                        value={newService.pingInterval} 
                        onChange={e => setNewService({...newService, pingInterval: parseInt(e.target.value)})}
                        className="bg-transparent text-white text-xs font-bold outline-none cursor-pointer flex-1"
                      >
                        {[5, 10, 15, 30, 60, 120, 300].map(s => (
                          <option key={s} value={s} className="bg-zinc-950">{s} Seconds</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-black uppercase tracking-widest text-[10px] hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] disabled:opacity-50"
                    >
                      {isSubmitting ? 'Initializing...' : 'Execute Protocol'}
                    </button>
                  </div>
                </form>
              </div>

              <AnimatePresence>
                {showAdvanced && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex-1 bg-zinc-900/20 p-8 flex flex-col h-full min-h-[500px]"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-zinc-800 rounded-xl text-primary">
                          <Settings className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-black tracking-tight text-white uppercase">Request Config</h2>
                      </div>
                      <button 
                        onClick={() => setShowAdvanced(false)} 
                        className="p-2 rounded-lg bg-red-500/5 hover:bg-red-500/10 transition-colors group border border-red-500/10"
                      >
                        <X className="w-5 h-5 text-red-500/40 group-hover:text-red-500 transition-colors" />
                      </button>
                    </div>

                    <div className="flex gap-1 p-1 bg-black/40 rounded-xl mb-6 border border-white/5">
                      {[
                        { id: 'PARAMS', icon: ListFilter, label: 'Params' },
                        { id: 'HEADERS', icon: Database, label: 'Headers' },
                        { id: 'AUTH', icon: Lock, label: 'Auth' },
                        { id: 'BODY', icon: Activity, label: 'Body' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-zinc-800 text-primary shadow-lg' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
                        >
                          <tab.icon className="w-3 h-3" />
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                      {activeTab === 'PARAMS' && (
                        <div className="space-y-3">
                          {newService.params.map((row) => (
                            <div key={row.id} className="flex gap-2">
                              <input 
                                placeholder="Key"
                                value={row.key}
                                onChange={e => updateRow('params', row.id, 'key', e.target.value)}
                                className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/5 text-xs text-white outline-none focus:border-primary/30"
                              />
                              <input 
                                placeholder="Value"
                                value={row.value}
                                onChange={e => updateRow('params', row.id, 'value', e.target.value)}
                                className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/5 text-xs text-white outline-none focus:border-primary/30"
                              />
                              <button 
                                onClick={() => removeRow('params', row.id)}
                                className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button 
                            type="button"
                            onClick={() => addRow('params')}
                            className="w-full py-2 border border-dashed border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                          >
                            Add Parameter
                          </button>
                        </div>
                      )}

                      {activeTab === 'HEADERS' && (
                        <div className="space-y-3">
                          {newService.headers.map((row) => (
                            <div key={row.id} className="flex gap-2">
                              <input 
                                placeholder="Header"
                                value={row.key}
                                onChange={e => updateRow('headers', row.id, 'key', e.target.value)}
                                className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/5 text-xs text-white outline-none focus:border-primary/30"
                              />
                              <input 
                                placeholder="Value"
                                value={row.value}
                                onChange={e => updateRow('headers', row.id, 'value', e.target.value)}
                                className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/5 text-xs text-white outline-none focus:border-primary/30"
                              />
                              <button 
                                onClick={() => removeRow('headers', row.id)}
                                className="p-2 text-red-500/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button 
                            type="button"
                            onClick={() => addRow('headers')}
                            className="w-full py-2 border border-dashed border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                          >
                            Add Header
                          </button>
                        </div>
                      )}

                      {activeTab === 'AUTH' && (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Auth Type</label>
                            <select 
                              value={newService.authType}
                              onChange={e => setNewService({...newService, authType: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 focus:border-primary/50 outline-none transition-all text-white font-bold text-xs"
                            >
                              <option value="NONE" className="bg-zinc-950">None</option>
                              <option value="BEARER" className="bg-zinc-950">Bearer Token</option>
                            </select>
                          </div>
                          {newService.authType === 'BEARER' && (
                            <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Bearer Token</label>
                              <input 
                                type="text"
                                value={newService.authToken}
                                onChange={e => setNewService({...newService, authToken: e.target.value})}
                                placeholder="eyJhbGciOiJIUzI1..."
                                className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 focus:border-primary/50 outline-none transition-all text-white text-xs font-mono"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === 'BODY' && (
                        <div className="space-y-2 h-full">
                          <div className="flex justify-between items-center ml-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">JSON Payload</label>
                            {['GET', 'DELETE'].includes(newService.method) && (
                              <span className="text-[8px] font-bold text-red-400/60 uppercase tracking-tighter italic">Not supported for {newService.method}</span>
                            )}
                          </div>
                          <textarea 
                            disabled={['GET', 'DELETE'].includes(newService.method)}
                            value={newService.body}
                            onChange={e => setNewService({...newService, body: e.target.value})}
                            placeholder='{ "key": "value" }'
                            className="w-full h-48 px-4 py-4 rounded-xl border border-white/5 bg-black/40 focus:border-primary/50 outline-none transition-all text-white font-mono text-xs resize-none disabled:opacity-20 custom-scrollbar"
                          />
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <EditServiceModal 
        service={editingService} 
        isOpen={!!editingService} 
        onClose={() => setEditingService(null)} 
      />

      <ServiceDetailModal 
        service={detailedService} 
        isOpen={!!detailedService} 
        onClose={() => setDetailedService(null)} 
      />
    </div>
  )
}
