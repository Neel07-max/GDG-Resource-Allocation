"use client"

import useSWR from "swr"
import { Users, FileText, CheckCircle, AlertTriangle, TrendingUp, Sparkles } from "lucide-react"
import { fetchVolunteers, fetchRequests, type Volunteer, type Request } from "@/lib/api"
import { StatsCard } from "@/components/stats-card"
import { MatchingCard } from "@/components/matching-card"
import { Spinner } from "@/components/ui/spinner"

export default function Dashboard() {
  const { data: volunteers, isLoading: loadingVolunteers } = useSWR<Volunteer[]>(
    "volunteers",
    fetchVolunteers
  )
  const { data: requests, isLoading: loadingRequests } = useSWR<Request[]>(
    "requests",
    fetchRequests
  )

  const isLoading = loadingVolunteers || loadingRequests
  const safeVolunteers = Array.isArray(volunteers) ? volunteers : []
  const safeRequests = Array.isArray(requests) ? requests : []

  
     
const availableVolunteers = safeVolunteers.filter(
  v => v.availability
).length

const urgentRequests = safeRequests.filter(
  r => r.urgency >= 4
).length

const matches = safeRequests.map((request) => {
  const matchingVolunteers = safeVolunteers.filter((volunteer) => {
    if (!volunteer.availability) return false
    return true
  })

  return { request, matchingVolunteers }
}).filter(m => m.matchingVolunteers.length > 0)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-balance">
          <span className="text-primary">Smart</span> Resource Allocation
        </h1>
        <p className="text-muted-foreground text-pretty">
          Match volunteers with requests based on skills and availability
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Volunteers"
          value={volunteers?.length ?? 0}
          icon={Users}
          color="primary"
        />
        <StatsCard
          title="Available Now"
          value={availableVolunteers}
          icon={CheckCircle}
          color="success"
        />
        <StatsCard
          title="Total Requests"
          value={requests?.length ?? 0}
          icon={FileText}
          color="accent"
        />
        <StatsCard
          title="Urgent Requests"
          value={urgentRequests}
          icon={AlertTriangle}
          color="warning"
        />
      </div>

      {/* Matching Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Skill Matches</h2>
        </div>

        {matches.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {matches.slice(0, 4).map((match, index) => (
              <MatchingCard
                key={index}
                request={match.request}
                volunteers={match.matchingVolunteers}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-8 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No skill matches found. Add volunteers and requests to see matches.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
