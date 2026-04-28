"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import type { Volunteer } from "@/lib/api"

interface VolunteerFormProps {
  onSubmit: (volunteer: Omit<Volunteer, "id">) => Promise<void>
  onCancel: () => void
}

export function VolunteerForm({ onSubmit, onCancel }: VolunteerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState("")
  const [skills, setSkills] = useState("")
  const [availability, setAvailability] = useState(true)
  const [location, setLocation] = useState("")

  const handleSubmit = async (e: any) => {
    console.log("Submit clicked")
    e.preventDefault()

  try {
    setIsSubmitting(true)

    const volunteer = {

  
  name: name.trim(),
  skills: skills.split(",").map(s => s.trim()).filter(Boolean),
  availability: availability,
  location: {
    city: location.trim()
  }
}

    await onSubmit(volunteer)

  } catch (err) {
    console.error("Submit error:", err)
  } finally {
    setIsSubmitting(false)
  }
}
    

    
    
  


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
            required
            className="glass-input"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="New York, NY"
            required
            className="glass-input"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Skills (comma separated)</Label>
        <Input
          id="skills"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="first aid, driving, cooking"
          required
          className="glass-input"
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="availability"
          checked={availability}
          onCheckedChange={setAvailability}
        />
        <Label htmlFor="availability" className="cursor-pointer">
          Available for assignments
        </Label>
      </div>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Spinner className="h-4 w-4 mr-2" />
              Adding...
            </>
          ) : (
            "Add Volunteer"
          )}
        </button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
