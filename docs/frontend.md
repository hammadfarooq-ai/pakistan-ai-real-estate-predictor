# Frontend Guide

## Frontend Tech

- Next.js App Router
- React + TypeScript
- Tailwind CSS
- Axios for API calls
- Recharts for analytics graphs
- Leaflet for map visualization

## Frontend Routes

- `/` Home page
- `/predict` Price prediction form and result cards
- `/insights` Market dashboard with EDA visuals
- `/roi` ROI calculator and projection chart
- `/map` Property map and area heat intensity circles

## App Layout and Styling

- `frontend/app/layout.tsx` defines app shell and navbar.
- `frontend/app/globals.css` contains global design tokens and utility classes.
- Tailwind dark mode is class-based and toggled from navbar.

## API Integration

- `frontend/lib/api.ts` centralizes API requests.
- Base URL is configurable via:
  - `NEXT_PUBLIC_API_BASE_URL`

## Reusable Components

### UI

- `components/ui/navbar.tsx`
- `components/ui/stat-card.tsx`

### Charts

- `price-distribution-chart.tsx`
- `city-comparison-chart.tsx`
- `bedroom-impact-chart.tsx`

### Maps

- `components/map/property-map.tsx` renders:
  - listing markers
  - popups with property metadata
  - area-level heat circles by average area price

## Type Safety

- Shared API request/response types are defined in `frontend/types/index.ts`.
