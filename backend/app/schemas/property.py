from datetime import date

from pydantic import BaseModel


class PropertyListingRead(BaseModel):
    id: int
    price: float
    city: str
    location_area: str
    property_type: str
    area_size_marla: float
    bedrooms: int | None
    bathrooms: int | None
    latitude: float | None
    longitude: float | None
    listing_date: date | None

    model_config = {"from_attributes": True}

