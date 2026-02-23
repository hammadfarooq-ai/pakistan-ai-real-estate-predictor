from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path

import joblib
import pandas as pd
from sklearn.pipeline import Pipeline

from app.core.config import get_settings
from app.schemas.prediction import PredictionInput, PredictionOutput


@dataclass
class ModelArtifacts:
    model: Pipeline | None
    rmse: float


class PredictionService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self.artifacts = self._load_artifacts()

    def _load_artifacts(self) -> ModelArtifacts:
        model_path = Path(self.settings.model_path)
        if not model_path.exists():
            return ModelArtifacts(model=None, rmse=2_000_000.0)

        payload = joblib.load(model_path)
        if isinstance(payload, dict):
            return ModelArtifacts(
                model=payload.get("model"),
                rmse=float(payload.get("rmse", 2_000_000.0)),
            )
        return ModelArtifacts(model=payload, rmse=2_000_000.0)

    def _fallback_prediction(self, data: PredictionInput) -> float:
        city_multiplier = {"lahore": 1.0, "karachi": 1.2}
        type_multiplier = {"house": 1.0, "flat": 0.8, "plot": 0.65}
        base = 1_500_000
        area_component = data.area_size * 800_000
        room_component = (data.bedrooms * 350_000) + (data.bathrooms * 150_000)

        city_factor = city_multiplier.get(data.city.strip().lower(), 1.0)
        type_factor = type_multiplier.get(data.property_type.strip().lower(), 1.0)
        return (base + area_component + room_component) * city_factor * type_factor

    def predict(self, data: PredictionInput) -> PredictionOutput:
        if self.artifacts.model is None:
            predicted = self._fallback_prediction(data)
        else:
            frame = pd.DataFrame(
                [
                    {
                        "city": data.city,
                        "location_area": data.location_area,
                        "area_size_marla": data.area_size,
                        "bedrooms": data.bedrooms,
                        "bathrooms": data.bathrooms,
                        "property_type": data.property_type,
                    }
                ]
            )
            predicted = float(self.artifacts.model.predict(frame)[0])

        spread = max(self.artifacts.rmse, predicted * 0.08)
        min_price = max(0.0, predicted - spread)
        max_price = predicted + spread
        confidence = max(0.5, min(0.98, 1 - (spread / max(predicted, 1.0))))

        return PredictionOutput(
            predicted_price=round(predicted, 2),
            confidence_score=round(confidence, 4),
            price_range_min=round(min_price, 2),
            price_range_max=round(max_price, 2),
        )


prediction_service = PredictionService()

