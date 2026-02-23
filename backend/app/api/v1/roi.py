from fastapi import APIRouter

from app.schemas.roi import ROIPredictionInput, ROIPredictionOutput
from app.services.roi_service import roi_service

router = APIRouter(tags=["roi"])


@router.post("/roi-predict", response_model=ROIPredictionOutput)
def predict_roi(payload: ROIPredictionInput) -> ROIPredictionOutput:
    return roi_service.predict_roi(payload)

