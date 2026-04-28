import { Users, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { type Request, type Volunteer } from "@/lib/api"

interface MatchingCardProps {
  request: Request
  volunteers: Volunteer[]
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

export function MatchingCard({ request, volunteers }: MatchingCardProps) {
  return (
    <div className="glass-card rounded-xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{typeLabel[request.type]} Request</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {request.people_count} people need help in {request.location.city}
          </p>
        </div>
        <Badge className={urgencyColors[request.urgency]}>
          Urgency: {request.urgency}/5
        </Badge>
      </div>

      <div className="border-t border-border/50 pt-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Users className="h-4 w-4" />
          <span>{volunteers.length} available volunteer{volunteers.length !== 1 ? "s" : ""}</span>
        </div>
        <div className="space-y-2">
          {volunteers.slice(0, 3).map((volunteer) => (
            <div
              key={volunteer.id ?? volunteer.name}
              className="flex items-center justify-between p-2 rounded-lg bg-secondary/30"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{volunteer.name}</p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{volunteer.location.city}</span>
                </div>
              </div>
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                {request.type}
              </Badge>
            </div>
          ))}
          {volunteers.length > 3 && (
            <p className="text-xs text-muted-foreground text-center pt-1">
              +{volunteers.length - 3} more
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
