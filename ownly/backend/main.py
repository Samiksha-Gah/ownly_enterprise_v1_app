from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import os
import uuid
import time
import random
from datetime import datetime, timedelta

# Configuration
DEMO = os.getenv("DEMO", "true").lower() == "true"
CORS_ORIGIN = os.getenv("CORS_ORIGIN", "*")
API_HOST = os.getenv("API_HOST", "http://localhost:8000")

app = FastAPI(title="Ownly Enterprise API", version="0.1.0")

# Most permissive CORS settings for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Simple middleware to add CORS headers
@app.middleware("http")
async def add_cors_header(request: Request, call_next):
    response = await call_next(request)
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    return response

# In-memory storage for demo
GENERATED_DATASETS = {}

# Mock data
DATASET_CATALOG = [
    {
        "id": "duo_airbnb_italian",
        "title": "Language Learning × Travel (Italian)",
        "domains": ["education", "travel"],
        "description": "Combined dataset of Duolingo language learning progress and Airbnb bookings in Italy",
        "est_users": 12473,
        "freshness": "real-time",
        "pricing_per_user_day": 0.02,
        "sample_fields": ["user_id", "language", "lessons_completed", "streak_days", "airbnb_city", "accommodation_type", "nights_booked", "booking_value_usd", "timestamp"],
        "sources": [
            {
                "id": "duolingo_italian",
                "name": "Duolingo Italian Learners",
                "users": 8500,
                "freshness": "daily",
                "price_per_user_day": 0.015,
                "description": "Language learning progress for Italian learners",
                "fields": ["user_id", "language", "lessons_completed", "streak_days", "xp_points", "last_active", "learning_streak"]
            },
            {
                "id": "airbnb_italy",
                "name": "Airbnb Italy Listings",
                "users": 3973,
                "freshness": "hourly",
                "price_per_user_day": 0.025,
                "description": "Booking data for Airbnb properties in Italy",
                "fields": ["user_id", "airbnb_city", "accommodation_type", "check_in_date", "check_out_date", "nights_booked", "booking_value_usd", "is_superhost"]
            }
        ]
    },
    {
        "id": "fitness_grocery_ca",
        "title": "Fitness × Grocery (California)",
        "domains": ["health", "retail"],
        "description": "Fitness tracking data correlated with grocery purchases in California",
        "est_users": 18200,
        "freshness": "15s",
        "pricing_per_user_day": 0.018,
        "sample_fields": ["user_id", "steps_per_day", "avg_grocery_spend", "zip_code", "timestamp"]
    },
    {
        "id": "streaming_ecom_global",
        "title": "Streaming × E-commerce (Global)",
        "domains": ["media", "retail"],
        "description": "Music streaming activity combined with e-commerce purchase data worldwide",
        "est_users": 98000,
        "freshness": "5m",
        "pricing_per_user_day": 0.01,
        "sample_fields": ["user_id", "artist", "plays_last_7d", "avg_order_value", "timestamp"]
    }
]

# Pydantic models
class PlanRequest(BaseModel):
    query: str

class Source(BaseModel):
    id: str
    name: str
    users: int
    freshness: str
    price_per_user_day: float

class PlanResponse(BaseModel):
    query: str
    detected_domains: List[str]
    sources: List[Source]
    estimated_users: int
    estimated_monthly_cost: float

class GenerateRequest(BaseModel):
    dataset_id: str
    selected_sources: List[str]

class GenerateResponse(BaseModel):
    dataset_id: str
    endpoint: str
    selected_sources: List[str]
    active_consents: int
    est_users: int
    updates_every: str
    sample: List[Dict[str, Any]]

