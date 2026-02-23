# Roadmap and Next Steps

## High Priority

- Add Alembic migrations for production DB lifecycle.
- Improve scraping reliability with retry/backoff, proxy rotation, and parser monitoring.
- Add backend tests for prediction/ROI/auth endpoints.
- Add frontend integration tests for critical user paths.

## AI and Analytics Enhancements

- Add SHAP explainability endpoint and UI.
- Feature importance visualization for trained models.
- Scheduled retraining jobs with model registry/versioning.
- Confidence calibration with historical performance tracking.

## Product Enhancements

- Complete protected user flows (JWT middleware + profile pages).
- Prediction history UI with filtering and export.
- Admin dashboard for model health and data quality.
- Better map heatmaps using dedicated heatmap layers and clustering.

## Operational Readiness

- CI/CD pipeline (lint/test/build/deploy).
- Observability stack (logs, metrics, alerts).
- Rate limiting and API key controls for public endpoints.
- Backup and disaster recovery runbook.
