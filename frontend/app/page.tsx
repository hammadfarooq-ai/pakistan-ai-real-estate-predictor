import Link from "next/link";
import { Home, LineChart, MapPinned, TrendingUp } from "lucide-react";

const cards = [
  {
    href: "/predict",
    title: "Price Prediction",
    icon: Home,
    description: "Predict current property value in Lahore or Karachi using ML-driven estimations."
  },
  {
    href: "/insights",
    title: "Market Insights",
    icon: LineChart,
    description: "Explore area-wise trends, price distribution, and city comparison visual analytics."
  },
  {
    href: "/roi",
    title: "ROI Calculator",
    icon: TrendingUp,
    description: "Estimate investment returns with growth assumptions and yearly projections."
  },
  {
    href: "/map",
    title: "Map View",
    icon: MapPinned,
    description: "Visualize listings on map markers with price bands and area-based heat intensity."
  }
];

export default function HomePage() {
  return (
    <section className="space-y-8">
      <div className="panel space-y-3">
        <p className="inline-flex rounded-full border border-brand-500/40 bg-brand-500/15 px-3 py-1 text-xs font-medium text-brand-200">
          Production-ready AI Workflow
        </p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Pakistan AI Real Estate Price Predictor
        </h1>
        <p className="max-w-3xl text-sm text-slate-300 sm:text-base">
          Full-stack intelligence platform for Lahore and Karachi property pricing, market behavior analysis, ROI forecasting, and map-based exploration.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link key={card.href} href={card.href} className="panel transition hover:border-brand-500/60 hover:shadow-brand-900/30">
            <card.icon className="mb-4 text-brand-400" size={22} />
            <h2 className="text-lg font-semibold">{card.title}</h2>
            <p className="mt-2 text-sm text-slate-400">{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
