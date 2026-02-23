"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { fetchProperties } from "@/lib/api";
import type { PropertyListing } from "@/types";

const PropertyMap = dynamic(() => import("@/components/map/property-map").then((mod) => mod.PropertyMap), {
  ssr: false,
  loading: () => <div className="panel">Loading map...</div>
});

export default function MapPage() {
  const [city, setCity] = useState("Lahore");
  const [properties, setProperties] = useState<PropertyListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProperties(city);
        setProperties(data);
      } catch {
        setError("Could not load map listings. Ensure API is running.");
      } finally {
        setLoading(false);
      }
    };
    void run();
  }, [city]);

  return (
    <section className="space-y-5">
      <div className="panel flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Map View</h1>
          <p className="mt-1 text-sm text-slate-400">Property markers and area heat intensity based on average prices.</p>
        </div>
        <label className="space-y-1 text-sm">
          <span>City</span>
          <select className="input min-w-40" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="Lahore">Lahore</option>
            <option value="Karachi">Karachi</option>
          </select>
        </label>
      </div>

      {loading ? <div className="panel">Loading properties...</div> : null}
      {error ? <div className="panel text-red-300">{error}</div> : null}
      {!loading && !error ? <PropertyMap properties={properties} /> : null}
    </section>
  );
}
