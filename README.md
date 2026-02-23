# Pakistan AI Real Estate Price Predictor

AI-powered full-stack platform to predict property prices in **Lahore** and **Karachi**, explore market trends, evaluate ROI, and visualize listings on an interactive map.

## Features

- Price prediction API using ML models (Linear Regression, Random Forest, optional XGBoost)
- ROI prediction with yearly projection
- Market insights dashboard (EDA-style analytics)
- Map-based property visualization with price-band markers and area heat intensity
- JWT-based auth endpoints (bonus)
- End-to-end data pipeline (scrape -> clean -> train -> serve)
- Dockerized multi-service stack (PostgreSQL, FastAPI, Next.js)

## Tech Stack

### Backend

- Python, FastAPI, SQLAlchemy
- PostgreSQL (`psycopg`)
- Scikit-learn, Pandas, NumPy, XGBoost (optional), Joblib
- Requests, BeautifulSoup, Selenium (optional)

### Frontend

- Next.js (App Router), React, TypeScript
- Tailwind CSS
- Axios
- Recharts
- Leaflet / React Leaflet

### Infrastructure

- Docker + Docker Compose
- Environment-based configuration via `.env`

## Project Structure

```text
backend/
  app/
  scripts/
  requirements.txt
  Dockerfile
frontend/
  app/
  components/
  lib/
  types/
  Dockerfile
docs/
docker-compose.yml
README.md
```

## Quick Start (Docker)

### 1) Create env files

Copy:

- `backend/.env.example` -> `backend/.env`
- `frontend/.env.example` -> `frontend/.env`

### 2) Start all services

```bash
docker compose up --build
```

### 3) Open the apps

- Frontend: `http://localhost:3000`
- Backend API docs (Swagger): `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/v1/health`

## Key Pages

- `/` Home
- `/predict` Price Prediction
- `/insights` Market Insights Dashboard
- `/roi` ROI Calculator
- `/map` Map View

## Key API Endpoints

Base path: `/api/v1`

- `GET /health`
- `POST /predict`
- `POST /roi-predict`
- `GET /properties`
- `GET /insights`
- `POST /auth/register`
- `POST /auth/login`

## Data & ML Workflow

From `backend/`:

```bash
python scripts/scrape_zameen.py --city lahore --pages 3
python scripts/clean_dataset.py --output artifacts/cleaned_properties.csv
python scripts/train_model.py --dataset artifacts/cleaned_properties.csv
```

Or full retraining pipeline:

```bash
python scripts/retrain_model.py --city lahore --pages 5
```

## Development Notes

- Frontend API base URL is controlled by:
  - `NEXT_PUBLIC_API_BASE_URL`
- Backend route prefix is controlled by:
  - `API_V1_PREFIX`
- Model artifact location is controlled by:
  - `MODEL_DIR` and `MODEL_FILE_NAME`

## Documentation

Detailed docs are in `docs/`:

- `docs/README.md`
- `docs/architecture.md`
- `docs/backend.md`
- `docs/frontend.md`
- `docs/data-pipeline.md`
- `docs/ml-pipeline.md`
- `docs/api-reference.md`
- `docs/environment-variables.md`
- `docs/deployment.md`
- `docs/roadmap.md`

## Production Hardening (Recommended)

- Add Alembic migrations
- Restrict CORS for production domain
- Add test coverage for API and UI flows
- Add observability (logs, metrics, alerts)
- Move secrets to a secret manager

