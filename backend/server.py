from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from datetime import datetime, timezone, timedelta
from pathlib import Path
import os, logging, math, httpx, numpy as np
from sklearn.linear_model import LinearRegression

load_dotenv(Path(__file__).parent / ".env")

app = FastAPI(title="Weather Predictor API")
logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
log = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

# ── Cities ─────────────────────────────────────────────────────────────────
CITIES = [
    {"name": "New York", "country": "US", "lat": 40.7128, "lon": -74.0060},
    {"name": "Los Angeles", "country": "US", "lat": 34.0522, "lon": -118.2437},
    {"name": "Chicago", "country": "US", "lat": 41.8781, "lon": -87.6298},
    {"name": "Houston", "country": "US", "lat": 29.7604, "lon": -95.3698},
    {"name": "Miami", "country": "US", "lat": 25.7617, "lon": -80.1918},
    {"name": "San Francisco", "country": "US", "lat": 37.7749, "lon": -122.4194},
    {"name": "Toronto", "country": "CA", "lat": 43.6532, "lon": -79.3832},
    {"name": "Mexico City", "country": "MX", "lat": 19.4326, "lon": -99.1332},
    {"name": "Sao Paulo", "country": "BR", "lat": -23.5505, "lon": -46.6333},
    {"name": "Buenos Aires", "country": "AR", "lat": -34.6037, "lon": -58.3816},
    {"name": "Lima", "country": "PE", "lat": -12.0464, "lon": -77.0428},
    {"name": "Bogota", "country": "CO", "lat": 4.7110, "lon": -74.0721},
    {"name": "London", "country": "UK", "lat": 51.5074, "lon": -0.1278},
    {"name": "Paris", "country": "FR", "lat": 48.8566, "lon": 2.3522},
    {"name": "Berlin", "country": "DE", "lat": 52.5200, "lon": 13.4050},
    {"name": "Madrid", "country": "ES", "lat": 40.4168, "lon": -3.7038},
    {"name": "Rome", "country": "IT", "lat": 41.9028, "lon": 12.4964},
    {"name": "Amsterdam", "country": "NL", "lat": 52.3676, "lon": 4.9041},
    {"name": "Moscow", "country": "RU", "lat": 55.7558, "lon": 37.6173},
    {"name": "Istanbul", "country": "TR", "lat": 41.0082, "lon": 28.9784},
    {"name": "Cairo", "country": "EG", "lat": 30.0444, "lon": 31.2357},
    {"name": "Lagos", "country": "NG", "lat": 6.5244, "lon": 3.3792},
    {"name": "Nairobi", "country": "KE", "lat": -1.2921, "lon": 36.8219},
    {"name": "Johannesburg", "country": "ZA", "lat": -26.2041, "lon": 28.0473},
    {"name": "Cape Town", "country": "ZA", "lat": -33.9249, "lon": 18.4241},
    {"name": "Dubai", "country": "AE", "lat": 25.2048, "lon": 55.2708},
    {"name": "Riyadh", "country": "SA", "lat": 24.7136, "lon": 46.6753},
    {"name": "Tehran", "country": "IR", "lat": 35.6892, "lon": 51.3890},
    {"name": "Mumbai", "country": "IN", "lat": 19.0760, "lon": 72.8777},
    {"name": "New Delhi", "country": "IN", "lat": 28.6139, "lon": 77.2090},
    {"name": "Bangalore", "country": "IN", "lat": 12.9716, "lon": 77.5946},
    {"name": "Kolkata", "country": "IN", "lat": 22.5726, "lon": 88.3639},
    {"name": "Karachi", "country": "PK", "lat": 24.8607, "lon": 67.0011},
    {"name": "Dhaka", "country": "BD", "lat": 23.8103, "lon": 90.4125},
    {"name": "Bangkok", "country": "TH", "lat": 13.7563, "lon": 100.5018},
    {"name": "Singapore", "country": "SG", "lat": 1.3521, "lon": 103.8198},
    {"name": "Jakarta", "country": "ID", "lat": -6.2088, "lon": 106.8456},
    {"name": "Kuala Lumpur", "country": "MY", "lat": 3.1390, "lon": 101.6869},
    {"name": "Ho Chi Minh City", "country": "VN", "lat": 10.8231, "lon": 106.6297},
    {"name": "Manila", "country": "PH", "lat": 14.5995, "lon": 120.9842},
    {"name": "Beijing", "country": "CN", "lat": 39.9042, "lon": 116.4074},
    {"name": "Shanghai", "country": "CN", "lat": 31.2304, "lon": 121.4737},
    {"name": "Hong Kong", "country": "CN", "lat": 22.3193, "lon": 114.1694},
    {"name": "Tokyo", "country": "JP", "lat": 35.6762, "lon": 139.6503},
    {"name": "Osaka", "country": "JP", "lat": 34.6937, "lon": 135.5023},
    {"name": "Seoul", "country": "KR", "lat": 37.5665, "lon": 126.9780},
    {"name": "Sydney", "country": "AU", "lat": -33.8688, "lon": 151.2093},
    {"name": "Melbourne", "country": "AU", "lat": -37.8136, "lon": 144.9631},
    {"name": "Auckland", "country": "NZ", "lat": -36.8485, "lon": 174.7633},
    {"name": "Reykjavik", "country": "IS", "lat": 64.1466, "lon": -21.9426},
    {"name": "Stockholm", "country": "SE", "lat": 59.3293, "lon": 18.0686},
    {"name": "Oslo", "country": "NO", "lat": 59.9139, "lon": 10.7522},
    {"name": "Helsinki", "country": "FI", "lat": 60.1699, "lon": 24.9384},
    {"name": "Lisbon", "country": "PT", "lat": 38.7223, "lon": -9.1393},
    {"name": "Athens", "country": "GR", "lat": 37.9838, "lon": 23.7275},
    {"name": "Warsaw", "country": "PL", "lat": 52.2297, "lon": 21.0122},
    {"name": "Havana", "country": "CU", "lat": 23.1136, "lon": -82.3666},
    {"name": "Santiago", "country": "CL", "lat": -33.4489, "lon": -70.6693},
    {"name": "Anchorage", "country": "US", "lat": 61.2181, "lon": -149.9003},
    {"name": "Denver", "country": "US", "lat": 39.7392, "lon": -104.9903},
]

