from typing import Any

from pydantic import BaseModel


class EDAResponse(BaseModel):
    summary: dict[str, Any]
    charts: dict[str, Any]

