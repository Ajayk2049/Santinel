import { useSelector } from "react-redux"
import ServiceCard from "./ServiceCard"
import { AlertCircle } from "lucide-react"

export default function ServiceGrid({ onSelect, onEdit, activeFilter }) {
  const { services, activeWorkspace } = useSelector((state) => state.fleet)

  const filteredServices = services.filter((service) => {
    // Workspace Filter
    if (activeWorkspace && service.workspaceId !== activeWorkspace.id) return false
    
    // Status Filter
    if (activeFilter === 'ALL') return true
    if (activeFilter === 'UP') return service.status === 'UP'
    if (activeFilter === 'DOWN') return service.status !== 'UP'
    return true
  })

  return (
    <div className="space-y-8">
      {filteredServices.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl bg-white/[0.01]">
          <AlertCircle className="w-12 h-12 text-muted-foreground/10 mb-4" />
          <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px] opacity-40 text-center px-6">
            {activeWorkspace 
              ? `No telemetry detected in ${activeWorkspace.name} matching protocol.` 
              : "No services currently match this filter protocol."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredServices.map((service) => (
            <ServiceCard 
              key={service.id} 
              service={service} 
              onSelect={onSelect}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </div>
  )
}
