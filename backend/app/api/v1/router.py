from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.health import router as health_router
from app.api.v1.insights import router as insights_router
from app.api.v1.predict import router as prediction_router
from app.api.v1.properties import router as properties_router
from app.api.v1.roi import router as roi_router

api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(prediction_router)
api_router.include_router(roi_router)
api_router.include_router(properties_router)
api_router.include_router(insights_router)
api_router.include_router(auth_router)

