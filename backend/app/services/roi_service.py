from app.schemas.roi import ROIPredictionInput, ROIPredictionOutput


class ROIService:
    def predict_roi(self, payload: ROIPredictionInput) -> ROIPredictionOutput:
        growth = payload.expected_growth_rate / 100.0
        yearly_projection: list[dict[str, float]] = []
        running_value = payload.purchase_price

        for year in range(1, payload.years + 1):
            running_value *= 1 + growth
            yearly_projection.append(
                {
                    "year": float(year),
                    "projected_price": round(running_value, 2),
                }
            )

        model_weighted_future_price = (
            (payload.predicted_future_price * 0.7) + (running_value * 0.3)
        )
        profit = model_weighted_future_price - payload.purchase_price
        roi_pct = (profit / payload.purchase_price) * 100

        return ROIPredictionOutput(
            expected_roi_percentage=round(roi_pct, 2),
            yearly_projection=yearly_projection,
            profit_estimation=round(profit, 2),
        )


roi_service = ROIService()

