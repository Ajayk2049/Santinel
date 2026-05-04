import { useSelector } from "react-redux"
import ServiceCard from "../components/ServiceCard"
import { usePolling } from "../hooks/usePolling"
import { LayoutGrid, AlertTriangle, ShieldCheck } from "lucide-react"

export default function Dashboard() {
  usePolling(10000)
  const { services } = useSelector((state) => state.fleet)
  
  const incidents = services.filter(s => s.lastStatusCode < 200 || s.lastStatusCode >= 300).length
  const healthy = services.length - incidents

  return (
    <div className="min-h-screen bg-background p-6 md:p-10">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Mission Control</h1>
        <p className="text-muted-foreground">Real-time status of your API fleet.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="p-6 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Total Services</p>
              <p className="text-2xl font-bold">{services.length}</p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Healthy</p>
              <p className="text-2xl font-bold">{healthy}</p>
            </div>
          </div>
        </div>
        <div className="p-6 rounded-xl border bg-card shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Incidents</p>
              <p className="text-2xl font-bold">{incidents}</p>
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
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-2xl">
          <p className="text-muted-foreground mb-4">No services registered yet.</p>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity">
            Add Your First Service
          </button>
        </div>
      )}
    </div>
  )
}
