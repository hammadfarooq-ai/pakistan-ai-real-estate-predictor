import axios from "axios";
import type {
  InsightsResponse,
  PredictionInput,
  PredictionOutput,
  PropertyListing,
  RoiInput,
  RoiOutput
} from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1",
  timeout: 30000
});

export async function predictPrice(payload: PredictionInput) {
  const { data } = await api.post<PredictionOutput>("/predict", payload);
  return data;
}

export async function predictRoi(payload: RoiInput) {
  const { data } = await api.post<RoiOutput>("/roi-predict", payload);
  return data;
}

export async function fetchInsights() {
  const { data } = await api.get<InsightsResponse>("/insights");
  return data;
}

export async function fetchProperties(city?: string) {
  const { data } = await api.get<PropertyListing[]>("/properties", {
    params: {
      city: city || undefined,
      limit: 500
    }
  });
  return data;
}
