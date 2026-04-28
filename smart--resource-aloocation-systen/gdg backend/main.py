"""
Smart Resource Allocation System — FastAPI Backend
Hackathon MVP | In-memory storage | Haversine distance | Scoring engine
"""

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from typing import List, Optional
from datetime import datetime
import math
from fastapi.middleware.cors import CORSMiddleware

from models import ResourceRequest, ResourceType, Volunteer, MatchResult, Location
from storage import requests_db, volunteers_db
from matcher import match_volunteers_to_requests

# ──────────────────────────────────────────────
# App Setup
# ──────────────────────────────────────────────

app = FastAPI(
    title="Smart Resource Allocation System",
    description="Matches volunteers to resource requests using urgency, skill, and proximity scoring.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ──────────────────────────────────────────────
# Startup: Seed Sample Data
# ──────────────────────────────────────────────

@app.on_event("startup")
def seed_sample_data():
    """Pre-load sample requests and volunteers for demo/testing."""

    sample_requests = [
        ResourceRequest(
            id="req-001",
            type=ResourceType.medical,
            urgency=5,
            people_count=3,
            location=Location(city="kolkata"),
            timestamp=datetime.utcnow().isoformat(),
        ),
        ResourceRequest(
            id="req-002",
            type=ResourceType.food,
            urgency=3,
            people_count=10,
            location=Location(city="Delhi"),
            timestamp=datetime.utcnow().isoformat(),
        ),
        ResourceRequest(
            id="req-003",
            type=ResourceType.general,
            urgency=2,
            people_count=5,
            location=Location(city="Mumbai"),
            timestamp=datetime.utcnow().isoformat(),
        ),
    ]

    sample_volunteers = [
        Volunteer(
            id="vol-001",
            name="Dr. Priya Sharma",
            skills=["doctor", "first_aid"],
            availability=True,
            location=Location(city="kolkata"),
        ),
        Volunteer(
            id="vol-002",
            name="Ravi Kumar",
            skills=["food_distribution", "logistics"],
            availability=True,
            location=Location(city="Delhi"),
        ),
        Volunteer(
            id="vol-003",
            name="Ananya Das",
            skills=["general", "coordination"],
            availability=False,  # unavailable — should be excluded
            location=Location(city="Mumbai"),
        ),
        Volunteer(
            id="vol-004",
            name="Mohan Lal",
            skills=["general", "first_aid"],
            availability=True,
            location=Location(city="Bangalore"),
        ),
    ]

    for req in sample_requests:
        requests_db[req.id] = req
    for vol in sample_volunteers:
        volunteers_db[vol.id] = vol

    print(f"✅ Seeded {len(sample_requests)} requests and {len(sample_volunteers)} volunteers.")


# ──────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────

@app.get("/", tags=["Health"])
def root():
    return {"status": "running", "message": "Smart Resource Allocation API is live 🚀"}


@app.post("/requests", status_code=201, tags=["Resources"])
def add_request(request: ResourceRequest):
    """Add a new resource request (food, medical, general)."""
    if request.id in requests_db:
        raise HTTPException(status_code=409, detail=f"Request ID '{request.id}' already exists.")
    if not request.timestamp:
        request.timestamp = datetime.utcnow().isoformat()
    requests_db[request.id] = request
    return {"message": "Resource request added successfully.", "request": request}


@app.post("/volunteers", status_code=201, tags=["Volunteers"])
def add_volunteer(volunteer: Volunteer):
    """Register a new volunteer with skills and location."""
    if volunteer.id in volunteers_db:
        raise HTTPException(status_code=409, detail=f"Volunteer ID '{volunteer.id}' already exists.")
    volunteers_db[volunteer.id] = volunteer
    return {"message": "Volunteer registered successfully.", "volunteer": volunteer}


@app.get("/requests", tags=["Resources"])
def get_all_requests():
    """Retrieve all submitted resource requests."""
    return {
        "total": len(requests_db),
        "requests": list(requests_db.values()),
    }


@app.get("/volunteers", tags=["Volunteers"])
def get_all_volunteers():
    """Retrieve all registered volunteers."""
    return {
        "total": len(volunteers_db),
        "volunteers": list(volunteers_db.values()),
    }


@app.get("/match", tags=["Matching Engine"])
def get_matches():
    """
    Run the matching engine.
    Returns the best available volunteer for each request,
    sorted by score (highest first).
    Score = (urgency × people_count) / (distance_km + 1)
    """
    if not requests_db:
        raise HTTPException(status_code=404, detail="No resource requests found.")
    if not volunteers_db:
        raise HTTPException(status_code=404, detail="No volunteers registered.")

    matches = match_volunteers_to_requests(
        requests=list(requests_db.values()),
        volunteers=list(volunteers_db.values()),
    )

    if not matches:
        return {"message": "No suitable matches found.", "matches": []}

    # Sort by score descending
    matches.sort(key=lambda m: m["score"], reverse=True)

    return {
        "total_matches": len(matches),
        "matches": matches,
    }
