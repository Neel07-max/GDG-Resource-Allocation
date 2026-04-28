"""
In-Memory Storage — Smart Resource Allocation System
Simple dict-based stores for hackathon-speed development.
Swap with SQLite/Postgres by replacing these dicts with DB calls.
"""

from typing import Dict
# These are imported by main.py and matcher.py — single source of truth.

requests_db:   Dict[str, object] = {}   # { request_id  → ResourceRequest }
volunteers_db: Dict[str, object] = {}   # { volunteer_id → Volunteer       }