# Helper functions
def generate_sample_data(dataset_id: str, count: int = 3):
    """Generate sample data for a dataset"""
    samples = []
    cities = ["Rome", "Florence", "Venice", "Milan", "Naples", "Bologna", "Verona"]
    accommodation_types = ["Entire apartment", "Private room", "Shared room", "Hotel room"]
    
    for i in range(count):
        if dataset_id == "duo_airbnb_italian":
            user_id = f"user_{i+1000}"
            lessons = random.randint(5, 150)
            streak = random.randint(1, 365)
            nights = random.randint(1, 14)
            booking_value = round(random.uniform(50.0, 500.0) * nights, 2)
            
            samples.append({
                "user_id": user_id,
                "language": "Italian",
                "lessons_completed": lessons,
                "streak_days": streak,
                "xp_points": lessons * 10 + random.randint(10, 50),
                "last_active": (datetime.utcnow() - timedelta(hours=random.randint(0, 23))).isoformat(),
                "learning_streak": f"{streak} days",
                "airbnb_city": random.choice(cities),
                "accommodation_type": random.choice(accommodation_types),
                "check_in_date": (datetime.utcnow() + timedelta(days=random.randint(1, 30))).strftime("%Y-%m-%d"),
                "check_out_date": (datetime.utcnow() + timedelta(days=random.randint(31, 60))).strftime("%Y-%m-%d"),
                "nights_booked": nights,
                "booking_value_usd": booking_value,
                "is_superhost": random.choice([True, False]),
                "timestamp": datetime.utcnow().isoformat(),
                "estimated_fluency": f"{min(100, int(lessons * 0.8))}%"
            })
        elif dataset_id == "fitness_grocery_ca":
            samples.append({
                "user_id": f"user_{i+2000}",
                "steps_per_day": random.randint(3000, 15000),
                "avg_grocery_spend": round(random.uniform(25.0, 150.0), 2),
                "zip_code": random.choice(["94105", "90001", "95014"]),
                "timestamp": (datetime.utcnow() - timedelta(days=random.randint(0, 7))).isoformat()
            })
        else:
            samples.append({
                "user_id": f"user_{i+3000}",
                "sample_field": f"Sample data {i+1}",
                "value": random.randint(1, 100),
                "timestamp": datetime.utcnow().isoformat()
            })
    return samples

# API endpoints
@app.get("/health")
async def health_check():
    return {"ok": True, "demo": DEMO}

@app.get("/v1/datasets/catalog")
async def get_catalog():
    return {"datasets": DATASET_CATALOG}

@app.get("/v1/datasets/{dataset_id}/preview")
async def get_preview(dataset_id: str):
    dataset = next((d for d in DATASET_CATALOG if d["id"] == dataset_id), None)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    return {
        "dataset": dataset,
        "sample": generate_sample_data(dataset_id, 5)
    }

