from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.property import PropertyListing
from app.schemas.property import PropertyListingRead

router = APIRouter(tags=["properties"])


@router.get("/properties", response_model=list[PropertyListingRead])
def list_properties(
    city: str | None = Query(default=None),
    limit: int = Query(default=100, ge=1, le=1000),
    db: Session = Depends(get_db),
) -> list[PropertyListingRead]:
    query = select(PropertyListing).order_by(PropertyListing.id.desc()).limit(limit)
    if city:
        query = query.where(PropertyListing.city.ilike(city))

    rows = db.scalars(query).all()
    return [PropertyListingRead.model_validate(row) for row in rows]

