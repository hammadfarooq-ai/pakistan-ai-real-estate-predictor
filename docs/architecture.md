# Architecture

## High-Level Flow

1. Property data is scraped from listing sources.
2. Scraped records are cleaned and standardized.
3. Data is stored in PostgreSQL.
4. ML models are trained and the best model is saved as a joblib artifact.
5. FastAPI serves prediction/insight/ROI/auth endpoints.
6. Next.js frontend consumes backend APIs and renders analytics, prediction UX, and maps.

## Monorepo Structure

```text
backend/
  app/
    api/v1/
    core/
    db/
    ml/
    models/
    schemas/
    services/
    utils/
  scripts/
  requirements.txt
  Dockerfile
frontend/
  app/
  components/
  lib/
  types/
  Dockerfile
docker-compose.yml
docs/
```

## Backend Layers

- `api/v1`: FastAPI routes and endpoint handlers
- `schemas`: Pydantic request/response contracts
- `models`: SQLAlchemy ORM entities
- `services`: domain logic (prediction, ROI, EDA)
- `ml`: preprocessing and training pipeline
- `db`: engine and session setup
- `core`: global settings
- `utils`: security helpers (password hashing, JWT)

## Frontend Layers

- `app`: route-based pages (App Router)
- `components/ui`: shared UI widgets
- `components/charts`: analytics charts
- `components/map`: map visualization components
- `lib/api.ts`: Axios client and API calls
- `types`: shared TypeScript types

## Storage and Artifacts

- PostgreSQL stores listings, users, and prediction history.
- Model artifacts are expected in `backend/artifacts/` (for example `best_price_model.joblib`).