@app.post("/v1/datasets/plan", response_model=PlanResponse)
async def plan_dataset(request: PlanRequest):
    # Simple keyword-based domain detection
    query = request.query.lower()
    detected_domains = set()
    
    # Check for language learning related terms
    language_terms = ["language", "learn", "learning", "duolingo", "fluent", "fluency", "speak", "study"]
    travel_terms = ["travel", "airbnb", "hotel", "accommodation", "rental", "vacation", "trip"]
    
    # Special case for language learning + travel/airbnb combo
    if (any(term in query for term in language_terms) and 
        any(term in query for term in travel_terms)):
        # Return the specific Italian language + Airbnb dataset
        return {
            "query": request.query,
            "detected_domains": ["education", "travel"],
            "sources": [
                {
                    "id": "duo_airbnb_italian",
                    "name": "Language Learning × Travel (Italian)",
                    "users": 12473,
                    "freshness": "real-time",
                    "price_per_user_day": 0.02
                }
            ],
            "estimated_users": 12473,
            "estimated_monthly_cost": 12473 * 0.02 * 30  # users * price_per_user_day * days_in_month
        }
    
    # Regular domain detection for other queries
    if any(term in query for term in language_terms):
        detected_domains.update(["education"])
    if any(term in query for term in travel_terms):
        detected_domains.update(["travel"])
    if any(word in query for word in ["fitness", "health", "workout", "exercise"]):
        detected_domains.update(["health"])
    if any(word in query for word in ["shop", "retail", "grocery", "purchase"]):
        detected_domains.update(["retail"])
    if any(word in query for word in ["music", "streaming", "spotify", "playlist"]):
        detected_domains.update(["media"])
    
    # Default to health and retail if no domains detected
    if not detected_domains:
        detected_domains = {"health", "retail"}
    
    # Create mock sources based on domains
    sources = []
    if "education" in detected_domains:
        sources.append({
            "id": "duolingo",
            "name": "Duolingo Learning Data",
            "users": 5000000,
            "freshness": "real-time",
            "price_per_user_day": 0.005
        })
    if "travel" in detected_domains:
        sources.append({
            "id": "airbnb",
            "name": "Airbnb Booking Data",
            "users": 15000000,
            "freshness": "1h",
            "price_per_user_day": 0.007
        })
    if "health" in detected_domains:
        sources.append({
            "id": "strava",
            "name": "Strava Fitness Data",
            "users": 10000000,
            "freshness": "5m",
            "price_per_user_day": 0.004
        })
    if "retail" in detected_domains:
        sources.append({
            "id": "amazon_fresh",
            "name": "Amazon Fresh Purchases",
            "users": 20000000,
            "freshness": "1d",
            "price_per_user_day": 0.003
        })
    if "media" in detected_domains:
        sources.append({
            "id": "spotify",
            "name": "Spotify Streaming Data",
            "users": 50000000,
            "freshness": "real-time",
            "price_per_user_day": 0.002
        })
    
    # Calculate estimated users and cost
    estimated_users = sum(s["users"] for s in sources) // (len(sources) or 1)  # Average of sources
    estimated_monthly_cost = round(sum(s["price_per_user_day"] for s in sources) * estimated_users * 30, 2)
    
    return {
        "query": request.query,
        "detected_domains": list(detected_domains),
        "sources": sources,
        "estimated_users": estimated_users,
        "estimated_monthly_cost": estimated_monthly_cost
    }

@app.post("/v1/datasets/generate", response_model=GenerateResponse)
async def generate_dataset(request: GenerateRequest):
    # In a real app, this would create a dataset and return a real endpoint
    dataset_id = f"ds_{str(uuid.uuid4())[:8]}"
    endpoint = f"{API_HOST}/v1/streams/{dataset_id}"
    
    # Store the dataset info for the stream endpoint
    GENERATED_DATASETS[dataset_id] = {
        "created_at": datetime.utcnow(),
        "sources": request.selected_sources,
        "last_accessed": datetime.utcnow()
    }
    
    # Generate sample data
    sample = generate_sample_data(request.dataset_id, 3)
    
    return {
        "dataset_id": dataset_id,
        "endpoint": endpoint,
        "selected_sources": request.selected_sources,
        "active_consents": random.randint(500, 5000),
        "est_users": random.randint(1000, 10000),
        "updates_every": "5s",
        "sample": sample
    }

@app.get("/v1/streams/{dataset_id}")
async def get_stream(dataset_id: str):
    if dataset_id not in GENERATED_DATASETS:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    # Update last accessed time
    GENERATED_DATASETS[dataset_id]["last_accessed"] = datetime.utcnow()
    
    # Return a new row of data
    return {
        "dataset_id": dataset_id,
        "rows": [generate_sample_data(dataset_id, 1)[0]]
    }

@app.post("/v1/api_keys/create")
async def create_api_key():
    return {
        "api_key": f"demo_live_{str(uuid.uuid4()).replace('-', '')}",
        "note": "demo only"
    }

from fastapi.responses import JSONResponse

# Middleware to check API key in demo mode
@app.middleware("http")
async def check_api_key(request: Request, call_next):
    # Skip API key check for health endpoint and docs
    if request.url.path in ["/health", "/docs", "/openapi.json", "/redoc"]:
        return await call_next(request)
        
    if DEMO:
        api_key = request.headers.get("x-api-key") or request.headers.get("X-API-Key")
        if not api_key or not api_key.startswith("demo_"):
            return JSONResponse(
                status_code=401,
                content={"error": "Invalid or missing API key. Use a key starting with 'demo_' for demo mode."}
            )
    
    return await call_next(request)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
