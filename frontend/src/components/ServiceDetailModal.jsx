import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchIncidents } from "../store/fleetSlice"
import { X, Radar, ShieldAlert, History, Code, Image as ImageIcon, FileText } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const SmartPayloadRenderer = ({ payload }) => {
  const [activeTab, setActiveTab] = useState('data')

  if (!payload) return <p className="text-muted-foreground italic opacity-40">// No payload captured</p>

  const isImage = (str) => {
    if (typeof str !== 'string') return false
    return str.match(/\.(jpeg|jpg|gif|png|webp|svg|bmp)$/i) != null || str.startsWith('data:image/')
  }

  let jsonData = null
  try { jsonData = JSON.parse(payload) } catch (e) { }

  const renderDataView = () => {
    let parsedData = null
    try {
      parsedData = typeof payload === 'string' ? JSON.parse(payload) : payload
    } catch (e) { }
    console.log("Parsed Data:", parsedData)
    // 1. Direct Image URL (Raw string)
    if (typeof payload === 'string' && isImage(payload)) {
      return (
        <div className="rounded-2xl overflow-hidden border border-white/5 bg-black/40 p-2 shadow-2xl">
          <img src={payload} alt="Service Payload" className="max-w-full h-auto rounded-xl" />
        </div>
      )
    }

    // 2. Object or Array Handling
    if (parsedData && typeof parsedData === 'object') {

      const renderItem = (item, idx) => {
        let imageUrl = null;
        let title = item.title || item.name || null;
        let body = item.body || item.description || item.content || item.message || item.body || null;

        // Smart scan: Look through all values in the object to see if ANY of them are an image link
        Object.values(item).forEach(val => {
          if (typeof val === 'string' && isImage(val)) {
            imageUrl = val;
          }
        });

        // If the body text is actually the image link, clear the body so it doesn't print twice
        if (body === imageUrl) body = null;

        if (!title && !body && !imageUrl) return null;

        return (
          <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 hover:bg-white/[0.04] transition-all">
            {imageUrl && (
              <div className="rounded-xl overflow-hidden border border-white/5 mb-2">
                <img src={imageUrl} alt="Intelligence Payload" className="w-full h-auto" />
              </div>
            )}
            {title && (
              <h4 className="text-primary font-black text-sm tracking-tight leading-tight uppercase">{title}</h4>
            )}
            {body && (
              <p className="text-xs text-white/60 leading-relaxed font-sans">{String(body)}</p>
            )}
          </div>
        )
      }

      // If it's an Array (like the Posts API)
      if (Array.isArray(parsedData)) {
        const items = parsedData.slice(0, 10).map((item, idx) => renderItem(item, idx)).filter(Boolean)

        if (items.length > 0) {
          return (
            <div className="space-y-4 max-h-[450px] overflow-auto pr-2 custom-scrollbar">
              {items}
              {parsedData.length > 10 && (
                <p className="text-[9px] text-muted-foreground text-center opacity-30 mt-4 font-mono tracking-widest uppercase">
                  // SURPASSING INTELLIGENCE CAPACITY: {parsedData.length - 10} MORE ENTRIES HIDDEN
                </p>
              )}
            </div>
          )
        }
      }
      // If it's a single Object (like the Dog API)
      else if (typeof parsedData === 'object') {
        const singleItem = renderItem(parsedData, 0)
        if (singleItem) return <div className="space-y-4">{singleItem}</div>
      }
    }

    // Fallback if no text/images found
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center rounded-2xl bg-white/[0.01] border border-dashed border-white/5">
        <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest leading-loose">
          No intelligent text fields detected in payload.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 p-1 bg-white/[0.03] border border-white/5 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('data')}
          className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'data' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-white'}`}
        >
          Intelligence Data
        </button>
        <button
          onClick={() => setActiveTab('raw')}
          className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'raw' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-white'}`}
        >
          Raw Payload
        </button>
      </div>

      <div className="relative">
        {activeTab === 'data' ? renderDataView() : (
          <div className="bg-black/50 rounded-xl border border-white/5 p-4 font-mono text-[10px] text-primary/40 leading-relaxed overflow-auto max-h-[450px]">
            <pre>{jsonData ? JSON.stringify(jsonData, null, 2) : payload}</pre>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ServiceDetailModal({ service, isOpen, onClose }) {
  const dispatch = useDispatch()
  const [incidents, setIncidents] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && service) {
      setLoading(true)
      dispatch(fetchIncidents({ id: service.id }))
        .unwrap()
        .then(data => setIncidents(data.content || []))
        .catch(() => setIncidents([]))
        .finally(() => setLoading(false))
    }
  }, [isOpen, service, dispatch])

  const uptime = service?.uptimePercentage?.toFixed(1) || "100.0"

  return (
    <AnimatePresence>
      {isOpen && service && (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-3xl h-[85vh] bg-zinc-950 border border-primary/30 rounded-3xl overflow-hidden relative z-[1510] shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 border-b border-white/5 bg-zinc-900/40 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-2xl">
                  <Radar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{service.name}</h2>
                  <p className="text-xs text-muted-foreground font-mono opacity-60">{service.url}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/5 transition-colors">
                <X className="w-6 h-6 text-muted-foreground" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1 md:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col justify-center">
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-2 opacity-40">Intelligence Rating</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black text-white tracking-tighter">{uptime}</span>
                    <span className="text-xl font-bold text-primary opacity-40">% Uptime</span>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col justify-center items-center text-center">
                  <ShieldAlert className={`w-8 h-8 mb-3 ${service.status === 'UP' ? 'text-primary' : 'text-red-500'}`} />
                  <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">Current Protocol</span>
                  <span className={`text-xl font-black uppercase ${service.status === 'UP' ? 'text-primary' : 'text-red-500'}`}>{service.status}</span>
                </div>
              </section>

              <section className="space-y-4">
                <div className="flex items-center gap-2 text-primary">
                  <History className="w-4 h-4" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Recent Incident Logs</h3>
                </div>
                <div className="rounded-2xl border border-white/5 overflow-hidden">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-white/[0.03] text-muted-foreground uppercase text-[9px] font-black">
                      <tr>
                        <th className="px-6 py-3">Timestamp</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Latency</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {loading ? (
                        <tr><td colSpan="3" className="px-6 py-8 text-center opacity-30">Retrieving intelligence...</td></tr>
                      ) : incidents.length === 0 ? (
                        <tr><td colSpan="3" className="px-6 py-8 text-center opacity-30">No incidents recorded in current window</td></tr>
                      ) : incidents.map(inc => (
                        <tr key={inc.id} className="hover:bg-white/[0.01] transition-colors">
                          <td className="px-6 py-4 text-muted-foreground">{new Date(inc.timestamp).toLocaleString()}</td>
                          <td className="px-6 py-4 font-black text-red-500">HTTP {inc.statusCode}</td>
                          <td className="px-6 py-4 text-white">{inc.responseTimeMs}ms</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="space-y-4 pb-4">
                <div className="flex items-center gap-2 text-primary">
                  <Code className="w-4 h-4" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Latest Telemetry Payload</h3>
                </div>
                <SmartPayloadRenderer payload={service.lastMessage} />
              </section>
            </div>

            <div className="p-8 border-t border-white/5 bg-zinc-900/40 flex justify-end">
              <button
                onClick={onClose}
                className="px-12 py-3 bg-primary text-primary-foreground rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-[0_0_20px_rgba(20,184,166,0.2)] transition-all"
              >
                Dismiss Intelligence
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}