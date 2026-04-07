# 🌍 3D Earth Weather Predictor

An immersive full-stack weather visualization platform featuring a 3D interactive globe and machine learning-based forecasting.

---

##  Features

*  Interactive 3D Earth (Three.js)
*  Real-time weather data (Open-Meteo API)
*  Data visualization with charts
*  ML-based weather prediction
*  FastAPI backend

---
##  Working & Demo

### 3D Globe with Weather Prediction UI, Forecasts & Charts
![Working](assets/working.gif)


## How the Forecast Works

The backend fetches 30 days of historical mean temperatures from Open-Meteo's archive API,
then fits a `LinearRegression` model to predict the next 4 days.
If there's insufficient history it falls back to a mean-based estimate.


##  Tech Stack

### Frontend

* React (Vite)
* Three.js
* Tailwind CSS
* Recharts

### Backend

* FastAPI
* Python
* Machine Learning

---

## ⚙️ Setup Instructions

### 1. Clone repo

```bash
git clone https://github.com/TanisqAtrey/3D-Earth-Weather-Predictor.git
cd 3D-Earth-Weather-Predictor
```

### 2. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env             # edit CORS_ORIGINS if needed
uvicorn server:app --reload --port 8000
```


### 3. Frontend

```bash
cd frontend
npm install                      # or: yarn / pnpm install

# Create .env.local
echo "VITE_BACKEND_URL=http://localhost:8000" > .env.local

npm run dev                      # starts at http://localhost:3000
```

---

## 🌐 Deployment(soon)

* Frontend: Vercel
* Backend: Render

---


##  Author

Tanishq Atrey

