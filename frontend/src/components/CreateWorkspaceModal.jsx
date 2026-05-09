import { useState } from "react"
import { useDispatch } from "react-redux"
import { motion, AnimatePresence } from "framer-motion"
import { X, FolderPlus } from "lucide-react"
import { setActiveWorkspace, createWorkspace } from "../store/fleetSlice"

export default function CreateWorkspaceModal({ isOpen, onClose }) {
  const dispatch = useDispatch()
  const [name, setName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const result = await dispatch(createWorkspace({ name: name.trim() })).unwrap()
      dispatch(setActiveWorkspace(result))
      setName("")
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-zinc-950 border border-white/10 rounded-3xl p-8 w-full max-w-md relative z-[2010] shadow-[0_0_100px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-500/10 rounded-xl">
                  <FolderPlus className="w-5 h-5 text-teal-500" />
                </div>
                <h2 className="text-xl font-black tracking-tight text-white uppercase">New Workspace</h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                <X className="w-5 h-5 text-white/40" />
              </button>
            </div>

            <p className="text-muted-foreground text-xs font-bold leading-relaxed mb-8 opacity-60">
              Workspaces allow you to group related API services together for isolated environment tracking.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Workspace Name</label>
                <input
                  type="text"
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Production Cluster"
                  className="w-full px-4 py-4 bg-black/40 border border-white/5 rounded-2xl text-white text-sm font-bold placeholder:text-white/10 focus:border-teal-500/50 outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-teal-500 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-teal-500 border border-transparent hover:border-teal-500 transition-all duration-300 shadow-[0_0_20px_rgba(20,184,166,0.3)]"
              >
                Establish Workspace
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
