from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.prediction_history import PredictionHistory
from app.schemas.prediction import PredictionInput, PredictionOutput
from app.services.prediction_service import prediction_service

router = APIRouter(tags=["prediction"])


@router.post("/predict", response_model=PredictionOutput)
def predict_price(payload: PredictionInput, db: Session = Depends(get_db)) -> PredictionOutput:
    result = prediction_service.predict(payload)

    history = PredictionHistory(
        city=payload.city,
        location_area=payload.location_area,
        property_type=payload.property_type,
        area_size_marla=payload.area_size,
        bedrooms=payload.bedrooms,
        bathrooms=payload.bathrooms,
        predicted_price=result.predicted_price,
        confidence_score=result.confidence_score,
    )
    db.add(history)
    db.commit()

    return result

