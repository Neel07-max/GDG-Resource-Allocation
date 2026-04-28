"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import type { Request } from "@/lib/api"

interface RequestFormProps {
  onSubmit: (request: Omit<Request, "id">) => Promise<void>
  onCancel: () => void
}

export function RequestForm({ onSubmit, onCancel }: RequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [type, setType] = useState<"food" | "medical" | "general">("food")
  const [urgency, setUrgency] = useState<number>(3)
  const [peopleCount, setPeopleCount] = useState("")
  const [location, setLocation] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const request: Omit<Request, "id"> = {
      type,
      urgency,
      people_count: parseInt(peopleCount) || 1,
      location: { city: location.trim() || "Unknown" },
    }

    await onSubmit(request)
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Request Type</Label>
          <Select value={type} onValueChange={(v: "food" | "medical" | "general") => setType(v)}>
            <SelectTrigger className="glass-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="food">Food</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="urgency">Urgency Level (1-5)</Label>
          <Input
            id="urgency"
            type="number"
            min="1"
            max="5"
            value={urgency}
            onChange={(e) => setUrgency(parseInt(e.target.value) || 3)}
            required
            className="glass-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location/City</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Kolkata, Delhi, Mumbai"
            required
            className="glass-input"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="peopleCount">Number of People</Label>
          <Input
            id="peopleCount"
            type="number"
            min="1"
            value={peopleCount}
            onChange={(e) => setPeopleCount(e.target.value)}
            placeholder="1"
            required
            className="glass-input"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Spinner className="h-4 w-4 mr-2" />
              Adding...
            </>
          ) : (
            "Add Request"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
