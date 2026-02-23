from __future__ import annotations

import re

import numpy as np
import pandas as pd


def convert_area_to_marla(value: str | float | int) -> float | None:
    if value is None:
        return None
    if isinstance(value, (float, int)):
        return float(value)

    raw = str(value).strip().lower().replace(",", "")
    match = re.search(r"([\d.]+)\s*(marla|kanal|sq\.?\s*ft|sqft)?", raw)
    if not match:
        return None

    quantity = float(match.group(1))
    unit = match.group(2) or "marla"
    unit = unit.replace(" ", "")

    if unit == "marla":
        return quantity
    if unit == "kanal":
        return quantity * 20.0
    if unit in {"sq.ft", "sqft"}:
        return quantity / 225.0
    return quantity


def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    data = df.copy()

    data = data.drop_duplicates(
        subset=["price", "city", "location_area", "property_type", "area_size_marla"]
    )

    if "area_size" in data.columns and "area_size_marla" not in data.columns:
        data["area_size_marla"] = data["area_size"].apply(convert_area_to_marla)

    for col in ["city", "location_area", "property_type"]:
        data[col] = data[col].astype(str).str.strip()

    numeric_cols = ["price", "area_size_marla", "bedrooms", "bathrooms"]
    for col in numeric_cols:
        data[col] = pd.to_numeric(data[col], errors="coerce")

    data["bedrooms"] = data["bedrooms"].fillna(data["bedrooms"].median())
    data["bathrooms"] = data["bathrooms"].fillna(data["bathrooms"].median())
    data["area_size_marla"] = data["area_size_marla"].fillna(
        data["area_size_marla"].median()
    )

    data = data.dropna(subset=["price", "city", "location_area", "property_type"])

    # Clip outlier prices using IQR for more stable training.
    q1 = data["price"].quantile(0.25)
    q3 = data["price"].quantile(0.75)
    iqr = q3 - q1
    lower = max(0, q1 - 1.5 * iqr)
    upper = q3 + 1.5 * iqr
    data["price"] = np.clip(data["price"], lower, upper)

    return data

