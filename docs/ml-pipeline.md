# Machine Learning Pipeline

## Objective

Predict residential property prices using structured listing features from Lahore and Karachi.

## Training Script

- `backend/scripts/train_model.py`
- Core training logic: `backend/app/ml/training.py`

## Feature Set

- `city`
- `location_area`
- `property_type`
- `area_size_marla`
- `bedrooms`
- `bathrooms`

Target:

- `price`

## Models

- Linear Regression
- Random Forest Regressor
- XGBoost Regressor (if installed)

## Model Selection Strategy

- Train-test split
- GridSearchCV for tunable models
- Cross-validation RMSE
- Select model with lowest RMSE

## Metrics

- MAE
- RMSE
- R2
- CV RMSE mean

## Persistence

Best model is saved with metadata using joblib:

- Default output: `backend/artifacts/best_price_model.joblib`
- Includes model object and RMSE

## Inference

`prediction_service.py`:

- loads model artifact if available
- falls back to heuristic prediction if artifact is not present
- computes confidence score and prediction range

## Retraining

Script: `backend/scripts/retrain_model.py`

Runs:

1. scrape
2. clean
3. train

Example:

```bash
python scripts/retrain_model.py --city lahore --pages 5
```
