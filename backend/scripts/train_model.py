import argparse

from app.ml.training import train_best_model


def main() -> None:
    parser = argparse.ArgumentParser(description="Train and persist best model.")
    parser.add_argument("--dataset", default="artifacts/cleaned_properties.csv")
    args = parser.parse_args()

    result = train_best_model(args.dataset)
    print(
        "Best model:",
        result.model_name,
        "| MAE:",
        round(result.mae, 2),
        "| RMSE:",
        round(result.rmse, 2),
        "| R2:",
        round(result.r2, 4),
        "| CV_RMSE:",
        round(result.cv_mean, 2),
    )


if __name__ == "__main__":
    main()

