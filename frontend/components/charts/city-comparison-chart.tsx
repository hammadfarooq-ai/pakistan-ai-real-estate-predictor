"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Props = {
  data: Array<{ city: string; avg_price: number }>;
};

export function CityComparisonChart({ data }: Props) {
  return (
    <div className="panel h-[320px]">
      <h3 className="mb-3 text-sm font-semibold text-slate-300">City Comparison: Lahore vs Karachi</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="city" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip formatter={(v: number) => new Intl.NumberFormat("en-PK").format(v)} />
          <Bar dataKey="avg_price" fill="#22d3ee" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
