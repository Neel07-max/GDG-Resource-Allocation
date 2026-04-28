#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# test_api.sh  —  Quick smoke-test for the Resource Allocation API
# Usage:  chmod +x test_api.sh && ./test_api.sh
# Server must be running at http://localhost:8000
# ─────────────────────────────────────────────────────────────

BASE="http://localhost:8000"
HR="─────────────────────────────────────────────"

echo "$HR"
echo "  Smart Resource Allocation API — Test Suite"
echo "$HR"

# ── Health Check ──────────────────────────────
echo ""
echo "▶ GET / (Health Check)"
curl -s "$BASE/" | python3 -m json.tool

# ── Add a new Request ─────────────────────────
echo ""
echo "$HR"
echo "▶ POST /requests (Add a new medical request)"
curl -s -X POST "$BASE/requests" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "req-999",
    "type": "medical",
    "urgency": 4,
    "people_count": 7,
    "location": { "latitude": 22.5740, "longitude": 88.3650 }
  }' | python3 -m json.tool

# ── Add a new Volunteer ───────────────────────
echo ""
echo "$HR"
echo "▶ POST /volunteers (Add a new volunteer)"
curl -s -X POST "$BASE/volunteers" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "vol-999",
    "name": "Sneha Roy",
    "skills": ["nurse", "first_aid"],
    "availability": true,
    "location": { "latitude": 22.5745, "longitude": 88.3655 }
  }' | python3 -m json.tool

# ── List All Requests ─────────────────────────
echo ""
echo "$HR"
echo "▶ GET /requests"
curl -s "$BASE/requests" | python3 -m json.tool

# ── List All Volunteers ───────────────────────
echo ""
echo "$HR"
echo "▶ GET /volunteers"
curl -s "$BASE/volunteers" | python3 -m json.tool

# ── Run Matching Engine ───────────────────────
echo ""
echo "$HR"
echo "▶ GET /match  (Run matching engine)"
curl -s "$BASE/match" | python3 -m json.tool

echo ""
echo "$HR"
echo "✅  All tests done."
echo "$HR"
