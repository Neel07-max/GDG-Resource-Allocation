const API_BASE = "http://127.0.0.1:8000"

export interface Volunteer {
  id?: string
  name: string
  skills: string[]
  availability: boolean
  location: { city: string }
}

export interface Request {
  id?: string
  type: "food" | "medical" | "general"
  urgency: number
  people_count: number
  location: { city: string }
  timestamp?: string
}




export async function fetchVolunteers(): Promise<Volunteer[]> {
  const res = await fetch(`${API_BASE}/volunteers`)

  if (!res.ok) throw new Error("Failed to fetch volunteers")

  const data = await res.json()
  return data.volunteers || []
}



/*1. POST /requests
Request body format:
{
  "id": "string",
  "type": "food" | "medical" | "general",
  "urgency": number (1–5),
  "people_count": number,
  "location": {
    "latitude": number,
    "longitude": number
  }
}
  */

/*2. POST /volunteers
Request body format:
{
  "id": "string",
  "name": "string",
  "skills": ["string"]
}*/
  


export async function addVolunteer(volunteer: any) {
  const id = Date.now().toString()

  const skillsArray = volunteer.skills
    

  console.log("SENDING DATA:", {
    id,
    name: volunteer.name,
    skills: skillsArray
  })

  const res = await fetch(`${API_BASE}/volunteers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  id: Date.now().toString(),
  name: volunteer.name || "Test",
  skills: Array.isArray(volunteer.skills)
  ? volunteer.skills
  : volunteer.skills?.split(",").map((s: string) => s.trim()) || [],
  location: volunteer.location,
  availability: volunteer.availability ?? true
})
  })

  const data = await res.json()
console.log("RESPONSE:", data)

if (!res.ok) {
  console.error("ERROR FROM BACKEND:", data)
  throw new Error("Failed to add volunteer")
}

return data
}




      
    
  

  

    
      
    
  

  

  

export async function fetchRequests(): Promise<Request[]> {
  const res = await fetch(`${API_BASE}/requests`)
  if (!res.ok) throw new Error("Failed to fetch requests")
  const data = await res.json()
  return data.requests || []
}

export async function addRequest(request: Omit<Request, "id">): Promise<Request> {
  const res = await fetch(`${API_BASE}/requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  })
  if (!res.ok) throw new Error("Failed to add request")
  return res.json()
}

// Utility to check skill matches
export function findMatchingSkills(
  volunteerSkills: string[],
  requiredSkills: string[]
): string[] {
  const normalizedVolunteerSkills = volunteerSkills.map((s) => s.toLowerCase().trim())
  const normalizedRequiredSkills = requiredSkills.map((s) => s.toLowerCase().trim())
  
  return normalizedRequiredSkills.filter((skill) =>
    normalizedVolunteerSkills.includes(skill)
  )
}
