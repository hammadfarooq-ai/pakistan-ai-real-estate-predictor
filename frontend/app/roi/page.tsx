"use client";

import { useState } from "react";
import { predictRoi } from "@/lib/api";
import type { RoiInput, RoiOutput } from "@/types";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { StatCard } from "@/components/ui/stat-card";

const defaultForm: RoiInput = {
  purchase_price: 25_000_000,
  predicted_future_price: 36_000_000,
  years: 5,
  expected_growth_rate: 10
};

export default function RoiPage() {
  const [form, setForm] = useState<RoiInput>(defaultForm);
  const [result, setResult] = useState<RoiOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (key: keyof RoiInput, value: string) => {
    setForm((prev) => ({ ...prev, [key]: Number(value) }));
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await predictRoi(form);
      setResult(data);
    } catch {
      setError("ROI API request failed. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-6">
      <div className="panel">
        <h1 className="text-2xl font-semibold">ROI Calculator</h1>
        <p className="mt-1 text-sm text-slate-400">
          Estimate return on investment from purchase value, growth rate, and future market forecast.
        </p>
      </div>

      <form onSubmit={onSubmit} className="panel grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 text-sm">
          <span>Purchase Price (PKR)</span>
          <input className="input" type="number" min={1} value={form.purchase_price} onChange={(e) => updateField("purchase_price", e.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span>Predicted Future Price (PKR)</span>
          <input className="input" type="number" min={1} value={form.predicted_future_price} onChange={(e) => updateField("predicted_future_price", e.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span>Years</span>
          <input className="input" type="number" min={1} max={50} value={form.years} onChange={(e) => updateField("years", e.target.value)} />
        </label>
        <label className="space-y-1 text-sm">
          <span>Expected Growth Rate (%)</span>
          <input className="input" type="number" value={form.expected_growth_rate} onChange={(e) => updateField("expected_growth_rate", e.target.value)} />
        </label>
        <div className="sm:col-span-2">
          <button className="button-primary w-full" type="submit" disabled={loading}>
            {loading ? "Calculating..." : "Calculate ROI"}
          </button>
        </div>
      </form>

      {error ? <div className="panel text-red-300">{error}</div> : null}

      {result ? (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard title="Expected ROI" value={`${result.expected_roi_percentage}%`} />
            <StatCard title="Estimated Profit" value={new Intl.NumberFormat("en-PK").format(Math.round(result.profit_estimation))} helper="PKR" />
            <StatCard title="Projection Horizon" value={`${result.yearly_projection.length} Years`} />
          </div>

          <div className="panel h-[360px]">
            <h3 className="mb-3 text-sm font-semibold text-slate-300">Yearly Projection</h3>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.yearly_projection}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="year" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip formatter={(v: number) => new Intl.NumberFormat("en-PK").format(v)} />
                <Area type="monotone" dataKey="projected_price" stroke="#10b981" fill="#10b98155" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      ) : null}
    </section>
  );
}
