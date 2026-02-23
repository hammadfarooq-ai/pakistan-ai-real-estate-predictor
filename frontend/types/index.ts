export type PredictionInput = {
  city: string;
  location_area: string;
  area_size: number;
  bedrooms: number;
  bathrooms: number;
  property_type: string;
};

export type PredictionOutput = {
  predicted_price: number;
  confidence_score: number;
  price_range_min: number;
  price_range_max: number;
};

export type RoiInput = {
  purchase_price: number;
  predicted_future_price: number;
  years: number;
  expected_growth_rate: number;
};

export type RoiOutput = {
  expected_roi_percentage: number;
  yearly_projection: Array<{ year: number; projected_price: number }>;
  profit_estimation: number;
};

export type PropertyListing = {
  id: number;
  price: number;
  city: string;
  location_area: string;
  property_type: string;
  area_size_marla: number;
  bedrooms: number | null;
  bathrooms: number | null;
  latitude: number | null;
  longitude: number | null;
  listing_date: string | null;
};

export type InsightsSummary = {
  total_rows: number;
  city_avg_prices: Array<{ city: string; avg_price: number }>;
  avg_price_by_area: Array<{ location_area: string; avg_price: number }>;
  bedroom_impact: Array<{ bedrooms: number; avg_price: number }>;
};

export type InsightsResponse = {
  summary: InsightsSummary;
  charts: Record<string, unknown>;
};
