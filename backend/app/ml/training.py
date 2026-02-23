from __future__ import annotations

from dataclasses import dataclass

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import GridSearchCV, cross_val_score, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

from app.core.config import get_settings
from app.ml.preprocess import clean_dataframe

try:
    from xgboost import XGBRegressor

    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False


@dataclass
class TrainingResult:
    model_name: str
    mae: float
    rmse: float
    r2: float
    cv_mean: float


def train_best_model(csv_path: str) -> TrainingResult:
    settings = get_settings()
    raw = pd.read_csv(csv_path)
    df = clean_dataframe(raw)

    features = ["city", "location_area", "property_type", "area_size_marla", "bedrooms", "bathrooms"]
    target = "price"

    X = df[features]
    y = df[target]

    categorical = ["city", "location_area", "property_type"]
    numeric = ["area_size_marla", "bedrooms", "bathrooms"]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical),
            ("num", "passthrough", numeric),
        ]
    )

    model_candidates: dict[str, tuple[object, dict]] = {
        "linear_regression": (
            LinearRegression(),
            {},
        ),
        "random_forest": (
            RandomForestRegressor(random_state=42),
            {
                "model__n_estimators": [150, 300],
                "model__max_depth": [12, 20, None],
                "model__min_samples_split": [2, 5],
            },
        ),
    }

    if HAS_XGBOOST:
        model_candidates["xgboost"] = (
            XGBRegressor(
                objective="reg:squarederror",
                random_state=42,
                n_estimators=300,
            ),
            {
                "model__max_depth": [4, 8],
                "model__learning_rate": [0.03, 0.1],
                "model__subsample": [0.8, 1.0],
            },
        )

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
    )

    best_name = ""
    best_estimator = None
    best_rmse = float("inf")
    best_metrics = None

    for model_name, (model, param_grid) in model_candidates.items():
        pipeline = Pipeline(
            steps=[
                ("preprocessor", preprocessor),
                ("model", model),
            ]
        )

        if param_grid:
            search = GridSearchCV(
                estimator=pipeline,
                param_grid=param_grid,
                cv=3,
                scoring="neg_root_mean_squared_error",
                n_jobs=-1,
            )
            search.fit(X_train, y_train)
            estimator = search.best_estimator_
        else:
            estimator = pipeline.fit(X_train, y_train)

        preds = estimator.predict(X_test)
        mae = mean_absolute_error(y_test, preds)
        rmse = mean_squared_error(y_test, preds) ** 0.5
        r2 = r2_score(y_test, preds)
        cv = cross_val_score(
            estimator,
            X_train,
            y_train,
            cv=3,
            scoring="neg_root_mean_squared_error",
            n_jobs=-1,
        )
        cv_mean = float((-cv).mean())

        if rmse < best_rmse:
            best_rmse = rmse
            best_name = model_name
            best_estimator = estimator
            best_metrics = (mae, rmse, r2, cv_mean)

    payload = {"model": best_estimator, "rmse": best_rmse, "model_name": best_name}
    settings.model_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(payload, settings.model_path)

    assert best_metrics is not None
    return TrainingResult(
        model_name=best_name,
        mae=float(best_metrics[0]),
        rmse=float(best_metrics[1]),
        r2=float(best_metrics[2]),
        cv_mean=float(best_metrics[3]),
    )

