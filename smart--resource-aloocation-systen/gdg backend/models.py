"""
Pydantic Models — Smart Resource Allocation System
Defines data shapes for requests, volunteers, and match results.
"""

from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict
from enum import Enum
from typing import Optional


# ──────────────────────────────────────────────
# Enums
# ──────────────────────────────────────────────

class ResourceType(str, Enum):
    food    = "food"
    medical = "medical"
    general = "general"


# ──────────────────────────────────────────────
# Location
# ──────────────────────────────────────────────

class Location(BaseModel):
    city: str

# ──────────────────────────────────────────────
# Resource Request
# ──────────────────────────────────────────────

class ResourceRequest(BaseModel):
    id:           Optional[str] = Field(None, description="Unique request identifier, e.g. 'req-001'")
    type:         ResourceType = Field(..., description="Type of resource needed")
    urgency:      int          = Field(..., ge=1, le=5, description="Urgency level 1 (low) to 5 (critical)")
    people_count: int          = Field(..., ge=1, description="Number of people affected")
    location:     Location     = Field(..., description="Geographic location of the request")
    timestamp:    Optional[str] = Field(None, description="ISO 8601 timestamp; auto-set if omitted")

    class Config:
        use_enum_values = True

    # Accept both nested Location object and flat dict
    @validator("location", pre=True)
    def parse_location(cls, v):
        if isinstance(v, dict):
            return Location(**v)
        return v


# ──────────────────────────────────────────────
# Volunteer
# ──────────────────────────────────────────────

class Volunteer(BaseModel):
    id:           Optional[str] = Field(None, description="Unique volunteer identifier, e.g. 'vol-001'")
    name:         str        = Field(..., min_length=1, description="Full name of the volunteer")
    skills:       List[str]  = Field(..., description="List of skills, e.g. ['doctor', 'first_aid']")
    availability: bool       = Field(..., description="True if volunteer is currently available")
    location:     Location   = Field(..., description="Volunteer's current geographic location")

    @validator("location", pre=True)
    def parse_location(cls, v):
        if isinstance(v, dict):
            return Location(**v)
        return v


# ──────────────────────────────────────────────
# Match Result
# ──────────────────────────────────────────────

class MatchResult(BaseModel):
    request_id:     str
    request_type:   str
    urgency:        int
    people_count:   int
    volunteer_id:   str
    volunteer_name: str
    distance_km:    float = Field(..., description="Haversine distance in kilometres")
    score:          float = Field(..., description="Score = (urgency × people_count) / (distance_km + 1)")
    skill_matched:  str   = Field(..., description="The skill that triggered this match")
