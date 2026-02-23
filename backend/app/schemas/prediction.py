from pydantic import BaseModel, Field


class PredictionInput(BaseModel):
    city: str = Field(..., examples=["Lahore"])
    location_area: str = Field(..., examples=["DHA Phase 6"])
    area_size: float = Field(..., gt=0, examples=[10.0], description="Property area in marla.")
    bedrooms: int = Field(..., ge=0, le=20)
    bathrooms: int = Field(..., ge=0, le=20)
    property_type: str = Field(..., examples=["House"])


class PredictionOutput(BaseModel):
    predicted_price: float
    confidence_score: float
    price_range_min: float
    price_range_max: float

