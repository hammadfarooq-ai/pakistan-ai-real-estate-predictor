# Deployment Guide

## Local Docker Deployment

From repository root:

```bash
docker compose up --build
```

Services:

- PostgreSQL: `localhost:5432`
- Backend (FastAPI): `localhost:8000`
- Frontend (Next.js): `localhost:3000`

## Prerequisites

- Docker Desktop
- `.env` files created:
  - `backend/.env`
  - `frontend/.env`

## Basic Verification

1. Open `http://localhost:8000/docs` (Swagger UI should load).
2. Open `http://localhost:3000` (frontend should load).
3. Call `/api/v1/health` and verify `{ "status": "ok" }`.

## Recommended Production Hardening

- Use managed PostgreSQL with backups.
- Add reverse proxy (Nginx/Traefik) and TLS.
- Restrict CORS to frontend domain.
- Disable debug mode.
- Store secrets in a secret manager.
- Add DB migrations (Alembic).
- Configure structured logging and monitoring.
