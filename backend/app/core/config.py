from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "Pakistan AI Real Estate Price Predictor API"
    app_env: str = "development"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"
    secret_key: str = Field(default="change-me-in-production", min_length=16)
    access_token_expire_minutes: int = 60 * 24

    database_url: str = "postgresql+psycopg://postgres:postgres@db:5432/real_estate_db"

    model_dir: str = "artifacts"
    model_file_name: str = "best_price_model.joblib"
    encoder_file_name: str = "feature_encoder.joblib"

    scraper_user_agent: str = (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
    )

    @property
    def model_path(self) -> Path:
        return Path(self.model_dir) / self.model_file_name

    @property
    def encoder_path(self) -> Path:
        return Path(self.model_dir) / self.encoder_file_name


@lru_cache
def get_settings() -> Settings:
    return Settings()

