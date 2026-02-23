"use client";

import { useState } from "react";
import { predictPrice } from "@/lib/api";
import type { PredictionInput, PredictionOutput } from "@/types";
import { StatCard } from "@/components/ui/stat-card";

const defaultForm: PredictionInput = {
  city: "Lahore",
  location_area: "DHA Phase 6",
  area_size: 10,
  bedrooms: 4,
  bathrooms: 4,
  property_type: "House"
};

const currency = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0
});

export default function PredictPage() {
  const [form, setForm] = useState<PredictionInput>(defaultForm);
  const [result, setResult] = useState<PredictionOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onChange = (key: keyof PredictionInput, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]:
        key === "area_size" || key === "bedrooms" || key === "bathrooms"
          ? Number(value)
          : value
    }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await predictPrice(form);
      setResult(data);
    } catch {
      setError("Prediction request failed. Check backend/API URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="panel">
        <h1 className="text-2xl font-semibold">Price Prediction</h1>
        <p className="mt-1 text-sm text-slate-400">
          Submit property features to estimate market price and confidence range.
        </p>
      </div>

      <form onSubmit={onSubmit} className="panel grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span>City</span>
          <select className="input" value={form.city} onChange={(e) => onChange("city", e.target.value)}>
            <option>Lahore</option>
            <option>Karachi</option>
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span>Location Area</span>
          <input className="input" value={form.location_area} onChange={(e) => onChange("location_area", e.target.value)} />
        </label>

        <label className="space-y-1 text-sm">
          <span>Property Type</span>
          <select className="input" value={form.property_type} onChange={(e) => onChange("property_type", e.target.value)}>
            <option>House</option>
            <option>Flat</option>
            <option>Plot</option>
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span>Area Size (Marla)</span>
          <input className="input" type="number" min={1} step="0.5" value={form.area_size} onChange={(e) => onChange("area_size", e.target.value)} />
        </label>

        <label className="space-y-1 text-sm">
          <span>Bedrooms</span>
          <input className="input" type="number" min={0} max={20} value={form.bedrooms} onChange={(e) => onChange("bedrooms", e.target.value)} />
        </label>

        <label className="space-y-1 text-sm">
          <span>Bathrooms</span>
          <input className="input" type="number" min={0} max={20} value={form.bathrooms} onChange={(e) => onChange("bathrooms", e.target.value)} />
        </label>

        <div className="sm:col-span-2">
          <button type="submit" className="button-primary w-full" disabled={loading}>
            {loading ? "Predicting..." : "Predict Price"}
          </button>
        </div>
      </form>

      {error ? <div className="panel text-sm text-red-300">{error}</div> : null}

      {result ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard title="Predicted Price" value={currency.format(result.predicted_price)} />
          <StatCard title="Confidence Score" value={`${(result.confidence_score * 100).toFixed(1)}%`} />
          <StatCard
            title="Estimated Range"
            value={`${currency.format(result.price_range_min)} - ${currency.format(result.price_range_max)}`}
          />
        </div>
      ) : null}
    </section>
  );
}
