import argparse

import pandas as pd
from sqlalchemy import select

from app.db.session import SessionLocal
from app.ml.preprocess import clean_dataframe
from app.models.property import PropertyListing


def export_clean_csv(output_path: str) -> None:
    db = SessionLocal()
    try:
        rows = db.scalars(select(PropertyListing)).all()
        if not rows:
            raise ValueError("No property records found in database.")

        frame = pd.DataFrame(
            [
                {
                    "price": row.price,
                    "city": row.city,
                    "location_area": row.location_area,
                    "property_type": row.property_type,
                    "area_size_marla": row.area_size_marla,
                    "bedrooms": row.bedrooms,
                    "bathrooms": row.bathrooms,
                    "latitude": row.latitude,
                    "longitude": row.longitude,
                    "listing_date": row.listing_date,
                }
                for row in rows
            ]
        )
        cleaned = clean_dataframe(frame)
        cleaned.to_csv(output_path, index=False)
        print(f"Saved cleaned dataset to: {output_path}")
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser(description="Clean scraped property dataset.")
    parser.add_argument("--output", default="artifacts/cleaned_properties.csv")
    args = parser.parse_args()
    export_clean_csv(args.output)


if __name__ == "__main__":
    main()

