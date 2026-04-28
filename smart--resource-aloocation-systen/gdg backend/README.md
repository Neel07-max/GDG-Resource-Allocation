# 🚨 Smart Resource Allocation System

A hackathon-ready FastAPI backend that matches volunteers to resource requests
using a skill-aware, proximity-weighted scoring engine.

---

## 📁 Project Structure

```
smart_resource_api/
├── main.py           # FastAPI app, routes, startup seeding
├── models.py         # Pydantic models (ResourceRequest, Volunteer, MatchResult)
├── storage.py        # In-memory dicts (swap with DB later)
├── matcher.py        # Matching engine + Haversine distance + scoring
├── requirements.txt
├── test_api.sh       # cURL smoke tests
└── README.md
```

---

## ⚡ Quick Start

### 1. Create a virtual environment

```bash
cd smart_resource_api
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the server

```bash
uvicorn main:app --reload --port 8000
```

Server is live at → **http://localhost:8000**

---

## 🌐 Interactive API Docs

FastAPI auto-generates Swagger UI — open in your browser:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:**       http://localhost:8000/redoc

---

## 📡 Endpoints

| Method | Path          | Description                                      |
|--------|---------------|--------------------------------------------------|
| GET    | `/`           | Health check                                     |
| POST   | `/requests`   | Add a new resource request                       |
| POST   | `/volunteers` | Register a new volunteer                         |
| GET    | `/requests`   | List all requests                                |
| GET    | `/volunteers` | List all volunteers                              |
| GET    | `/match`      | Run matching engine, returns best volunteer/req  |

---

## 📦 Sample Payloads

### POST /requests
```json
{
  "id": "req-001",
  "type": "medical",
  "urgency": 5,
  "people_count": 3,
  "location": { "latitude": 22.5726, "longitude": 88.3639 }
}
```
`type` → `"food"` | `"medical"` | `"general"`
`urgency` → `1` (low) to `5` (critical)

### POST /volunteers
```json
{
  "id": "vol-001",
  "name": "Dr. Priya Sharma",
  "skills": ["doctor", "first_aid"],
  "availability": true,
  "location": { "latitude": 22.5730, "longitude": 88.3645 }
}
```

---

## 🔢 Scoring Formula

```
Score = (urgency × people_count) / (haversine_distance_km + 1)
```

- **Higher urgency** → higher priority
- **More people affected** → higher priority
- **Closer volunteer** → higher score
- `+1` prevents division-by-zero and keeps nearby matches from dominating

---

## 🎯 Skill Map

| Request Type | Accepted Volunteer Skills                                 |
|--------------|-----------------------------------------------------------|
| `medical`    | doctor, nurse, paramedic, first_aid, medical              |
| `food`       | food_distribution, chef, cook, logistics, food            |
| `general`    | general, coordination, logistics, driver, first_aid       |

---

## 🧪 Run Tests

```bash
chmod +x test_api.sh
./test_api.sh
```

---

## 🔄 Upgrade Path (Post-Hackathon)

| Now (MVP)            | Later                             |
|----------------------|-----------------------------------|
| In-memory dict       | SQLite / PostgreSQL               |
| Simple skill list    | Vector-based skill similarity     |
| Single best match    | Top-N matches with ranking        |
| No auth              | JWT / OAuth2                      |
| Polling `/match`     | WebSocket live updates            |
