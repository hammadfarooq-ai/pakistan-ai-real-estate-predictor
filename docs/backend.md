# Backend Guide

## Backend Tech

- FastAPI for APIs
- SQLAlchemy ORM
- PostgreSQL
- Pydantic settings and schemas
- Scikit-learn/XGBoost model pipeline

## Main Entry Point

- `backend/app/main.py`

This file:

- Creates the FastAPI app
- Registers CORS middleware
- Mounts API routes under `/api/v1`
- Creates DB tables on startup using SQLAlchemy metadata

## Important Modules

### Configuration

- `backend/app/core/config.py`

Defines application settings loaded from `.env`:

- app metadata
- API prefix
- secret key and token expiry
- database URL
- model artifact locations

### Database

- `backend/app/db/base.py`
- `backend/app/db/session.py`

Provides ORM base class, engine, and request-scoped DB session dependency.

### Models

- `backend/app/models/property.py`
- `backend/app/models/prediction_history.py`
- `backend/app/models/user.py`

Tables include:

- `property_listings`
- `prediction_history`
- `users`

### Services

- `prediction_service.py`: loads saved model, predicts price, returns confidence/range
- `roi_service.py`: computes ROI and yearly projection
- `eda_service.py`: aggregates listing insights for dashboard

### Security

- `backend/app/utils/security.py`

Contains:

- bcrypt-based password hashing
- JWT creation utility

## Route Modules

- `health.py`
- `predict.py`
- `roi.py`
- `properties.py`
- `insights.py`
- `auth.py`
- `router.py`

## Scripts

- `scripts/scrape_zameen.py`
- `scripts/clean_dataset.py`
- `scripts/train_model.py`
- `scripts/retrain_model.py`

These scripts support data ingestion and model lifecycle operations.
