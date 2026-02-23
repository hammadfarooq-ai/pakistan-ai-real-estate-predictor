from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.eda import EDAResponse
from app.services.eda_service import eda_service

router = APIRouter(tags=["insights"])


@router.get("/insights", response_model=EDAResponse)
def get_market_insights(db: Session = Depends(get_db)) -> EDAResponse:
    summary = eda_service.get_summary(db)
    charts = {
        "price_distribution": {
            "type": "histogram",
            "source": "frontend_recharts_or_plotly",
        },
        "city_comparison": {
            "type": "bar",
            "data": summary["city_avg_prices"],
        },
        "bedroom_impact": {
            "type": "line",
            "data": summary["bedroom_impact"],
        },
    }
    return EDAResponse(summary=summary, charts=charts)

