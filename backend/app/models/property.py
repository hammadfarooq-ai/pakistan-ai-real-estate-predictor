from datetime import date, datetime

from sqlalchemy import Date, DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class PropertyListing(Base):
    __tablename__ = "property_listings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    source_listing_id: Mapped[str | None] = mapped_column(String(128), unique=True, index=True)

    price: Mapped[float] = mapped_column(Float, nullable=False)
    city: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    location_area: Mapped[str] = mapped_column(String(128), index=True, nullable=False)
    property_type: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    area_size_marla: Mapped[float] = mapped_column(Float, nullable=False)
    bedrooms: Mapped[int | None] = mapped_column(Integer)
    bathrooms: Mapped[int | None] = mapped_column(Integer)
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)
    listing_date: Mapped[date | None] = mapped_column(Date)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