# ── Models ──────────────────────────────────────────────────────────────────
class PointRequest(BaseModel):
    lat: float = Field(..., ge=-90, le=90)
    lon: float = Field(..., ge=-180, le=180)

# ── Helpers ─────────────────────────────────────────────────────────────────
def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    dlat, dlon = math.radians(lat2 - lat1), math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon/2)**2
    return R * 2 * math.asin(math.sqrt(a))

def nearest_city(lat, lon):
    return min(CITIES, key=lambda c: haversine(lat, lon, c["lat"], c["lon"]))

# ── Open-Meteo ──────────────────────────────────────────────────────────────
async def get_current(lat, lon):
    async with httpx.AsyncClient(timeout=15) as c:
        r = await c.get("https://api.open-meteo.com/v1/forecast", params={
            "latitude": lat, "longitude": lon,
            "current": "temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation",
            "timezone": "auto",
        })
        r.raise_for_status()
    cur = r.json().get("current", {})
    return {
        "temperature": cur.get("temperature_2m", 0),
        "humidity": cur.get("relative_humidity_2m", 0),
        "wind_speed": cur.get("wind_speed_10m", 0),
        "precipitation": cur.get("precipitation", 0),
    }

async def get_history(lat, lon, days=30):
    end = datetime.now(timezone.utc).date() - timedelta(days=2)
    start = end - timedelta(days=days)
    async with httpx.AsyncClient(timeout=15) as c:
        r = await c.get("https://archive-api.open-meteo.com/v1/archive", params={
            "latitude": lat, "longitude": lon,
            "start_date": str(start), "end_date": str(end),
            "daily": "temperature_2m_mean", "timezone": "auto",
        })
        r.raise_for_status()
    daily = r.json().get("daily", {})
    return daily.get("time", []), daily.get("temperature_2m_mean", [])

# ── Forecast ─────────────────────────────────────────────────────────────────
def make_forecast(dates, temps, days_ahead=4):
    valid = [(i, t) for i, t in enumerate(temps) if t is not None]
    today = datetime.now(timezone.utc).date()
    if len(valid) < 3:
        avg = float(np.mean([t for _, t in valid])) if valid else 20.0
        return (
            [{"date": str(today + timedelta(days=d+1)), "temperature": round(avg + float(np.random.uniform(-1, 1)), 1)} for d in range(days_ahead)],
            {"model": "fallback_average", "mae": None, "training_samples": len(valid)},
        )
    X = np.array([i for i, _ in valid]).reshape(-1, 1)
    y = np.array([t for _, t in valid])
    m = LinearRegression().fit(X, y)
    last = max(i for i, _ in valid)
    preds = m.predict(np.array([last + i for i in range(1, days_ahead+1)]).reshape(-1, 1))
    mae = float(np.mean(np.abs(y - m.predict(X))))
    return (
        [{"date": str(today + timedelta(days=i+1)), "temperature": round(float(p), 1)} for i, p in enumerate(preds)],
        {"model": "LinearRegression", "mae": round(mae, 2), "training_samples": len(valid),
         "coefficient": round(float(m.coef_[0]), 4), "intercept": round(float(m.intercept_), 2)},
    )

# ── Routes ───────────────────────────────────────────────────────────────────
@app.get("/api/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}

@app.get("/api/cities")
async def cities():
    return {"cities": CITIES}

@app.post("/api/weather/point")
async def weather_point(req: PointRequest):
    try:
        city = nearest_city(req.lat, req.lon)
        dist = haversine(req.lat, req.lon, city["lat"], city["lon"])
        city_name = city["name"] if dist < 150 else f"({req.lat:.2f}, {req.lon:.2f})"
        country = city["country"] if dist < 150 else ""
        current = await get_current(req.lat, req.lon)
        try:
            dates, temps = await get_history(req.lat, req.lon)
        except Exception as e:
            log.warning(f"History fetch failed: {e}")
            dates, temps = [], []
        forecast, model_info = make_forecast(dates, temps)
        return {
            "location": {"city": city_name, "country": country, "lat": round(req.lat, 4), "lon": round(req.lon, 4)},
            "current": current,
            "forecast": forecast,
            "model_info": model_info,
        }
    except httpx.HTTPError as e:
        log.error(f"Weather API error: {e}")
        raise HTTPException(502, "Weather data service unavailable")
    except Exception as e:
        log.error(f"Unexpected: {e}")
        raise HTTPException(500, str(e))

@app.get("/api/weather/city/{city_name}")
async def weather_city(city_name: str):
    city = next((c for c in CITIES if c["name"].lower() == city_name.lower()), None)
    if not city:
        raise HTTPException(404, f"City '{city_name}' not found")
    return await weather_point(PointRequest(lat=city["lat"], lon=city["lon"]))
