# Environment Variables

## Backend (`backend/.env`)

Based on `backend/.env.example`:

- `APP_NAME`  
  API service name.
- `APP_ENV`  
  Environment label (`development`, `production`, etc.).
- `DEBUG`  
  Enable/disable debug mode.
- `API_V1_PREFIX`  
  Prefix for API routes, default `/api/v1`.
- `SECRET_KEY`  
  JWT signing secret. Use a strong random value in production.
- `ACCESS_TOKEN_EXPIRE_MINUTES`  
  Token expiry in minutes.
- `DATABASE_URL`  
  SQLAlchemy database URL.
- `MODEL_DIR`  
  Directory for model artifacts.
- `MODEL_FILE_NAME`  
  Main saved model file.
- `ENCODER_FILE_NAME`  
  Encoder artifact file (if used).
- `SCRAPER_USER_AGENT`  
  User agent string for scraper requests.

## Frontend (`frontend/.env`)

Based on `frontend/.env.example`:

- `NEXT_PUBLIC_API_BASE_URL`  
  Backend API base URL used by Axios in browser/client code.

## Production Notes

- Never commit real secrets.
- Use separate values for development/staging/production.
- Rotate `SECRET_KEY` and DB credentials periodically.
