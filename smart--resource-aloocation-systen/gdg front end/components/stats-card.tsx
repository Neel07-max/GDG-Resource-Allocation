import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: number
  icon: LucideIcon
  color: "primary" | "success" | "accent" | "warning"
}

const colorStyles = {
  primary: "text-primary bg-primary/10",
  success: "text-success bg-success/10",
  accent: "text-accent bg-accent/10",
  warning: "text-warning bg-warning/10",
}

export function StatsCard({ title, value, icon: Icon, color }: StatsCardProps) {
  return (
    <div className="glass-card rounded-xl p-6 transition-transform hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={cn("p-3 rounded-lg", colorStyles[color])}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
