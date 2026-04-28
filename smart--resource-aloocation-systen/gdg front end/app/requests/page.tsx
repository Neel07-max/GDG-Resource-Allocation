"use client"

import { useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import { Plus, FileText } from "lucide-react"
import { fetchRequests, addRequest, type Request } from "@/lib/api"
import { RequestForm } from "@/components/request-form"
import { RequestCard } from "@/components/request-card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function RequestsPage() {
  const [showForm, setShowForm] = useState(false)
  const { data: requests, isLoading, mutate } = useSWR<Request[]>(
    "requests",
    fetchRequests
  )

  const handleAddRequest = async (request: Omit<Request, "id">) => {
    try {
      await addRequest(request)
      toast.success("Request added successfully!")
      mutate()
      setShowForm(false)
    } catch {
      toast.error("Failed to add request. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-muted-foreground">Loading requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Requests</h1>
          <p className="text-muted-foreground mt-1">
            Manage resource requests
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Request
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Add New Request</h2>
          <RequestForm
            onSubmit={handleAddRequest}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Requests Grid */}
      {requests && requests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((request, index) => (
            <RequestCard key={request.id ?? index} request={request} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No requests yet</h3>
          <p className="text-muted-foreground mb-4">
            Add your first request to get started
          </p>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Request
          </Button>
        </div>
      )}
    </div>
  )
}
