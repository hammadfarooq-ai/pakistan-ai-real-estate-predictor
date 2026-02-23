"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Props = {
  data: Array<{ bedrooms: number; avg_price: number }>;
};

export function BedroomImpactChart({ data }: Props) {
  return (
    <div className="panel h-[320px]">
      <h3 className="mb-3 text-sm font-semibold text-slate-300">Bedroom Impact on Price</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="bedrooms" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip formatter={(v: number) => new Intl.NumberFormat("en-PK").format(v)} />
          <Line type="monotone" dataKey="avg_price" stroke="#f59e0b" strokeWidth={3} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
