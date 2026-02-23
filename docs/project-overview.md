# Project Overview

## Goal

Build a production-ready full-stack AI application to predict house prices in Lahore and Karachi, provide market insights, visualize property prices on a map, and calculate expected ROI.

## Core Features

- AI-based property price prediction
- ROI prediction and yearly projection
- Market insights dashboard (EDA-style analytics)
- Leaflet-based map visualization with markers and heat intensity circles
- PostgreSQL-backed data storage for listings and prediction history
- Script-based data scraping, cleaning, and model retraining pipeline
- Dockerized multi-service deployment

## Technology Stack

### Backend

- Python
- FastAPI
- SQLAlchemy
- PostgreSQL (via `psycopg`)
- Scikit-learn
- Pandas, NumPy
- XGBoost (optional)
- Joblib

### Frontend

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Axios
- Recharts
- Leaflet + React Leaflet

### DevOps

- Docker
- Docker Compose
- `.env` driven configuration

## Current Scope

The current implementation includes:

- Full backend API scaffold with prediction/ROI/auth/properties/insights routes
- End-to-end frontend pages:
  - Home
  - Price Prediction
  - Market Insights
  - ROI Calculator
  - Map View
- Scripts for scraping, cleaning, training, and retraining
