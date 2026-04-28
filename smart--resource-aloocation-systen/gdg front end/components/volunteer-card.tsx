import { MapPin, CheckCircle, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Volunteer } from "@/lib/api"

interface VolunteerCardProps {
  volunteer: Volunteer
}

export function VolunteerCard({ volunteer }: VolunteerCardProps) {
  return (
    <div className="glass-card rounded-xl p-5 space-y-4 transition-transform hover:scale-[1.02]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{volunteer.name}</h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{volunteer.location.city}</span>
          </div>
        </div>
        {volunteer.availability ? (
          <Badge className="bg-success/20 text-success border-success/30 shrink-0">
            <CheckCircle className="h-3 w-3 mr-1" />
            Available
          </Badge>
        ) : (
          <Badge className="bg-muted text-muted-foreground border-muted shrink-0">
            <XCircle className="h-3 w-3 mr-1" />
            Unavailable
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {volunteer.skills.map((skill) => (
          <Badge key={skill} variant="secondary" className="text-xs">
            {skill}
          </Badge>
        ))}
      </div>
    </div>
  )
}
