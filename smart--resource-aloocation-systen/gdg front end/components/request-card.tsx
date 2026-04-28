import { Badge } from "@/components/ui/badge"
import { MapPin, Users } from "lucide-react"
import type { Request } from "@/lib/api"

interface RequestCardProps {
  request: Request
}

const urgencyColors = {
  1: "bg-success/20 text-success border-success/30",
  2: "bg-success/20 text-success border-success/30",
  3: "bg-warning/20 text-warning border-warning/30",
  4: "bg-destructive/20 text-destructive border-destructive/30",
  5: "bg-destructive/20 text-destructive border-destructive/30",
}

const typeLabel = {
  food: "Food",
  medical: "Medical",
  general: "General",
}

export function RequestCard({ request }: RequestCardProps) {
  return (
    <div className="glass-card rounded-xl p-5 space-y-4 transition-transform hover:scale-[1.02]">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold flex-1 min-w-0 truncate">{typeLabel[request.type]} Request</h3>
        <Badge className={urgencyColors[request.urgency]}>
          {request.urgency}/5
        </Badge>
      </div>

      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>{request.location.city}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          <span>{request.people_count} people need assistance</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-1">
        <Badge variant="secondary" className="text-xs">
          {request.type}
        </Badge>
      </div>
    </div>
  )
}
