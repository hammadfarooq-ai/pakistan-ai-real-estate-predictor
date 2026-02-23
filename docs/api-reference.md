# API Reference

Base path: `/api/v1`

## Health

### `GET /health`

Returns service status.

Response:

```json
{
  "status": "ok"
}
```

## Price Prediction

### `POST /predict`

Request:

```json
{
  "city": "Lahore",
  "location_area": "DHA Phase 6",
  "area_size": 10,
  "bedrooms": 4,
  "bathrooms": 4,
  "property_type": "House"
}
```

Response:

```json
{
  "predicted_price": 32500000,
  "confidence_score": 0.87,
  "price_range_min": 29900000,
  "price_range_max": 35100000
}
```

## ROI Prediction

### `POST /roi-predict`

Request:

```json
{
  "purchase_price": 25000000,
  "predicted_future_price": 36000000,
  "years": 5,
  "expected_growth_rate": 10
}
```

Response:

```json
{
  "expected_roi_percentage": 44.2,
  "yearly_projection": [
    { "year": 1, "projected_price": 27500000 },
    { "year": 2, "projected_price": 30250000 }
  ],
  "profit_estimation": 11050000
}
```

## Properties

### `GET /properties`

Query params:

- `city` (optional)
- `limit` (optional, default 100)

Returns property listing records for map/dashboard use.

## Insights

### `GET /insights`

Returns summarized analytics:

- total rows
- city average prices
- average price by area
- bedroom impact on price

## Auth (Bonus)

### `POST /auth/register`

Create user and return JWT token.

### `POST /auth/login`

Authenticate and return JWT token.
