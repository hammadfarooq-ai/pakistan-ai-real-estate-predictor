from typing import Any

from pydantic import BaseModel, Field


class ROIPredictionInput(BaseModel):
    purchase_price: float = Field(..., gt=0)
    predicted_future_price: float = Field(..., gt=0)
    years: int = Field(..., ge=1, le=50)
    expected_growth_rate: float = Field(..., ge=-100, le=500)


class ROIPredictionOutput(BaseModel):
    expected_roi_percentage: float
    yearly_projection: list[dict[str, Any]]
    profit_estimation: float

