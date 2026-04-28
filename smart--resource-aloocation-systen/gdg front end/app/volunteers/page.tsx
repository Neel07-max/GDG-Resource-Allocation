"use client"

import { useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import { Plus, Users } from "lucide-react"
import { fetchVolunteers, addVolunteer, type Volunteer } from "@/lib/api"
import { VolunteerForm } from "@/components/volunteer-form"
import { VolunteerCard } from "@/components/volunteer-card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export default function VolunteersPage() {
  const [showForm, setShowForm] = useState(false)
  const { data: volunteers, isLoading, mutate } = useSWR<Volunteer[]>(
    "volunteers",
    fetchVolunteers
  )

 const handleAddVolunteer = async (volunteer: any) => {
  try {
    console.log("FORM DATA:", volunteer)

    const fixedData = {
      id: Date.now().toString(),
      name: volunteer?.name || "",
      location: volunteer?.location || { city: "kolkata" },
      availability: volunteer?.availability ?? true,
      skills: Array.isArray(volunteer?.skills)
        ? volunteer.skills
        : (volunteer?.skills || "").split(",").map(s => s.trim())
    }

    console.log("FINAL DATA:", fixedData)

    await addVolunteer(fixedData)

    toast.success("Volunteer added successfully!")
    mutate()
    setShowForm(false)

  } catch (err) {
    console.error(err)
    toast.error("Failed to add volunteer. Please try again.")
  }
}

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="h-8 w-8 text-primary" />
          <p className="text-muted-foreground">Loading volunteers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Volunteers</h1>
          <p className="text-muted-foreground mt-1">
            Manage your volunteer network
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Volunteer
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Add New Volunteer</h2>
          <VolunteerForm
            onSubmit={handleAddVolunteer}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* Volunteers Grid */}
      {volunteers && volunteers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {volunteers.map((volunteer, index) => (
            <VolunteerCard key={volunteer.id ?? index} volunteer={volunteer} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No volunteers yet</h3>
          <p className="text-muted-foreground mb-4">
            Add your first volunteer to get started
          </p>
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Volunteer
          </Button>
        </div>
      )}
    </div>
  )
}
