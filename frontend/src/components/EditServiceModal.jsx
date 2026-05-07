import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { updateService, fetchServices } from "../store/fleetSlice"
import { X, Radar, Clock, Save } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function EditServiceModal({ service, isOpen, onClose }) {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({ name: "", url: "", pingInterval: 30 })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (service) {
      setFormData({ 
        name: service.name || "", 
        url: service.url || "", 
        pingInterval: service.pingInterval || 30 
      })
    }
  }, [service])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await dispatch(updateService({ id: service.id, data: formData })).unwrap()
      await dispatch(fetchServices())
      onClose()
    } catch (err) {
      alert(`Update Failed: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="w-full max-w-md bg-zinc-950 border border-primary/30 rounded-2xl p-8 relative z-[2010] shadow-[0_0_50px_rgba(20,184,166,0.15)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Radar className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-black tracking-tight text-white uppercase">Modify Protocol</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Service Alias</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 focus:border-primary/50 outline-none transition-all text-white"
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Target URL</label>
                <input 
                  type="text" 
                  value={formData.url}
                  onChange={e => setFormData({...formData, url: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-white/5 bg-black/40 focus:border-primary/50 outline-none transition-all text-white"
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Polling Interval</label>
                <div className="flex items-center gap-3 bg-black/40 border border-white/5 rounded-xl px-4 py-3">
                  <Clock className="w-4 h-4 text-primary" />
                  <select 
                    value={formData.pingInterval} 
                    onChange={e => setFormData({...formData, pingInterval: parseInt(e.target.value)})}
                    className="bg-transparent text-white text-xs font-bold outline-none flex-1"
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
                  onClick={onClose}
                  className="flex-1 py-4 bg-zinc-900 text-white border border-white/5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-[2] flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-xl font-black uppercase tracking-widest text-[10px] hover:brightness-110 transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Updating...' : 'Save Configuration'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
