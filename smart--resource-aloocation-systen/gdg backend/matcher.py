"""
Matching Engine — Smart Resource Allocation System

Algorithm
─────────
1. For every open request, filter volunteers by:
   a) availability == True
   b) at least one skill matches the request type
2. Score each candidate:
      Score = (urgency × people_count) / (haversine_distance_km + 1)
   The +1 prevents division-by-zero and dampens distance advantage for
   hyper-local volunteers on low-urgency requests.
3. Pick the volunteer with the highest score per request.
4. Return all matches, sorted by score descending (done in main.py).
"""

import math
from typing import List, Dict, Any

from models import ResourceRequest, Volunteer


# ──────────────────────────────────────────────
# Skill Map  (request type → required skills)
# ──────────────────────────────────────────────

SKILL_MAP: Dict[str, List[str]] = {
    "medical": ["doctor", "nurse", "paramedic", "first_aid", "medical"],
    "food":    ["food_distribution", "chef", "cook", "logistics", "food"],
    "general": ["general", "coordination", "logistics", "driver", "first_aid"],
}


# ──────────────────────────────────────────────
# Distance
# ──────────────────────────────────────────────

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Return the great-circle distance in kilometres between two points
    given their latitudes and longitudes in decimal degrees.

    Formula: https://en.wikipedia.org/wiki/Haversine_formula
    """
    R = 6371.0  # Earth radius in km

    phi1, phi2   = math.radians(lat1), math.radians(lat2)
    dphi         = math.radians(lat2 - lat1)
    dlambda      = math.radians(lon2 - lon1)

    a = (math.sin(dphi / 2) ** 2
         + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2)

    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


# ──────────────────────────────────────────────
# Skill Matching
# ──────────────────────────────────────────────

def get_matching_skill(volunteer_skills: List[str], request_type: str) -> str | None:
    """
    Return the first volunteer skill that satisfies the request type,
    or None if no skill matches.
    """
    required = SKILL_MAP.get(request_type, [])
    volunteer_skills_lower = [s.lower() for s in volunteer_skills]
    for skill in required:
        if skill in volunteer_skills_lower:
            return skill
    return None


# ──────────────────────────────────────────────
# Scoring
# ──────────────────────────────────────────────

def compute_score(urgency: int, people_count: int, distance_km: float) -> float:
    """
    Score = (urgency × people_count) / (distance_km + 1)
    Higher score → higher priority match.
    Rounded to 4 decimal places for clean JSON output.
    """
    return round((urgency * people_count) / (distance_km + 1), 4)


# ──────────────────────────────────────────────
# Main Matching Function
# ──────────────────────────────────────────────

def match_volunteers_to_requests(
    requests:   List[ResourceRequest],
    volunteers: List[Volunteer],
) -> List[Dict[str, Any]]:
    """
    For each request, find the best available, skill-matched volunteer.
    Returns a list of match dicts (serialisable to JSON).
    """

    # Pre-filter: only available volunteers
    available_volunteers = [v for v in volunteers if v.availability]

    matches: List[Dict[str, Any]] = []

    for req in requests:
        candidates = []

        for vol in available_volunteers:
            matched_skill = get_matching_skill(vol.skills, req.type)
            if matched_skill is None:
                continue  # skill mismatch — skip

            dist_km = haversine_km(
                req.location.latitude,  req.location.longitude,
                vol.location.latitude,  vol.location.longitude,
            )
            score = compute_score(req.urgency, req.people_count, dist_km)

            candidates.append({
                "volunteer":     vol,
                "distance_km":   round(dist_km, 4),
                "score":         score,
                "skill_matched": matched_skill,
            })

        if not candidates:
            # No volunteer could be matched to this request
            matches.append({
                "request_id":     req.id,
                "request_type":   req.type,
                "urgency":        req.urgency,
                "people_count":   req.people_count,
                "volunteer_id":   None,
                "volunteer_name": None,
                "distance_km":    None,
                "score":          None,
                "skill_matched":  None,
                "status":         "unmatched",
            })
            continue

        # Pick the single best candidate (highest score)
        best = max(candidates, key=lambda c: c["score"])

        matches.append({
            "request_id":     req.id,
            "request_type":   req.type,
            "urgency":        req.urgency,
            "people_count":   req.people_count,
            "volunteer_id":   best["volunteer"].id,
            "volunteer_name": best["volunteer"].name,
            "distance_km":    best["distance_km"],
            "score":          best["score"],
            "skill_matched":  best["skill_matched"],
            "status":         "matched",
        })

    return matches
