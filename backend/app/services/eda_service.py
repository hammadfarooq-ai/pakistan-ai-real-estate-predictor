from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.property import PropertyListing


class EDAService:
    def get_summary(self, db: Session) -> dict:
        total_rows = db.scalar(select(func.count(PropertyListing.id))) or 0

        city_avg_prices = db.execute(
            select(PropertyListing.city, func.avg(PropertyListing.price))
            .group_by(PropertyListing.city)
            .order_by(PropertyListing.city)
        ).all()

        avg_price_by_area = db.execute(
            select(PropertyListing.location_area, func.avg(PropertyListing.price))
            .group_by(PropertyListing.location_area)
            .order_by(func.avg(PropertyListing.price).desc())
            .limit(25)
        ).all()

        bedroom_impact = db.execute(
            select(PropertyListing.bedrooms, func.avg(PropertyListing.price))
            .where(PropertyListing.bedrooms.is_not(None))
            .group_by(PropertyListing.bedrooms)
            .order_by(PropertyListing.bedrooms)
        ).all()

        return {
            "total_rows": total_rows,
            "city_avg_prices": [
                {"city": city, "avg_price": float(avg_price)}
                for city, avg_price in city_avg_prices
            ],
            "avg_price_by_area": [
                {"location_area": area, "avg_price": float(avg_price)}
                for area, avg_price in avg_price_by_area
            ],
            "bedroom_impact": [
                {"bedrooms": int(bedrooms), "avg_price": float(avg_price)}
                for bedrooms, avg_price in bedroom_impact
            ],
        }


eda_service = EDAService()

