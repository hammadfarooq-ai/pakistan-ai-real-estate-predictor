# Data, Scraping, and Cleaning

## Scraping Workflow

Script: `backend/scripts/scrape_zameen.py`

### Supported Approach

- Requests + BeautifulSoup (default)
- Selenium fallback (`--selenium`) for pages requiring dynamic rendering

### Target Fields

- `price`
- `city`
- `location_area`
- `property_type`
- `area_size`
- `bedrooms`
- `bathrooms`
- `latitude`
- `longitude`
- `listing_date`

### Output

Parsed listings are inserted into PostgreSQL (`property_listings`) with dedupe logic using `source_listing_id` when available.

## Cleaning Workflow

Module: `backend/app/ml/preprocess.py`  
Script: `backend/scripts/clean_dataset.py`

### Cleaning Steps

- Drop duplicate rows by core attributes
- Convert area units to marla (`marla`, `kanal`, `sqft`)
- Normalize key categorical text fields
- Cast numeric columns
- Fill missing numeric values with median
- Remove rows missing essential categorical/target fields
- Apply IQR clipping for extreme price outliers

## Typical Commands

From `backend/`:

```bash
python scripts/scrape_zameen.py --city lahore --pages 3
python scripts/clean_dataset.py --output artifacts/cleaned_properties.csv
```
