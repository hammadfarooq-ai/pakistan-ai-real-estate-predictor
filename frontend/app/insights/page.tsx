"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchInsights, fetchProperties } from "@/lib/api";
import type { InsightsResponse, PropertyListing } from "@/types";
import { StatCard } from "@/components/ui/stat-card";
import { PriceDistributionChart } from "@/components/charts/price-distribution-chart";
import { CityComparisonChart } from "@/components/charts/city-comparison-chart";
import { BedroomImpactChart } from "@/components/charts/bedroom-impact-chart";

function buildPriceBands(properties: PropertyListing[]) {
  const bands = [
    { label: "< 1 Cr", max: 10_000_000, count: 0 },
    { label: "1-2 Cr", max: 20_000_000, count: 0 },
    { label: "2-4 Cr", max: 40_000_000, count: 0 },
    { label: "> 4 Cr", max: Number.POSITIVE_INFINITY, count: 0 }
  ];

  properties.forEach((row) => {
    const band = bands.find((item) => row.price <= item.max);
    if (band) {
      band.count += 1;
    }
  });

  return bands.map((item) => ({ band: item.label, count: item.count }));
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<InsightsResponse | null>(null);
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const [insightsData, propertiesData] = await Promise.all([fetchInsights(), fetchProperties()]);
        setInsights(insightsData);
        setProperties(propertiesData);
      } catch {
        setError("Unable to load insights data. Please verify backend availability.");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, []);

  const priceDistribution = useMemo(() => buildPriceBands(properties), [properties]);

  if (loading) {
    return <div className="panel">Loading market insights...</div>;
  }

  if (error || !insights) {
    return <div className="panel text-red-300">{error ?? "No insights data found."}</div>;
  }

  return (
    <section className="space-y-5">
      <div className="panel">
        <h1 className="text-2xl font-semibold">Market Insights Dashboard</h1>
        <p className="mt-1 text-sm text-slate-400">Automatic EDA view over Lahore and Karachi listing trends.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Listings" value={new Intl.NumberFormat("en-PK").format(insights.summary.total_rows)} />
        <StatCard
          title="Top Area"
          value={insights.summary.avg_price_by_area[0]?.location_area ?? "N/A"}
          helper="Highest average pricing area"
        />
        <StatCard
          title="Strongest Bedroom Segment"
          value={`${insights.summary.bedroom_impact.at(-1)?.bedrooms ?? 0} Beds`}
          helper="Most premium bedroom count in current data"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PriceDistributionChart data={priceDistribution} />
        <CityComparisonChart data={insights.summary.city_avg_prices} />
      </div>

      <BedroomImpactChart data={insights.summary.bedroom_impact} />

      <div className="panel">
        <h2 className="text-lg font-semibold">Average Price per Area</h2>
        <div className="mt-4 max-h-72 overflow-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 bg-slate-900">
              <tr className="border-b border-slate-700">
                <th className="px-4 py-3">Area</th>
                <th className="px-4 py-3">Average Price (PKR)</th>
              </tr>
            </thead>
            <tbody>
              {insights.summary.avg_price_by_area.map((row) => (
                <tr key={row.location_area} className="border-b border-slate-800/70">
                  <td className="px-4 py-2">{row.location_area}</td>
                  <td className="px-4 py-2">{new Intl.NumberFormat("en-PK").format(Math.round(row.avg_price))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
